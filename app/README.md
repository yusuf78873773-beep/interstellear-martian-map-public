# Martian Map: Gale Crater EVA Planner

Interactive layered map and EVA route planner for Gale Crater / Mount Sharp, built from the data in `../data/`.
NASA Space Apps Challenge 2026, "Interplanetary Survival Guide: Martian Map", team İnterstellear.
UI language: English by default, Turkish with the TR/EN button (one dictionary: `js/i18n.js`).

No framework and no build tool: plain HTML, ES modules and CSS. Leaflet 1.9.4 is vendored in `vendor/leaflet/`, so the app also works offline.

## Run it

You need Node 18+ (only for the build and the tiny static server).

```bash
cd app
node scripts/build.mjs          # creates app/dist/ (the static site; it is committed on purpose)
node scripts/serve.mjs dist 8080   # open http://localhost:8080/
```

Any static server works instead of the second command, for example `npx serve app/dist` or `python -m http.server 8080 -d app/dist`.
The page must be served over HTTP: opening `index.html` from the file system will not load the data.

## Publish it

Upload the `app/dist/` folder to Vercel, Netlify or GitHub Pages (no build step needed: the folder is already built).
All paths are relative, so it also works in a sub-directory (for example `https://user.github.io/repo/`).
After changing anything in `app/` or `data/`, run `node scripts/build.mjs` again and commit `app/dist/`.

## What the build does (`scripts/build.mjs`)

- Copies `index.html`, `css/`, `js/`, `vendor/` into `dist/`.
- Copies **only the data files the app needs** into `dist/data/` (about 55 MB in total; the build warns above 150 MB).
- Converts `data/MANIFEST.csv` into `dist/data/manifest.json` (layer badges: Observation / Derived / Proposal / Approximate).
- `data/` itself is never modified.

## Tests

```bash
cd app && npm test        # node tests: terrain sampling, route planner, radiation/REMS/corridor helpers
```

The planner test checks the hybrid mode (vehicle then walk), a straight route on a flat grid, a detour around forbidden slope, unreachable goals, foot vs vehicle limits, and the real route from Bradbury Landing to the Nevado Sajama drill site.

## Layout

| Path | Purpose |
|---|---|
| `index.html`, `css/style.css` | page, styles (mobile: the side panel becomes a bottom drawer) |
| `js/main.js` | map, layer panel, badges, info dialogs, language |
| `js/handlers.js`, `js/handlers2.js` | layer types: images, CRISM browse, GeoJSON, CSV points/boxes |
| `js/terrain.js`, `js/terrain-ui.js` | HiRISE/MOLA grids, sampling with MOLA fallback, slope/hazard canvases, pointer readout |
| `js/planner.js`, `js/planner-ui.js` | A* route planner, speed models, route tab and results |
| `js/context.js`, `js/context-ui.js` | radiation, REMS temperature, science stops, "why this route", GeoJSON export |
| `js/photos.js` | Photos tab and drill-popup photo (data/photos) |
| `js/welcome.js` | opening card |
| `js/about.js` | About & limits dialog (default-route story computed from the planner) |
| `scripts/` | build, static server, i18n helper |
| `tests/` | node tests |
| `PROGRESS.md` | what is done, what is left, known issues |

## Where the numbers come from

Every number is read from `data/` or marked as an assumption in the interface:
walking speed `V = 0.75 − 0.01·S m/s` (S = slope in percent) and EVA hours/buffer from `data/suit/README.md`;
slope limits (EVA 20°, Artemis LTV 20°, Apollo LRV 25°) from `data/slope-hazard/README.md`;
radiation from `data/curiosity-rad/rad_daily_dose.csv`; air temperature from `data/rems/rems_daily.csv`.
Vehicle speed (5 km/h), the MOLA routing penalty (1.5×) and the drill-site weight in the science score (10) are assumptions you can see in the UI.

Limits are listed in the app under "About & limits" (HiRISE terrain models are offset from each other by at least ~50 m, HiRISE covers 52.7% of its box, slope classes are a project proposal, RAD is a rover measurement, etc.).

## Credits and AI statement

Data: NASA / JPL / USGS / PDS / Caltech Murray Lab / University of Arizona (details in `data/*/README.md` and in the app).
Claude (Anthropic) and Claude Code were used to write the code and to prepare the data.
