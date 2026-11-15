# Build progress (branch `app-build`)

Rules: work only on `app-build`, never write to `data/`, no frameworks (plain HTML + ES modules + Leaflet 1.9.4 vendored in `app/vendor/`).
Build: `cd app && node scripts/build.mjs` (creates `app/dist/`, committed on purpose). Serve: `node scripts/serve.mjs dist 8123`. Tests: `npm test` in `app/` (node).
Environment note: shell heredocs/`sed` with apostrophes fail here; write JS files with the editor tool and avoid `'` inside single-quoted i18n strings. To add i18n lines: write `scripts/en.txt` and `scripts/tr.txt` (only the dictionary lines) and run `node scripts/splice_i18n.mjs scripts/en.txt scripts/tr.txt`, then delete both files.

## Done
- **M1** infrastructure: build script, Leaflet map (EPSG:4326), 7 base layers, opacity, badges from MANIFEST, (i) dialog, EN/TR (single dictionary `js/i18n.js`), tabs, mobile drawer.
- **M2** data layers (`js/handlers2.js`): route, drills (Altadena skipped: no position), boxwork polygons, SHARAD (boxwork corridor highlighted + clutter warning), CRISM footprints, ChemCam, APXS.
- **M3** terrain (`js/terrain.js`, `js/terrain-ui.js`): HiRISE slope + hazard canvases, colour-blind-safe palette with class names, pointer/tap readout with MOLA fallback ("low confidence"), legend.
- **M4** planner (`js/planner.js`, `js/planner-ui.js`): A* least-time on a 4x grid (~32 m), walking speed V = 0.75 - 0.01*S (S = percent grade, NTRS via suit README; floor 0.25 m/s = project proposal), slope limit forbids cells, MOLA cells penalised (assumption) and drawn dashed, EVA reachability (round trip vs EVA hours minus buffer), vehicle mode (LTV 20 / LRV 25 deg, speed = assumption), results panel. Real default route Bradbury -> Nevado Sajama: 14.6 km, 6.2 h one way, NOT reachable on foot.
- **M5** context (`js/context.js`, `js/context-ui.js`): RAD mean dose rate x duration (uGy, not mSv, NOT astronaut dose) with separate solar-event-candidate row, REMS air temperature vs suit outer-surface range (ground temperature, wind, UV not shown), science stops in a 200 m corridor with the score formula shown (drill weight 10 = assumption), "why this route" from computed numbers, GeoJSON download.
- **M6** About & limits dialog (`js/about.js`, strings in `js/i18n.js`), `app/README.md` (run, publish, tests), mobile drawer fix (readout/legend positions), keyboard-accessible controls, dialogs with aria labels.
- **M7** screenshots: `app/screenshots/01..11_*.png` (overview layers, slope/hazard, route result, science stops, SHARAD warning, About & limits, hybrid route, photo gallery) made by `scripts/screenshots.mjs` (playwright; install with `npm install --no-save playwright && npx playwright install chromium`). No console errors during the run.
- Tests: `npm test` (terrain, planner, context) all pass.

## Findings that matter
- The Bradbury landing cell has no HiRISE data (flat sand); the default start uses MOLA, so the first part of the default route is dashed.
- Elevation steps across the HiRISE/MOLA boundary are ignored in routing (datum offsets +1..+44 m).
- HiRISE valid area is 52.7% of its box; routes can only be planned inside that box.

## Round 2 (all done)
1. **Hybrid mode** (`planHybrid`, `hybridReachability`, `combineMetrics` in `js/planner.js`): vehicle cost field from the start, walking cost field from the goal, parking cell = vehicle-reachable cell with the shortest walk that is at least a stand-off distance from the target. Two legs in two colours with separate distance/time/slope stats; green verdict when the walking round trip fits (EVA - buffer) AND the walking leg is within the 5 km team estimate, red otherwise; radiation uses the whole trip out and back. Node tests: synthetic (unreachable on foot, reachable hybrid; wall; lower vehicle limit) and real data.
   - **Stand-off is an assumption (default 500 m, editable)**: the vehicle limit (LTV 20 deg) equals the walking limit (20 deg), so without a stand-off the vehicle can simply drive onto the target and the walking leg is 0 m. Real default result: drive 14.0 km (2.8 h at an assumed 5 km/h) + walk 0.54 km (0.5 h round trip), fits.
2. **Default mode is hybrid**; Bradbury -> Nevado Sajama stays the default route. The on-foot warning appears when the user switches to that mode and plans. About page has a story section computed from the planner (foot: 14.6 km, 12.4 h round trip vs 6 h allowed; hybrid numbers) via templates.
3. **Photos** (`js/photos.js`): Photos tab (lazy images, credit, source link, date/sol from photos.csv). Only the Nevado Sajama drill-hole photo is linked to a point (drill name in its title) and also shows in that drill popup. The other three have no position in the data and are not placed on the map.
4. ChemCam below the route line (route has its own pane), scale control moved to bottom right, arrow keys / Home / End on tabs (roving tabindex).
5. Screenshots refreshed, plus `07_hybrid_route.png` and `08_photo_gallery.png`.

