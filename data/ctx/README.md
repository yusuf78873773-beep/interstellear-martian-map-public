# CTX photo mosaic: Gale Crater / Mount Sharp

Data collected on 2026-11-14 for the Interstellear Martian map (NASA Space Apps 2026). The layout follows `data/mola/`.

## Region

It uses the same box as `data/mola`: **latitude -7.0 to -3.5, longitude 136.0 to 139.5 E**, so the CTX and MOLA layers overlay. Both use the Mars 2000 sphere (R = 3,396,190 m), planetocentric latitude, east-positive longitude, on an equirectangular grid. Exact per-file bounds and pixel-to-coordinate formulas are in `bounds.json`.

## Files

| File | Area | Size (px) | Zoom | Resolution |
|---|---|---|---|---|
| `gale_ctx_overview.png` | Whole region | 2549 × 2548 | 8 | 728.18 px/deg, about **81.4 m/px** |
| `gale_ctx_detail_sharp_base.png` | Mount Sharp base and Curiosity landing site, about 20 × 20 km | 3932 × 3931 | 12 | 11,650.8 px/deg, about **5.09 m/px** (see the patch note below) |
| `bounds.json` | Bounds, size, m/px and pixel-to-coordinate formulas for both images, plus the list of patched tiles | | | |

Both images are 8-bit greyscale PNGs. They are pictures only and carry no elevation; use `data/mola` for slope.

### Overview
Zoom 8 is the highest level that stays under about 3000 px across the 3.5° box. Zoom 9 would be 5097 px. The image is a crop of the native tiles with no resampling.

### Detail crop
- Box: latitude **-4.520 to -4.857**, longitude **137.270 to 137.607 E** (0.3374° = 20 km on each side).
- The Curiosity landing site (Bradbury Landing, 4.5895 S, 137.4417 E) is at about **row 809, column 2000**. It sits on the flat floor of Aeolis Palus at about -4500 m (MOLA).
- To the south and south-east, the ground climbs from about -4450 m to about -1900 m at the south-east corner (MOLA). The image shows the dark Bagnold dune band and the layered rocks at the base of Mount Sharp.
- Zoom 12 is the highest level the server returns. Zoom 13 and above give HTTP 400.

## Source

- Layer: **CTX_beta01_uncontrolled_5m_Caltech**, "CTX Global BETA Uncontrolled 5m Caltech". Mosaic by the Murray Lab (Caltech), hosted by Esri.
- Capabilities: https://trek.nasa.gov/tiles/Mars/EQ/CTX_beta01_uncontrolled_5m_Caltech/1.0.0/WMTSCapabilities.xml (identical to the copy in `data/mars-trek/`)
- TileMatrixSet: `default028mm`, 512 px PNG tiles, top-left corner -180, 90. Level 0 is 2 × 1 tiles at 0.3515625°/px, and each level doubles that.
- Tile URL (taken from the capabilities `ResourceURL`): `https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer/tile/{zoom}/{row}/{col}`
- Service info: https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer?f=json. The capabilities file lists zoom 0–11, but the MapServer serves zoom 12 as well.
- Tiles used: overview at zoom 8, rows 132–137 and columns 449–454 (36 tiles). Detail at zoom 12, rows 2150–2158 and columns 7219–7227 (81 tiles).
- Credit: **NASA/JPL/MSSS/The Murray Lab** (free use for all purposes, as the service states).

## Known limitations

1. **16 of the 81 detail tiles are broken on the server.** The PNG files do not decode, and the bytes that do decode belong to a different image. Downloading them again returns the same bytes. The area of those tiles (about 19% of the detail image) was filled from the parent **zoom-11** tile, upsampled 2×. That is real CTX data at **10.18 m/px**, shown at 5 m/px, so those areas look slightly softer. They are mostly in the north-west of the crop (around 4.52–4.70 S, 137.28–137.46 E) and in the south-east corner. The full list is under `replaced_tiles` in `bounds.json`. The tile that contains the landing site is native zoom 12.
2. **Every tile was checked:** the remaining tiles match their zoom-11 parent closely (Pearson r at least 0.79, median 0.97 for the detail tiles). All overview tiles passed with r at least 0.93.
3. **Uncontrolled mosaic:** this beta mosaic is not tied to ground control, so features can be offset from MOLA by up to a few hundred metres.
4. **8-bit, lossy:** the service delivers 8-bit data that went through lossy JPEG compression on the server. It is not the raw 5 m CTX data.
5. **Seams and stripes:** the overview shows brightness stripes and a horizontal seam near 4 S where CTX image strips meet. These come from the mosaic itself, not from the tile stitching.

---

## Boxwork kuşağı detay görseli (eklendi 2026-11-14)

`gale_ctx_detail_boxwork.png`: CTX mozaiğinin **zoom 12** (5,09 m/piksel) detay görseli, boyut **2387 × 3860 piksel**, ~2,5 MB. Aynı katman, aynı tile adresi ve aynı yöntem (yukarıdaki bölümler).

- **Kutu:** enlem -5,0506..-4,7193, boylam 137,2367..137,4415 D (piksel kenarlarına oturtulmuş tam sınırlar `bounds.json` içinde). Bu, `data/boxwork/README.md` bölüm 8.B'deki "Birleştirilmiş HiRISE Boxwork Yamaç Zarfı" kutusudur. Boxwork sırtlarının gerçek dış konturu değildir (resmi bir poligon yok).
- **Neden bu kutu:** `data/boxwork/README.md` bölüm 8.C, `gale_ctx_detail_sharp_base.png`'in boxwork kuşağını tam kapsamadığını söylüyor: batıda yaklaşık 0,033° ve güneyde 0,09–0,19° taşıyor. Bu görsel o parçayı da içerir. Sınırı bu bölümden aldım. Doğuya (boylam 137,6–137,85) taşan bir kısım README'de yoktur, bu yüzden o bölge bu görselde **yok**.
- **Bozuk tile'lar:** 48 tile'ın **11'i sunucuda bozuk** (PNG açılmıyor). Bu tile'ların alanı (görüntünün yaklaşık **%23'ü**, çoğu güney ucunda) **zoom 11 üst tile'dan 2 kat büyütülerek** dolduruldu. Bu gerçek CTX verisi ama 10,18 m/piksel, 5 m'de gösteriliyor, yani o parçalar biraz daha bulanık. Tile listesi `bounds.json` içindeki `replaced_tiles` alanında. Kalan 37 tile üst seviyeleriyle karşılaştırıldı, hepsi uyuştu (korelasyon en az 0,93, ortanca 0,98).
- **Çözünürlük:** Zoom 12 kullanılabildi, zoom 11'e düşmek gerekmedi.
- **Bilinen sınırlar:** Önceki görüntülerdekiyle aynı: konum kontrolsüz mozaik olduğu için MOLA'ya göre birkaç yüz metre kayabilir, veri 8-bit ve sunucuda kayıplı sıkıştırılmış.
