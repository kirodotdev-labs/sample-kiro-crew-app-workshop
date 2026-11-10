#!/usr/bin/env python3
"""Build data/issues.json from seed/issues.json, offline.

The output has the same shape as

    gh issue list -R kirodotdev-labs/sample-kiro-crew-app-workshop --state open --limit 200 \
      --json number,title,body,labels

(the format the workshop's issue file has always used):

- a JSON array, newest issue first (gh's default sort),
- each item has exactly the keys body, labels, number, title,
- each label has id, name, description, color.

Numbers follow seed order from #1, skipping #46 (the answer key's numbering).
Label ids are placeholders ("LA_offline_<name>"); the shipped file keeps the ids
it was first built with, which the factory ignores.

Usage: python3 scripts/build-offline-data.py
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# GitHub's default labels for a new repository (name -> description, color).
DEFAULT_LABELS = {
    "bug": ("Something isn't working", "d73a4a"),
    "documentation": ("Improvements or additions to documentation", "0075ca"),
    "duplicate": ("This issue or pull request already exists", "cfd3d7"),
    "enhancement": ("New feature or request", "a2eeef"),
    "good first issue": ("Good for newcomers", "7057ff"),
    "help wanted": ("Extra attention is needed", "008672"),
    "invalid": ("This doesn't seem right", "e4e669"),
    "question": ("Further information is requested", "d876e3"),
    "wontfix": ("This will not be worked on", "ffffff"),
}


def label_obj(name: str) -> dict:
    if name not in DEFAULT_LABELS:
        raise SystemExit(f"label {name!r} is not a GitHub default label")
    description, color = DEFAULT_LABELS[name]
    return {
        "id": "LA_offline_" + name.replace(" ", "_"),
        "name": name,
        "description": description,
        "color": color,
    }


def main() -> None:
    seed = json.loads((ROOT / "seed" / "issues.json").read_text(encoding="utf-8"))
    items = []
    for i, issue in enumerate(seed, start=1):
        number = i if i < 46 else i + 1  # #46 is skipped
        items.append(
            {
                "body": issue["body"],
                "labels": [label_obj(n) for n in issue["labels"]],
                "number": number,
                "title": issue["title"],
            }
        )
    items.reverse()  # gh issue list: newest first
    out = ROOT / "data" / "issues.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    # gh prints compact JSON when piped; keep the same bytes style.
    out.write_text(json.dumps(items, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"wrote {out.relative_to(ROOT)}: {len(items)} issues (#{items[-1]['number']}..#{items[0]['number']})")


if __name__ == "__main__":
    main()
