# Interstellear Martian Map

**NASA Space Apps Challenge 2026 – Interplanetary Survival Guide: Martian Map**
Team **İnterstellear** · Region: **Gale Crater / Mount Sharp (Aeolis Mons), Mars**

A static web map that helps plan a walking or driving route for an astronaut on Mars. It uses real NASA orbital and rover data for Gale Crater: terrain, slope and hazard maps, the Curiosity traverse, rock chemistry, radiation and weather. It shows what the astronaut can reach within the time and safety limits of an EVA (extravehicular activity).

Live app: **https://interstellear-martian-map.vercel.app**

## What the app does

- **Layers:** MOLA and CTX base maps, HiRISE 8 m terrain (slope, hazard classes, rough ground), the Curiosity traverse, ChemCam/APXS chemistry points and the boxwork target area.
- **Route planner:** A* over a slope-based cost grid, in three modes: on foot (EVA), pressurized vehicle, and hybrid (drive, park, then walk). Walking speed falls with slope, rough ground is penalised, and the EVA time budget (8 h minus a 2 h buffer) is checked.
- **Context:** radiation (RAD) and weather (REMS) from Curiosity along with a solar-storm comparison, a suit-mass comparison, and science stops near the route.
- **Honesty about data:** every layer carries a confidence badge and a known limit. The About page lists all limits and every data source.
- **Extras:** English and Turkish interface, photo gallery, one-click scenarios, shareable route links (URL hash), and a GeoJSON download of the route.

## Run it locally

Requires Node.js 18 or newer. There are no dependencies to install and no framework.

```bash
cd app && node scripts/build.mjs && node scripts/serve.mjs dist 8080
```

Then open http://localhost:8080. Run the tests with `cd app && npm test`. `app/README.md` and `app/PROGRESS.md` describe the build, the planner assumptions, performance measurements and known issues in detail.

The browser must support `DecompressionStream` (Chrome 80+, Safari 16.4+, Firefox 113+) because the terrain grids are shipped gzip-compressed.

## NASA data used

The full list, with file-level source URLs, status and known limit for every file, is in [`data/MANIFEST.csv`](data/MANIFEST.csv). Each folder under `data/` also has its own README. Sources by data set:

| Folder | Data | Source |
|---|---|---|
| `data/mola` | MOLA topography (463 m/pixel) | NASA Solar System Treks; USGS Astrogeology |
| `data/ctx` | CTX image mosaic | MRO CTX via Caltech Murray Lab / Esri ArcGIS image service |
| `data/hirise` | HiRISE DTM (8 m), derived slope and hazard grids | HiRISE PDS archive, University of Arizona |
| `data/curiosity-traverse` | Curiosity traverse (MSL PLACES) | NASA PDS Imaging Node (JPL) |
| `data/chemistry` | ChemCam and APXS chemistry | NASA PDS Geosciences Node (WUSTL) |
| `data/curiosity-rad` | RAD radiation dose | NASA PDS Planetary Plasma Interactions Node |
| `data/rems` | REMS weather | NASA PDS Atmospheres Node (NMSU) |
| `data/sharad` | SHARAD radar notes | NASA PDS Geosciences Node |
| `data/crism` | CRISM mineral notes | NASA PDS Geosciences Node |
| `data/themis` | THEMIS thermal notes | NASA Solar System Treks |
| `data/mars-trek` | WMTS capabilities files | NASA Solar System Treks (JPL) |
| `data/boxwork`, `data/slope-hazard`, `data/suit`, `data/photos` | Derived layers, thresholds and notes | Derived from the data above; NASA documents and NASA/JPL images, credited per file |

Of the 106 entries in the manifest, 17 are derived by the team from the sources above. They are marked as derived and carry an "approximate" badge where they are not official boundaries.

## Limits

This is a planning aid built for a hackathon, not an operational tool.

- HiRISE covers only about 53% of the project box; the rest uses MOLA (463 m) with a cost penalty and a "low confidence" mark.
- Single boulders are invisible at 8 m. Rough ground is estimated from terrain residuals, not from mapped rocks.
- Several parameters are assumptions the user can edit: vehicle speed (5 km/h), hybrid stand-off distance (500 m), rough-ground threshold and penalty.
- Radiation values are the RAD instrument's absorbed dose, not an astronaut dose. Weather is from one station (Curiosity), and some records (wind, ground temperature) are missing or not shown.
- Suit mass scenarios are display only and do not change walking speed.
- The location of the Altadena drill site is not verified, so it is disabled as a route target.

The complete, numbered list is on the About page of the app.

## AI tools

The application code was written with Claude Code (Anthropic's coding agent, using Claude models). Team members also used Google Gemini for research and for preparing notes about NASA data (for example the suit, climate and SHARAD notes in `data/`). Claude was also used for analysis and drafting. The team set the goals and requirements, collected the data, directed the work and checked the results. The raw data files come from the NASA sources listed above and were downloaded from those sources, not generated by AI. Some notes and numbers in the data folders were prepared with AI assistance; where a value is a team assumption (for example the walking-speed model and the EVA time budget), the app and the About page say so.

## License

The code in this repository is released under the MIT License (see `LICENSE`). NASA data stays under its own terms, and Leaflet (`app/vendor/leaflet`) keeps its own BSD license.
