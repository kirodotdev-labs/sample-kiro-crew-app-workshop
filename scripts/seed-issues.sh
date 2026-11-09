#!/usr/bin/env bash
# Create the workshop's seeded issues, and the one pull request among them, in the BASE repo.
#
#   scripts/seed-issues.sh                 # DRY RUN (default): print the commands, write nothing
#   scripts/seed-issues.sh --apply         # really create the issues and the PR with gh
#   scripts/seed-issues.sh --repo OWNER/NAME [--apply]
#
# Safe to re-run: with --apply it first lists every issue title and the PR already in
# the repo (open and closed) and skips those, so a second run creates nothing.
#
# Numbering: data/issues.json and answer-key.md expect issues #1-#45 and #47-#101.
# #46 is a pull request ("an outside pull request that fixes #1"): it fixes the
# "seperate" typo in JOT.md on a branch, and stays open and unmerged so that main
# keeps the typo issue #1 is about. Issues and pull requests share GitHub's number
# counter, so the script opens that PR right after seed issue 45.
#
# Everything is created in order, one at a time, and the run stops at the first
# failure. Start in a FRESH repo (no issues, no pull requests yet). If a number
# comes out different, the script says so: then run scripts/refresh-offline-data.sh
# and update the numbers in answer-key.md.
#
# Needs: python3 (3.9+). --apply also needs gh, signed in with an account that
# can create issues, branches and pull requests in the repo (the owner's, never
# an attendee's).
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
exec python3 - "$HERE/../seed/issues.json" "$@" <<'PY'
import base64
import json
import shlex
import subprocess
import sys

DEFAULT_REPO = "kirodotdev-labs/sample-kiro-crew-app-workshop"

# The pull request that takes #46, recreated from the original workshop repo.
PR_AFTER = 45                     # open it right after this many seed issues
PR_NUMBER = PR_AFTER + 1
PR_BRANCH = "fix-jot-typo"
PR_FILE = "JOT.md"
PR_FROM, PR_TO = "seperate", "separate"
PR_TITLE = "fix: correct 'seperate' to 'separate' in JOT.md"
PR_BODY = "Fixes issue #1.\n\nCorrects the typo 'seperate' \u2192 'separate' in the tags section of JOT.md."

seed_path, *args = sys.argv[1:]
repo, apply = DEFAULT_REPO, False
i = 0
while i < len(args):
    a = args[i]
    if a == "--apply":
        apply = True
    elif a == "--repo" and i + 1 < len(args):
        repo = args[i + 1]
        i += 1
    elif a in ("-h", "--help"):
        print("usage: seed-issues.sh [--repo OWNER/NAME] [--apply]\n"
              "Default is a dry run that prints the gh commands and writes nothing.")
        sys.exit(0)
    else:
        sys.exit(f"unknown argument: {a}\nusage: seed-issues.sh [--repo OWNER/NAME] [--apply]")
    i += 1

with open(seed_path, encoding="utf-8") as fh:
    seed = json.load(fh)


def expected(n):
    """The GitHub number seed issue n should get: #46 belongs to the PR."""
    return n if n <= PR_AFTER else n + 1


def gh(*cmd, stdin=None):
    return subprocess.run(["gh", *cmd], input=stdin, text=True, capture_output=True)


def command(issue):
    cmd = ["gh", "issue", "create", "-R", repo, "--title", issue["title"], "--body-file", "-"]
    for label in issue["labels"]:
        cmd += ["--label", label]
    return cmd


def pr_commands(base):
    return [
        f"gh api repos/{repo}/git/refs -f ref=refs/heads/{PR_BRANCH} -f sha=<{base} head>",
        f"gh api -X PUT repos/{repo}/contents/{PR_FILE} -f branch={PR_BRANCH} ...  # {PR_FROM} -> {PR_TO}",
        shlex.join(["gh", "pr", "create", "-R", repo, "--base", base, "--head", PR_BRANCH,
                    "--title", PR_TITLE, "--body", PR_BODY]),
    ]


