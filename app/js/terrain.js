// Terrain model: HiRISE DTM grid (elevation, slope, hazard class) with MOLA fallback. Pure functions (no DOM), testable in Node.
// HiRISE files: int16 elevation (m, Mars 2000 datum, -32768 = no data), uint8 slope in degrees (255 = none), uint8 class (0/1/2, 255 = none).
// MOLA: 448 x 448 int16 grid at 128 px/deg (463 m), same datum.
import { HAZARD, M_PER_DEG } from './config.js';

export const NODATA16 = -32768, NODATA8 = 255;
const D2R = Math.PI / 180;

export const classOfSlope = s => (s < HAZARD.yellowFrom ? 0 : s <= HAZARD.redFrom ? 1 : 2);

const i16 = buf => new Int16Array(buf.buffer ? buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) : buf);
const u8 = buf => new Uint8Array(buf);

// bounds: {south,north,west,east}; width/height of the grid
export function makeHirise(boundsJson, demBuf, slopeBuf, hazardBuf) {
  const b = boundsJson.bounds, spec = boundsJson.files['gale_hirise_dem_int16le.bin'];
  const W = spec.width, H = spec.height, step = (b.east - b.west) / W;
  const dem = i16(demBuf), slope = u8(slopeBuf), cls = u8(hazardBuf);
  if (dem.length !== W * H || slope.length !== W * H || cls.length !== W * H) throw new Error('HiRISE size mismatch');
  return { W, H, north: b.north, south: b.north - H * (b.north - b.south) / H, west: b.west, east: b.east, step, dem, slope, cls };
}

export function makeMola(boundsJson, demBuf) {
  const spec = boundsJson.files['gale_mola_dem.tif'], b = spec.bounds, W = spec.width, H = spec.height;
  const dem = i16(demBuf); if (dem.length !== W * H) throw new Error('MOLA size mismatch');
  const stepLat = (b.north - b.south) / H, stepLon = (b.east - b.west) / W;
  const dy = stepLat * M_PER_DEG, slope = new Float32Array(W * H).fill(NaN);
  for (let r = 1; r < H - 1; r++) {
    const lat = b.north - (r + 0.5) * stepLat, dx = stepLon * M_PER_DEG * Math.cos(lat * D2R);
    for (let c = 1; c < W - 1; c++) {
      const k = r * W + c, z = [dem[k - W - 1], dem[k - W], dem[k - W + 1], dem[k - 1], dem[k], dem[k + 1], dem[k + W - 1], dem[k + W], dem[k + W + 1]];
      if (z.some(v => v === NODATA16)) continue;
      const dzdx = ((z[2] + 2 * z[5] + z[8]) - (z[0] + 2 * z[3] + z[6])) / (8 * dx), dzdy = ((z[6] + 2 * z[7] + z[8]) - (z[0] + 2 * z[1] + z[2])) / (8 * dy);
      slope[k] = Math.atan(Math.hypot(dzdx, dzdy)) / D2R;
    }
  }
  return { W, H, north: b.north, south: b.south, west: b.west, east: b.east, stepLat, stepLon, dem, slope };
}

// bilinear sample of a MOLA array at (lat, lon); returns NaN outside / on no-data
export function molaBilinear(M, arr, lat, lon, nodata) {
  const fr = (M.north - lat) / M.stepLat - 0.5, fc = (lon - M.west) / M.stepLon - 0.5;
  if (fr < -0.5 || fc < -0.5 || fr > M.H - 0.5 || fc > M.W - 0.5) return NaN;
  const r0 = Math.max(0, Math.min(M.H - 2, Math.floor(fr))), c0 = Math.max(0, Math.min(M.W - 2, Math.floor(fc)));
  const tr = Math.max(0, Math.min(1, fr - r0)), tc = Math.max(0, Math.min(1, fc - c0));
  const v = [arr[r0 * M.W + c0], arr[r0 * M.W + c0 + 1], arr[(r0 + 1) * M.W + c0], arr[(r0 + 1) * M.W + c0 + 1]];
  if (v.some(x => x === nodata || x !== x)) { const ok = v.filter(x => x !== nodata && x === x); return ok.length ? ok.reduce((a, b) => a + b, 0) / ok.length : NaN; }
  return (v[0] * (1 - tc) + v[1] * tc) * (1 - tr) + (v[2] * (1 - tc) + v[3] * tc) * tr;
}

// T = { hirise|null, mola }. Returns { elev, slope, cls, source: 'hirise'|'mola', lowConfidence } or null outside all data.
export function sample(T, lat, lon) {
  const h = T.hirise;
  if (h && lat <= h.north && lat >= h.south && lon >= h.west && lon <= h.east) {
    const r = Math.floor((h.north - lat) / h.step), c = Math.floor((lon - h.west) / h.step);
    if (r >= 0 && r < h.H && c >= 0 && c < h.W) {
      const k = r * h.W + c, z = h.dem[k];
      if (z !== NODATA16) {
        const s = h.slope[k];
        if (s !== NODATA8) return { elev: z, slope: s, cls: h.cls[k], source: 'hirise', lowConfidence: false };
        const ms = molaBilinear(T.mola, T.mola.slope, lat, lon, NaN); // HiRISE edge cell: elevation yes, slope no
        if (ms === ms) return { elev: z, slope: ms, cls: classOfSlope(ms), source: 'mola', lowConfidence: true };
      }
    }
  }
  const e = molaBilinear(T.mola, T.mola.dem, lat, lon, NODATA16);
  if (e !== e) return null;
  const ms = molaBilinear(T.mola, T.mola.slope, lat, lon, NaN);
  return { elev: e, slope: ms === ms ? ms : 0, cls: classOfSlope(ms === ms ? ms : 0), source: 'mola', lowConfidence: true };
}

// ---------------------------------------------------------------------------------------------------
// Local roughness: RMS of the residual of a least-squares plane fitted to each 3x3 window of the HiRISE DTM (metres).
// The plane removes the regional slope, so a smooth slope is not "rough"; ridges, blocks fields and scarps stand out.
// 8 m cells: single boulders are NOT resolved (a 1-2 m boulder is far below the cell size). NaN where any of the 9 cells lacks data.
export function roughness(h) {
  const { W, H, dem } = h, out = new Float32Array(W * H).fill(NaN), z = new Float64Array(9);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    let ok = true, sum = 0, sx = 0, sy = 0, n = 0;
    for (let dy = -1; dy <= 1 && ok; dy++) for (let dx = -1; dx <= 1; dx++) { const v = dem[(y + dy) * W + x + dx]; if (v === NODATA16) { ok = false; break; } z[n++] = v; sum += v; sx += dx * v; sy += dy * v; }
    if (!ok) continue;
    const m = sum / 9, b = sx / 6, c = sy / 6; let ss = 0, k = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const r = z[k++] - (m + b * dx + c * dy); ss += r * r; }
    out[y * W + x] = Math.sqrt(ss / 9);
  }
  return out;
}
