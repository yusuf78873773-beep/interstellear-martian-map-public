# MOLA topography: Gale Crater / Mount Sharp

Data collected on 2026-11-14 for the Interstellear Martian map (NASA Space Apps 2026).

## Region

| | South | North | West | East |
|---|---|---|---|---|
| Requested | -6.0 | -3.5 | 136.5 E | 138.5 E |
| **Used** | **-7.0** | **-3.5** | **136.0 E** | **139.5 E** |

The box was widened. Gale's centre is about 5.4 S, 137.8 E and the crater is about 154 km wide. The requested box cut off the south rim (around -6.5 to -6.8) and the east rim (around 139.0 to 139.3). The DEM profiles below confirm that both rims now fall inside the box.

Coordinates use Mars 2000 planetocentric latitude, east-positive longitude, on an equirectangular grid with sphere radius 3,396,190 m. Exact per-file bounds are in `bounds.json`.

## Files

| File | What it is | Size (px) | Resolution |
|---|---|---|---|
| `gale_mola_clrshade.png` | Colour shaded relief. A **picture only**: the colours are not elevation values. | 637 × 637 | 182.04 px/deg, about 326 m/px (the 463 m data is resampled at zoom 7) |
| `gale_mola_dem.tif` | **Real elevation**, GeoTIFF, int16, metres relative to the MOLA areoid, nodata -32768 | 448 × 448 | 128 px/deg, 463.09 m/px |
| `gale_mola_dem_int16le.bin` | Same elevation grid as raw little-endian int16, row-major, north row first, for easy reading in the browser | 448 × 448 | same |
| `bounds.json` | Bounds, resolution and pixel-to-coordinate formulas for each file | | |

Use the DEM for slope and route calculations, and the PNG for display.

Reading the `.bin` in JavaScript:

```js
const buf = await (await fetch('data/mola/gale_mola_dem_int16le.bin')).arrayBuffer();
const z = new Int16Array(buf);                 // 448*448 values, metres
const elev = (row, col) => z[row * 448 + col]; // row 0 = lat -3.5 edge, col 0 = lon 136.0 edge
// pixel centre: lat = -3.5 - (row + 0.5) / 128, lon = 136.0 + (col + 0.5) / 128
// pixel size: 463.09 m, so slope = atan(dz / 463.09) between neighbouring pixels
```

## Sources

### 1. Colour hillshade: NASA Solar System Treks (Mars Trek) WMTS

- Layer: `Mars_MGS_MOLA_ClrShade_merge_global_463m` (MGS MOLA colour hillshade, 463 m)
- Capabilities: https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/WMTSCapabilities.xml (identical to the copy in `data/mars-trek/`)
- TileMatrixSet: `default028mm`, 256 px JPEG tiles, top-left corner -180, 90. Zoom levels run from 0 to 7.
- Used **zoom 7**, the highest level (1.40625° per tile), rows 66–68 and columns 224–227 (12 tiles).
- Tile URL: `https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0//default/default028mm/7/{row}/{col}.jpg`
- The tiles were stitched and cropped to the box, then saved as PNG.

### 2. Elevation (DEM): USGS Astrogeology MOLA DEM

Mars Trek does not serve a DEM with real elevation values over WMTS. The only DEM layer it has is `Mars_MGS_MOLA_DEM_mosaic_global_463m_8`. That layer is an 8-bit PNG that goes only up to zoom 5, and its capabilities file does not say how the grey levels map to metres. It is **not used** here.

The real values come from the USGS global MOLA DEM GeoTIFF instead:

- `Mars_MGS_MOLA_DEM_mosaic_global_463m.tif` (MGS MOLA DEM, 463 m, int16 metres, 46080 × 23040, 2.1 GB)
- URL: https://planetarymaps.usgs.gov/mosaic/Mars_MGS_MOLA_DEM_mosaic_global_463m.tif (redirects to `asc-pds-services.s3.us-west-2.amazonaws.com`, file Last-Modified 2022-11-10)
- Only the Gale box was read, using HTTP range requests on rows 11968–12415 and columns 40448–40895. The values were not changed. The georeferencing keys were copied from the source file.
- Product page: https://astrogeology.usgs.gov/search/map/mars_mgs_mola_dem_463m

## Quick checks (from the DEM)

- Elevation range in the box runs from -4607 m (crater floor, around 4.77 S, 136.84 E) to 1347 m.
- On the north–south profile along 137.8 E, Mount Sharp's high ground (around +390 m near 5.0 S) sits between the floor at about -4050 m in the north and about -3290 m in the south. The south rim reaches about +120 m near 6.76 S.
- Credit: MOLA Science Team, NASA/JPL/GSFC, and USGS Astrogeology.
