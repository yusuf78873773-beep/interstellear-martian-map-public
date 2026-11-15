// Constants and layer registry. All paths are relative so the site works in a sub-directory.
export const REGION = { south: -7.0, north: -3.5, west: 136.0, east: 139.5 }; // data/mola/bounds.json
export const BRADBURY = { lat: -4.5895, lon: 137.4417 };                       // landing site (data/curiosity-traverse/README.md)
export const R_MARS = 3396190;                                                  // Mars 2000 sphere radius, m
export const M_PER_DEG = 2 * Math.PI * R_MARS / 360;

// Hazard thresholds: data/slope-hazard/README.md section 2 (PROJECT PROPOSAL, not a NASA standard)
export const HAZARD = { yellowFrom: 15, redFrom: 20 }; // green <15, yellow 15..20 (inclusive), red >20
// Okabe-Ito colour-blind-safe palette (class names are also shown as text)
export const HAZARD_COLORS = { 0: [0, 158, 115], 1: [240, 228, 66], 2: [213, 94, 0] };

export const DATA = 'data/';
export const FILES = {
  manifest: DATA + 'manifest.json',
  hiriseBounds: DATA + 'hirise/dtm_gale/bounds.json',
  hiriseDem: DATA + 'hirise/dtm_gale/gale_hirise_dem_int16le.bin',
  hiriseSlope: DATA + 'hirise/dtm_gale/gale_hirise_slope_deg_uint8.bin',
  hiriseHazard: DATA + 'hirise/dtm_gale/gale_hirise_hazard_class_uint8.bin',
  molaBounds: DATA + 'mola/bounds.json',
  molaDem: DATA + 'mola/gale_mola_dem_int16le.bin',
  traverse: DATA + 'curiosity-traverse/traverse.geojson',
  chemcam: DATA + 'chemistry/chemcam_points.csv',
  apxs: DATA + 'chemistry/apxs_all.csv',
  boxwork: DATA + 'boxwork/boxwork_area.geojson',
  drills: DATA + 'boxwork/drill_sites.geojson',
  photos: DATA + 'photos/photos.csv', photosDir: DATA + 'photos/',
  sharad: DATA + 'sharad/sharad_tracks.geojson',
  crismProducts: DATA + 'crism/gale_mtrdr_products.csv',
  crismBounds: DATA + 'crism/bounds.json',
  rad: DATA + 'curiosity-rad/rad_daily_dose.csv',
  rems: DATA + 'rems/rems_daily.csv',
};

// kind: image | crism | hirise | geojson | csv-points | csv-boxes. group: base | terrain | data.
// boundsFrom: [bounds.json path, key inside "files"] (pixel-edge bounds), or 'hirise'.
export const LAYERS = [
  { id: 'ctx_overview', group: 'base', kind: 'image', url: DATA + 'ctx/gale_ctx_overview.png', boundsFrom: [DATA + 'ctx/bounds.json', 'gale_ctx_overview.png'], manifest: 'data/ctx/gale_ctx_overview.png', on: true, opacity: 1 },
  { id: 'ctx_sharp', group: 'base', kind: 'image', url: DATA + 'ctx/gale_ctx_detail_sharp_base.png', boundsFrom: [DATA + 'ctx/bounds.json', 'gale_ctx_detail_sharp_base.png'], manifest: 'data/ctx/gale_ctx_detail_sharp_base.png' },
  { id: 'ctx_boxwork', group: 'base', kind: 'image', url: DATA + 'ctx/gale_ctx_detail_boxwork.png', boundsFrom: [DATA + 'ctx/bounds.json', 'gale_ctx_detail_boxwork.png'], manifest: 'data/ctx/gale_ctx_detail_boxwork.png' },
  { id: 'mola_shade', group: 'base', kind: 'image', url: DATA + 'mola/gale_mola_clrshade.png', boundsFrom: [DATA + 'mola/bounds.json', 'gale_mola_clrshade.png'], manifest: 'data/mola/gale_mola_clrshade.png', opacity: 0.8 },
  { id: 'themis_day', group: 'base', kind: 'image', url: DATA + 'themis/gale_themis_day_ir.png', boundsFrom: [DATA + 'themis/bounds.json', 'gale_themis_day_ir.png'], manifest: 'data/themis/gale_themis_day_ir.png' },
  { id: 'themis_night', group: 'base', kind: 'image', url: DATA + 'themis/gale_themis_night_ir.png', boundsFrom: [DATA + 'themis/bounds.json', 'gale_themis_night_ir.png'], manifest: 'data/themis/gale_themis_night_ir.png' },
  { id: 'crism_browse', group: 'base', kind: 'crism', manifest: 'data/crism/browse/frt000058a3_07_brphyj_mtr3.png', opacity: 0.85 },

  { id: 'hirise_slope', group: 'terrain', kind: 'hirise', mode: 'slope', manifest: 'data/hirise/dtm_gale/gale_hirise_slope_deg_uint8.bin', opacity: 0.7, heavy: true },
  { id: 'rough', group: 'terrain', kind: 'rough', manifest: 'derived:rough', opacity: 0.8, heavy: true },
  { id: 'hirise_hazard', group: 'terrain', kind: 'hirise', mode: 'hazard', manifest: 'data/hirise/dtm_gale/gale_hirise_hazard_class_uint8.bin', opacity: 0.7, heavy: true },

  { id: 'traverse', group: 'data', kind: 'geojson', url: FILES.traverse, manifest: 'data/curiosity-traverse/traverse.geojson' },
  { id: 'drills', group: 'data', kind: 'geojson', url: FILES.drills, manifest: 'data/boxwork/drill_sites.geojson' },
  { id: 'boxwork', group: 'data', kind: 'geojson', url: FILES.boxwork, manifest: 'data/boxwork/boxwork_area.geojson', approximate: true },
  { id: 'sharad', group: 'data', kind: 'geojson', url: FILES.sharad, manifest: 'data/sharad/sharad_tracks.geojson' },
  { id: 'chemcam', group: 'data', kind: 'csv-points', url: FILES.chemcam, manifest: 'data/chemistry/chemcam_points.csv', heavy: true },
  { id: 'apxs', group: 'data', kind: 'csv-points', url: FILES.apxs, manifest: 'data/chemistry/apxs_all.csv', heavy: true },
  { id: 'crism_fp', group: 'data', kind: 'csv-boxes', url: FILES.crismProducts, manifest: 'data/crism/gale_mtrdr_products.csv' },
];
