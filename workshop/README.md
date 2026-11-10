# Backlog Factory Workshop app

The guide for the Kiro Crew workshop "Build Your First Kiro Crew
App". Today you build *an agentic software factory that
turns GitHub issues into reviewed fixes*. Install it first. Its page walks
you through building your own app, and its guide agent does the typing.

## Install (Kiro Crew Stable 0.9.0)

**From your folder (main path, works for a clone or a ZIP):**

1. Get the repo: `git clone https://github.com/kirodotdev-labs/sample-kiro-crew-app-workshop.git`,
   or with no `git`, download [the repo as a ZIP](https://github.com/kirodotdev-labs/sample-kiro-crew-app-workshop/archive/refs/heads/main.zip)
   and unzip it (you get `sample-kiro-crew-app-workshop-main/`).
2. In Kiro Crew: **Discover** → the database icon at the top right
   (**Manage app sources**) → **Install from Path** → paste the full path of the
   `workshop` folder inside it, for example
   `/Users/you/sample-kiro-crew-app-workshop/workshop` → **Install**.
3. **Library** → **Show N disabled apps** → **Backlog Factory Workshop** → **⋯** →
   **Enable** → **Trust this app and enable**.
   **Backlog Factory Workshop** now shows in the sidebar. Open it.

Terminal instead of step 2: `kirocrew app install "$PWD/workshop"` (run from your
folder's root). You still trust and enable it in the dashboard.

**Also works with a clone: Add Registry** (needs `git`, no GitHub sign-in):
**Discover** → database icon → **Add Registry** → Repo
`https://github.com/kirodotdev-labs/sample-kiro-crew-app-workshop` → **Add Registry** →
**Backlog Factory Workshop** → **Install** → **Trust this app and enable** → **Enable**.

The guide works in a ZIP folder too: Labs 1 and 2 need no git. Lab 3 (fix and
review on a local branch) needs git.

No fork needed. The guide builds your app, **Backlog Factory**, inside
this clone or ZIP, and nothing is written to GitHub.

## What is inside

| Path | What it is |
|---|---|
| `app.json` | The app: id `backlog-factory-workshop`, one agent, one skill, one page. No backend, no schedule. |
| `agents/workshop-guide.json` | The guide agent. File and shell tools only. |
| `skills/workshop-guide/SKILL.md` | The guide's rules and the seven steps. |
| `ui/src/App.tsx` | The page source. |
| `ui/dist/` | The pre-built page, its fonts (OFL) and Kiro Crew ghosts. Works offline. |

## What the guide will and won't do

- It types for you: copies the lab checkpoint into `backlog-factory/`, edits your
  remix rule, runs `kirocrew app install`.
- It asks **yes / no** before every file change or install.
- It never writes to GitHub: no push, no comments, no issues or PRs.
- It never trusts or enables an app. You do that in **Library**.

## Rebuild the page (optional)

Needs Node.js. From `ui/`: `npm install && npm run build`, then reinstall.

## Where the art comes from

- Ghost poses (`ui/dist/assets/ghosts/`): from
  [kirodotdev/KiroCrew](https://github.com/kirodotdev/KiroCrew) v0.9.0
  (`website/src/assets/`), Apache-2.0. Unchanged.
- `ui/dist/assets/kirocrew-icon.png`: the Kiro Crew app icon (the same file the
  workshop deck uses). `assets/icon.png` is this app's own tile: a v0.9.0 ghost
  pose on a red-to-Kiro-purple gradient.
- Fonts: Space Grotesk and JetBrains Mono, SIL Open Font License (texts beside them).