def ensure_pr(base):
    """Open the typo-fix PR (it should become #46). Returns its number as a string."""
    found = gh("pr", "list", "-R", repo, "--state", "all", "--head", PR_BRANCH, "--json", "number")
    if found.returncode != 0:
        sys.exit(f"cannot list pull requests: {found.stderr.strip()}")
    prs = json.loads(found.stdout)
    if prs:
        print(f"skip  #{prs[0]['number']}: pull request already exists: {PR_TITLE}")
        return str(prs[0]["number"])

    ref = gh("api", f"repos/{repo}/git/ref/heads/{base}")
    if ref.returncode != 0:
        sys.exit(f"cannot read branch {base}: {ref.stderr.strip()}")
    head_sha = json.loads(ref.stdout)["object"]["sha"]
    made = gh("api", f"repos/{repo}/git/refs", "-f", f"ref=refs/heads/{PR_BRANCH}", "-f", f"sha={head_sha}")
    if made.returncode != 0 and "Reference already exists" not in made.stderr + made.stdout:
        sys.exit(f"cannot create branch {PR_BRANCH}: {made.stderr.strip()}")

    got = gh("api", f"repos/{repo}/contents/{PR_FILE}?ref={PR_BRANCH}")
    if got.returncode != 0:
        sys.exit(f"cannot read {PR_FILE} on {PR_BRANCH}: {got.stderr.strip()}")
    meta = json.loads(got.stdout)
    text = base64.b64decode(meta["content"]).decode("utf-8")
    if PR_FROM in text:
        new = base64.b64encode(text.replace(PR_FROM, PR_TO, 1).encode("utf-8")).decode("ascii")
        put = gh("api", "-X", "PUT", f"repos/{repo}/contents/{PR_FILE}",
                 "-f", f"message={PR_TITLE}", "-f", f"content={new}",
                 "-f", f"sha={meta['sha']}", "-f", f"branch={PR_BRANCH}")
        if put.returncode != 0:
            sys.exit(f"cannot commit the fix to {PR_BRANCH}: {put.stderr.strip()}")
    elif PR_TO not in text:
        sys.exit(f"{PR_FILE} on {base} has neither '{PR_FROM}' nor '{PR_TO}': is this the workshop repo?")

    pr = gh("pr", "create", "-R", repo, "--base", base, "--head", PR_BRANCH,
            "--title", PR_TITLE, "--body", PR_BODY)
    if pr.returncode != 0:
        sys.exit(f"cannot open the pull request: {pr.stderr.strip()}")
    number = pr.stdout.strip().splitlines()[-1].rsplit("/", 1)[-1]
    print(f"made  #{number}: pull request: {PR_TITLE}")
    return number


if not apply:
    print(f"# DRY RUN: nothing is written. Target repo: {repo}")
    print(f"# {len(seed)} issues and 1 pull request, created in this order. "
          "Each issue body is sent on stdin (--body-file -).")
    print("# Re-run with --apply to create them. --apply skips titles and the PR that already exist.")
    for n, issue in enumerate(seed, start=1):
        if n == PR_AFTER + 1:
            print(f"# expected #{PR_NUMBER}  pull request on branch {PR_BRANCH} (left open, never merged)")
            for line in pr_commands("main"):
                print(line)
        print(f"# expected #{expected(n)}  ({len(issue['body'])} chars of body)")
        print(shlex.join(command(issue)) + " <<'BODY'")
        print("...")
        print("BODY")
    sys.exit(0)

# ---- --apply ----
probe = gh("repo", "view", repo, "--json", "nameWithOwner,hasIssuesEnabled,defaultBranchRef")
if probe.returncode != 0:
    sys.exit(f"cannot read {repo}: {probe.stderr.strip()}")
info = json.loads(probe.stdout)
if not info.get("hasIssuesEnabled"):
    sys.exit(f"{repo} has Issues turned off. Turn them on (Settings -> General -> Features -> Issues).")
base = (info.get("defaultBranchRef") or {}).get("name") or "main"

labels = gh("label", "list", "-R", repo, "--limit", "200", "--json", "name")
if labels.returncode != 0:
    sys.exit(f"cannot list labels: {labels.stderr.strip()}")
have = {x["name"] for x in json.loads(labels.stdout)}
need = {l for issue in seed for l in issue["labels"]}
missing = sorted(need - have)
if missing:
    sys.exit(f"{repo} is missing labels {missing}. They are GitHub defaults; re-create them first.")

existing = gh("issue", "list", "-R", repo, "--state", "all", "--limit", "1000", "--json", "title")
if existing.returncode != 0:
    sys.exit(f"cannot list issues: {existing.stderr.strip()}")
titles = {x["title"] for x in json.loads(existing.stdout)}

created = skipped = 0
shifted = []
for n, issue in enumerate(seed, start=1):
    if n == PR_AFTER + 1:
        pr_number = ensure_pr(base)
        if pr_number != str(PR_NUMBER):
            shifted.append((f"PR {PR_NUMBER}", pr_number))
    if issue["title"] in titles:
        print(f"skip  #{expected(n)}: already exists: {issue['title']}")
        skipped += 1
        continue
    res = subprocess.run(command(issue), input=issue["body"], text=True, capture_output=True)
    if res.returncode != 0:
        sys.exit(f"FAILED on seed issue {n} ({issue['title']}): {res.stderr.strip()}\n"
                 f"created {created}, skipped {skipped}. Fix the cause and re-run; existing titles are skipped.")
    url = res.stdout.strip().splitlines()[-1]
    got = url.rsplit("/", 1)[-1]
    print(f"made  #{got}: {issue['title']}")
    if got != str(expected(n)):
        shifted.append((expected(n), got))
    created += 1

print(f"done: created {created} issues, skipped {skipped}")
if shifted:
    print("WARNING: some numbers differ from what data/issues.json expects (expected -> got): "
          + ", ".join(f"{a}->{b}" for a, b in shifted))
    print("Run scripts/refresh-offline-data.sh and update the numbers in answer-key.md.")
PY
