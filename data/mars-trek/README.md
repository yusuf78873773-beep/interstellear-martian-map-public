# Mars Trek tile layers (CTX + MOLA)

Live WMTS layers from NASA Solar System Treks (JPL). No login needed, CORS open, usable straight from the browser.
Tiles are NOT stored here; only the WMTS capability files are.

| Layer | File | Notes |
|---|---|---|
| CTX global mosaic (5 m) | CTX_WMTSCapabilities.xml | tiles served by astro.arcgis.com (OnMars/CTX) |
| MOLA colour hillshade (463 m) | MOLA_ClrShade_WMTSCapabilities.xml | tiles at trek.nasa.gov/tiles/Mars/EQ/... |

Region: Gale Crater / Mount Sharp, lat -7.0..-3.5, lon 136.0..139.5 E.
Cropped copies for this box (to within a pixel; `data/ctx/` also has a smaller 20 km Sharp Mountain detail crop) are in `data/mola/` (the MOLA colour hillshade comes from the layer above; the elevation DEM there comes from USGS, not from Mars Trek) and `data/ctx/` (CTX photo mosaic from the CTX layer above); see their `bounds.json` for exact pixel bounds.
Source: https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars
