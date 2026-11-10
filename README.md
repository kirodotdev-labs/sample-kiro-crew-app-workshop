# Build Your First Kiro Crew App: Backlog Factory

Starter repo for the Kiro Crew workshop
**"Build Your First Kiro Crew App"**: an agentic software factory that turns GitHub
issues into reviewed fixes.

You build **Backlog Factory**, a [Kiro Crew](https://github.com/kirodotdev/KiroCrew)
app that works through a real issue backlog like a small software factory:

1. **Sort** every open issue: bug or feature? Is it a good problem? Five whys to the
   root cause, then first principles to the best fix. Verdict: Build, Reframe,
   Needs you, or Reject. Duplicates are grouped.
2. **Reproduce** each bug in your own folder, with the real command and its output.
3. **Fix ⇄ Review**: a fixer agent writes the fix on a local branch, a separate
   reviewer agent reads the diff and runs the tests, and they loop until the review
   is green. Then **you** merge.

Its page is a board with a count per lane. **It never writes to GitHub**: it reads the
issues, and everything it makes stays in your folder (fixes are local branches; a
"PR" here is a branch, its diff and the review verdict).

The issues come from `jot`, a tiny notes CLI in this repo (`jot/`, `JOT.md`): 100 open
issues, the kind every open-source maintainer gets.

## Before you arrive (~1 GB of downloads)

1. **Install Kiro Crew.**
   - macOS: download [KiroCrew.dmg (Stable)](https://download.crew.kiro.dev/desktop/stable/latest/KiroCrew.dmg), drag it to Applications, open it once.
   - Windows: download [KiroCrew-Setup.exe (Stable)](https://download.crew.kiro.dev/desktop/stable/latest/KiroCrew-Setup.exe), run it, open Kiro Crew once.
   - Linux, or if you prefer a terminal:

     ```bash
     curl -fsSL https://download.crew.kiro.dev/cli.sh | sh
     kirocrew setup
     kirocrew gateway        # dashboard at http://localhost:5476; leave it running
     ```

     Linux only: if Kiro Crew shows **Sandbox unavailable**, run
     `sudo sysctl -w kernel.unprivileged_userns_clone=1`, then restart the gateway.

2. **Sign in.** The dashboard opens on the **Set up Kiro** page. Copy the
   sign-in command shown there, run it in a terminal, finish the sign-in in
   your browser, then press **Check sign-in again**.
3. **Python 3.9 or newer.** The factory runs `jot` to reproduce bugs. Check with
   `python3 --version` (Windows: `py --version`). On a fresh Mac, `python3` may first
   offer to install Apple's developer tools: say yes (this also gives you `git`).
4. **git** (for Lab 3 only). No git? Labs 1 and 2 still work from the ZIP.

No GitHub account, token or fork is needed today.

**Keep Approval mode on Normal.** The factory's agents run shell commands as you, so
every command should ask first. Do not use Trust (auto-approve) for the factory.

**Optional: no GitHub write access.** The factory reads issues with unauthenticated
calls and never needs your GitHub credentials, but a `gh` login or stored `git` push
credentials on this machine are within its agents' reach. For extra safety, run
`gh auth logout` for the session (and `gh auth login` afterwards), or use a fine-grained
token with **Public repositories (read-only)** access.

## Start here

1. **Get the repo** (no fork). Clone it anywhere you like. This handout uses
   `~/sample-kiro-crew-app-workshop`:

   ```bash
   git clone https://github.com/kirodotdev-labs/sample-kiro-crew-app-workshop.git ~/sample-kiro-crew-app-workshop
   ```

   The folder you cloned into is "your folder" for the rest of the workshop. It holds
   `jot/`, `checkpoints/` and `data/`. If you cloned somewhere else, use that path
   wherever this handout shows `~/sample-kiro-crew-app-workshop`.

   **No git? Download ZIP:** [the repo as a ZIP](https://github.com/kirodotdev-labs/sample-kiro-crew-app-workshop/archive/refs/heads/main.zip).
   Unzip it anywhere and use the unzipped folder (for example
   `~/Downloads/sample-kiro-crew-app-workshop-main`) as your folder.

2. **Install the Backlog Factory Workshop app.** It is your guide for the rest of the session:
   **Discover** → database icon (**Manage app sources**) → **Add Registry** →
   Repo `https://github.com/kirodotdev-labs/sample-kiro-crew-app-workshop` → **Add Registry**.
   The app list shows **Backlog Factory Workshop** → **Install** → **Trust this app
   and enable** → **Enable** on the app page. Open **Backlog Factory Workshop** in the
   sidebar and follow its steps. This path needs `git`.
   No `git`? In the same menu use **Install from Path** with the full path of the
   unzipped `workshop/` folder, then **Library** → **Show N disabled apps** →
   **Backlog Factory Workshop** → **⋯** → **Enable** → **Trust this app and enable**.
   Details: [workshop/README.md](workshop/README.md).

**Dry run, always.** The whole room shares this one GitHub repo, so nothing you build
today writes to it: no labels, comments, closes or pull requests. Backlog Factory reads
the issues (one unauthenticated GitHub call, or `data/issues.json` offline) and writes
only inside your folder.

### Offline fallback

`data/issues.json` holds the repo's open issues, in the shape
`gh issue list --state open --limit 200 --json number,title,body,labels` returns. The factory uses it when the
GitHub call fails. **Offline issue data does not make the model work offline.**

## The labs

The guide app does the typing: each step button opens a chat that copies the next
checkpoint into `backlog-factory/` in your folder and installs it, after your yes.

| Lab | Your app gains | You should see |
|---|---|---|
| 1 Sort | the main agent, the `factory-triage` skill (good problem? → five whys → first principles), the board page and its small backend | a board with 100 cards; each has a verdict and a one-line reason |
| 2 Reproduce | the `factory-reproduce` skill; helper agents (subagents) in batches | bugs with a real command and real output; Windows-only ones under **Needs you** |
| 3 Fix ⇄ Review | two more agents, `factory-fixer` and `factory-reviewer`, and the `factory-fix-review` skill | one bug in **Ready to merge** with green tests; you run the merge yourself |

Then remix it (add your own rule or lane) and share it (a zip of your app folder).
Check each lab against **[answer-key.md](answer-key.md)**.

### Fell behind? Copy the next checkpoint

`checkpoints/lab-1/`, `lab-2/` and `lab-3/` are the whole `backlog-factory` app folder
as it should look at the end of each lab. macOS / Linux:

```bash
rm -rf backlog-factory && cp -R checkpoints/lab-2 backlog-factory
kirocrew app uninstall backlog-factory      # only if an older copy is installed
kirocrew app install "$PWD/backlog-factory"
```

Windows PowerShell:

```powershell
Remove-Item -Recurse -Force backlog-factory -ErrorAction SilentlyContinue
Copy-Item -Recurse checkpoints\lab-2 backlog-factory
kirocrew app uninstall backlog-factory
kirocrew app install "$PWD\backlog-factory"
```

Ignore the install's *Run: kirocrew app enable* and Settings hint. Use Library, below.

Then trust and enable it in the dashboard: **Library → Show N disabled apps →
Backlog Factory → ⋯ → Enable → Trust this app and enable**. The app has a small
backend (it serves the board), so it asks for trust. Do **not** turn on *Trust every
third-party app* in Settings. An uninstall removes the trust, so trust it again after
each reinstall. On the app's page, check that **Repo folder** shows your folder. The
guide sets it for you; after a copy by hand, type your folder and press **Save** once
(it is kept across reinstalls).

## What the app may and may not do

| | Allowed |
|---|---|
| Read the open issues of `kirodotdev-labs/sample-kiro-crew-app-workshop` (or `data/issues.json`) | yes |
| Write `factory/` in your folder: the board, repro notes, saved diffs, fix worktrees | yes, after your yes |
| Make local branches `factory/fix-<n>` | yes (Lab 3), after your yes |
| Merge a fix into your `main` | never: you do it |
| Write anything to GitHub (labels, comments, closes, PRs, pushes) | never |

**Want real writes? (after the workshop, not today.)** Fork the repo, point the
factory at your fork, and add your own "apply" step that labels or comments, behind
an explicit yes. Today's app stays a dry run.

## What is in this folder

```
README.md            this handout
CONTRIBUTING.md, CODE_OF_CONDUCT.md   no contributions accepted; how to report security issues
LICENSE, THIRD-PARTY-NOTICES.md       MIT-0, plus the licenses of bundled fonts and artwork
app-registry.json    lets Add Registry find the guide app
workshop/            the Backlog Factory Workshop app: guide page + guide agent (install first)
answer-key.md        the expected board: bug groups, verdicts, reframes
checkpoints/         lab-1, lab-2, lab-3: the Backlog Factory app folder after each lab
data/issues.json     offline copy of the open issues
seed/issues.json     all 100 issues as written, in order (used to seed the repo)
scripts/             seed-issues.sh, refresh-offline-data.sh, build-offline-data.py
jot/, tests/, JOT.md the sample project the issues are about
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This workshop is licensed under the MIT-0 License. See the [LICENSE](LICENSE) file.
Bundled third-party fonts and artwork keep their own licenses; see
[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).
