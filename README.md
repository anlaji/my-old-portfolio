# anlaji.github.io

Welcome to my-old-portfolio-anlaji.vercel.app — a professional, energetic showcase of personal projects, experiments and learning artifacts. This repository powers the public site at my-old-portfolio-anlaji.vercel.app and collects a wide range of web experiments, tutorials and small applications that demonstrate practical problem solving across front-end development, performance, tooling and project organization.

---

## Why this repository exists

This repo is both a portfolio and a technical playground. It documents not only finished demos but also intermediate experiments and archived course work. That makes it a valuable resource for:

- Demonstrating practical front-end skills and progressive learning (FreeCodeCamp work, CG lab exercises).
- Hosting small single-page demos and static projects (Angular experiments, mini-apps).
- Preserving and presenting prototypes and assignments for review.
- Showing how to tackle real-world issues: asset optimization, cross-browser compatibility, build tooling, deployment and maintainability.

---

## Status & expectations

A quick, transparent note about the repo's status:

- The site's formatting is intentionally simple and somewhat old-fashioned in places — this keeps the site stable and easy to host on GitHub Pages.
- The repository is actively evolving but worked on during spare time. Please consider many parts "work in progress."
- Issues and larger refactors may be tracked or executed in companion side-projects; if an issue references a separate repo, that's intentional to keep focused changes isolated.
- Challenges, suggestions and pull requests are very welcome — I appreciate thoughtful contributions and will triage and address them as time allows.

---

## What you'll find here (high level)

- `index.html` — the main landing page for the site.
- `style.css` and `styles/` — primary styling and style components.
- `images/`, `img/` — media and illustrative assets.
- `freeCodeCamp/` — exercises and projects from FreeCodeCamp.
- `mi-proyecto-angular/` — an Angular experiment/project (tooling, routing, build concerns).
- `train-trip/` — a CG lab project that showcases WebGL/canvas work and 3D rendering considerations.
- `urlaub-portal/` — a small portal/demo (UX, multi-page layout patterns).
- `pruebassitio/` — site experiments and staging areas for UI ideas, but integrating divers type of projects as excel pages, calculators or games.
- `scripts/` — utilities and export helpers used to generate or maintain site content., 
- `chatExportScripts/` —Ui that allows to download signal app content by using the indicated branch and apk.
- `documents/` — notes, documentation and supporting materials.
- `package.json`, `package-lock.json` — tooling metadata where applicable.

---

## Key challenges covered in this repository

This repository intentionally collects projects that surface common and useful web engineering challenges. Here are the main ones you’ll see and why they matter:

- Performance and asset optimization
  - Images and static assets are large contributors to load time; several folders show approaches to compression, lazy-loading and sizing strategies.
- Progressive enhancement & accessibility
  - Static sites must still be usable across devices and assistive technologies. Look for semantic markup and accessible patterns in demos.
- Cross-browser and responsive CSS
  - Examples include responsive layouts, graceful degradation and CSS debugging across modern and legacy browsers.
- Project structure & maintainability
  - The repo hosts multiple mini-projects with different requirements — it demonstrates organizing code so each project remains understandable and independently deployable.
- Build tooling and dependency management
  - Where `package.json` is present, expect examples of npm scripts, lightweight build steps and trade-offs when introducing toolchains for otherwise static sites.
- SPA/Framework integration (Angular)
  - `mi-proyecto-angular` shows integration with a framework: routing, bundling, and how to embed framework-built apps into a GitHub Pages–hosted site.
- Graphics and interactive demos
  - CG lab projects emphasize managing canvas/WebGL performance and animation loops.
- Content export and automation
  - `chatExportScripts` and similar utilities show simple automation for generating content and maintaining assets.
- Deployment on GitHub Pages
  - Handling branch/source settings, static resource paths, and client-side routing for single-page apps.

---

## Quick start — preview locally

The site is static and easy to preview:

- Open `index.html` in your browser for a quick check.
- Recommended: run a local static server to mimic hosting behavior (CORS, routing):

  - Node (http-server):
    - Install: `npm install --global http-server`
    - Run: `http-server .`
  - Node (live-server for auto-reload):
    - Install: `npm install --global live-server`
    - Run: `live-server .`
  - Python:
    - Python 3: `python -m http.server 8080`

- If a subproject includes a `package.json` and build steps:
  - Install dependencies: `npm ci` (preferred) or `npm install`
  - Inspect `package.json` scripts and run `npm run start` or `npm run build` where relevant.

---

## Deploying (GitHub Pages)

This site is intended for GitHub Pages hosting:

1. Push to the `master` branch (this repository uses `master` by default).
2. In the repo Settings → Pages, set the source to the `master` branch (root) or a branch/folder you prefer.
3. If using SPA frameworks (Angular), ensure router/base href and asset paths are configured for static hosting.
4. For automated builds, add a GitHub Actions workflow that builds and deploys to the `gh-pages` branch or uses the repository root as the Pages source.

---


## License

This repository does not currently declare a license. If you would like to reuse code or content.

---

## Contact & thanks

Author: Anlaji  
Repo: https://github.com/anlaji/anlaji.github.io  
Site: https://anlaji.github.io

Thanks for taking the time to explore this collection of experiments and projects — contributions and thoughtful feedback are highly appreciated. If you'd like help modernizing any demo, creating CI/CD for the site, or standardizing build processes across projects, open an issue and let's collaborate.