## Round 3 (all done)
Check before starting: the planner used slope only (no boxwork polygons, no roughness).
1. **Rock-formation avoidance** (`roughness` in `js/terrain.js`, `roughMaskFromRaw/applyRoughness/avoidedFormations/polygonMask` in `js/planner.js`): roughness = RMS residual of a plane fitted to each 3x3 window of the 8 m DTM; a ~32 m planning cell is rough when at least 25% of its DTM cells exceed the threshold; rough cells cost x3 (also a connected group of at least 4 cells counts as one formation). Result panel "Avoided rock formations" compares with the same route without the penalty. Layer "Rough ground / rock formations" (Layers tab, terrain group). Node tests added (synthetic + real data: 805 formations, default hybrid avoids 5).
   - **Assumptions (editable in the Route tab):** threshold 0.8 m (about the 95th percentile of the real DTM), cost factor 3, min group 4 cells (code constant).
   - **boxwork_area.geojson has no ridge-by-ridge polygons** (only the Curiosity traverse hull and a coarse belt envelope), so ridges come from DTM roughness. The belt envelope cost factor exists but is OFF (1.0) by default.
   - Single boulders are not visible at 8 m: stated in the layer info, the result panel, the Route parameters and About.
2. About: "Challenge requirements" section (4 requirements, tab/layer for each) and limit 10 (rock avoidance).
3. Solar-storm table (RAD mean vs solar-event peak, rate / dose over the trip / ratio) from rad_daily_dose.csv.
4. "Suit effect on walking": speed formula, route average walking speed, suit mass scenarios A/B from data/suit/README.md. Display only: the formula has no mass input.
5. Opening card (3 steps, closable, remembered in localStorage) and EVA time bar (walk out / free time / walk back / buffer; red when the walk alone exceeds the usable time).
Screenshots 09 (welcome), 10 (rock avoidance), 11 (storm + suit) added; all refreshed.

## Round 4: release preparation
- **Deploy check** (`scripts/pathcheck.mjs`): dist served from a sub-folder on another port (`/deep/er/site/`): 35 requests, none failed, none to another origin, no console errors. No CDN, no external font, no absolute or localhost paths in index.html, css or js. `vercel.json` (cache headers: html revalidate, js/css 5 min, vendor 1 day, data 1 h) is copied into dist by the build.
- **Page meta**: description, favicon.svg, theme colour, Open Graph and Twitter card (preview image = screenshot 01, copied to dist/social.png). Note: crawlers want an absolute og:image URL; the path is relative because the final domain is not known, so set it after the first deploy if previews matter.
- **Performance** (`scripts/perfcheck.mjs`, Playwright, throttled to 1600 kbit/s and 150 ms latency):
  - first load: 378 KiB over 24 requests, load event 2.3 s, layer panel ready 2.7 s (nothing heavy is fetched before a layer or route is opened; HiRISE, CTX detail and CRISM were already opened on demand).
  - HiRISE slope layer (loads the 8 m DTM, slope and hazard grids): 106 s before, 36 s after shipping the `.bin` grids gzip-compressed (`.bin.gz`, inflated in the browser with DecompressionStream; the app also accepts a server that already inflated them). Hazard and roughness layers then take about 1.5 s (data already loaded).
  - dist size 58.8 MB -> 33.4 MB.
  - Loading indicator: the busy bar shows the download percentage while terrain files load.
  - Limit: DecompressionStream needs Chrome 80+, Safari 16.4+ or Firefox 113+.

## Round 4 (continued)
- **Accessibility**: language button and tab list labels (follow the language), all controls have names, all images have alt, html lang follows the language, contrast fixed for two badge colours and the error status (checked pairs: all at least 4.5:1 now), yellow focus ring, reduced-motion rule.
- **Resilience** (`scripts/failcheck.mjs`): with the manifest, a layer file, the HiRISE grids, the REMS/RAD csv, or the photos blocked, the app does not crash; layers show "failed to load", the route tab shows a short data message, a broken photo is replaced by a message.
- **Credits**: About lists every source URL from data/MANIFEST.csv by folder (plus photo credits); the layer info dialog turns the source into links.

## Known issues (kept in step with About & limits, items 1-11 there)
- Planner runs on the main thread (~0.3 s for one route; ~1.6 s for hybrid with the roughness comparison on the real grid).
- Hybrid parking cell is a ~32 m grid cell checked only against the vehicle slope limit (no flatness check). Vehicle speed (5 km/h), stand-off (500 m), roughness threshold (0.8 m), cost factor (3) and drill-site score weight (10) are assumptions.
- Rock avoidance sees roughness at 8 m only; single boulders are invisible and the boxwork data has no ridge polygons.
- The three drill sites are about 10 m apart, so the one-click scenarios give nearly the same route.
- REMS panel is one station (Curiosity), summarised over 123 sampled sols; UV is not dust-corrected, wind has no usable data, ground temperature is not shown.
- Terrain grids are shipped as .bin.gz and need DecompressionStream (Chrome 80+, Safari 16.4+, Firefox 113+).
- og:image is a relative path (final domain unknown); set an absolute URL after the first deploy if link previews matter.
- Not audited: full keyboard order inside the Route tab beyond a basic check; screen reader testing was not done (only an automated check that every control has a name and every image has alt text).

## Dist
- `app/dist` about 33 MB after gzip of the terrain grids (limit 150 MB).

## Publish
- Upload `app/dist/` to Vercel, Netlify or GitHub Pages (relative paths, works in a sub-directory). See `app/README.md`.
