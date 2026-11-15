# Curiosity (MSL) Rota Verisi (Traverse / PLACES)

Gale Krateri / Sharp Dağı rota planında gerçek referans olarak kullanılacak **Curiosity (Mars Science Laboratory)** resmi konum ve sürüş yolu verisi.

---

## 1. Doğrudan İndirilebilir Veri Linkleri

Resmi **NASA PDS4 MSL Rover PLACES Bundle** (`urn:nasa:pds:msl_places`, sürüm `42.0`, DOI: `10.17189/8nyv-8p60`) altından doğrudan CSV indirilebilir (hazır GeoJSON veya Shapefile formatında statik dosya yoktur; CSV içindeki `planetocentric_latitude` / `longitude` veya `northing` / `easting` sütunlarından GeoJSON üretilebilir):

- **Tam enterpole edilmiş rota (önerilen — 49.315 satır, ~11,76 MB):**
  `https://planetarydata.jpl.nasa.gov/img/data/msl/msl_places/data_localizations/localized_interp.csv`
- **Ana lokalizasyon durakları (hafif özet — 1.470 satır, ~350 KB):**
  `https://planetarydata.jpl.nasa.gov/img/data/msl/msl_places/data_localizations/localized_pos.csv`
- **Ham telemetri tablosu (~25,4 MB):**
  `https://planetarydata.jpl.nasa.gov/img/data/msl/msl_places/data_localizations/telemetry.csv`
- **Klasör ve PDS4 etiketleri (`.xml`):**
  `https://planetarydata.jpl.nasa.gov/img/data/msl/msl_places/data_localizations/`
  *(PDS Imaging ana bağlantısı `https://pds-imaging.jpl.nasa.gov/data/msl/msl_places/data_localizations/` da bu adrese yönlendirir.)*

---

## 2. Verinin İçinde Ne Var?

`localized_interp.csv` ve `localized_pos.csv` dosyaları aynı **26 sütunlu** şemaya sahiptir:

- **Rota ve duruş (pose) noktaları:**
  - `frame` (`SITE` veya `ROVER`), `site` (`1`..`121`), `drive`, `pose`
  - `landing_x`, `landing_y`, `landing_z` (iniş noktası `SITE 1`'e göre metre; `+X` kuzey, `+Y` doğu, `+Z` aşağı)
  - `roll`, `pitch`, `yaw` (derece) ve `quat_s`, `quat_v1`, `quat_v2`, `quat_v3`
- **Tarih / Sol bilgisi:**
  - `sol`: Mars günü (`0`..`4868`)
  - `sclk`: Uzay aracı saati (not: `document/release_notes.txt` bazı satırlarda `0`/`1` veya çakışan SCLK anomalileri olabileceğini belirttiği için zaman sıralamasında `sol` + `site` + `drive` esas alınmalıdır; satır içinde ISO tarih sütunu yoktur, zaman aralığı `.xml` etiketinde yer alır).
- **Koordinat sistemi (`localized_interp.csv.xml` ve `data_maps/msl_orbital_map.xml`):**
  - `planetocentric_latitude` (derece, gezegen merkezli enlem — Mars Trek/HiRISE haritalarıyla eşleştirmede standart)
  - `planetodetic_latitude` (derece, gezegensel enlem)
  - `longitude` (derece, **Positive East** / Doğu pozitif, Body-fixed Rotating)
  - `northing`, `easting` (metre; **Equirectangular** projeksiyon, projeksiyon merkezi `0.0° lat / 0.0° lon`, `standard_parallel_1 = 0°`, küre yarıçapı `3396.19 km`)
  - `elevation` (metre, referans datuma göre yukarı pozitif; eksik değer sabiti `-9999`)
  - `map_pixel_line`, `map_pixel_sample`, `dem_pixel_line`, `dem_pixel_sample` (bundle içindeki baz harita ve DEM kesitlerindeki 0-tabanlı piksel koordinatları)

---

## 3. Hangi Tarihe Kadar Güncel?

- **Başlangıç:** `2012-08-06T05:18:39Z` (Sol `0`, Site `1`, Drive `0`)
- **Bitiş (`localized_interp.csv` ve `telemetry.csv`):** **`2026-04-17T00:19:01Z`** — **Sol `4868`** (Site `121`, Drive `3174`)
- **Bitiş (`localized_pos.csv`):** **Sol `4865`** (Site `121`, Drive `2826`)
- **Dosya / arşiv tarihi:** `.xml` üretim tarihi `2026-05-01`, JPL sunucusu `Last-Modified` tarihi `2026-08-01`.
- **Not:** PDS arşivleme döngüsü nedeniyle Nisan 2026 sonrası son birkaç aylık sürüşler henüz bu pakette yoktur; rota referansı için 13+ yıllık (4.868 sol) gerçek güzergâh eksiksiz olarak mevcuttur.

---

## 4. Bakılan Kaynakların Durumu (Şeffaf Kontrol Notu)

İstenen üç kaynaktaki inceleme sonucu:

1. **NASA Space Apps 2026 Görev Sayfası** (`https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/`):
   - *Resources* sekmesinde 5 bağlantı yer alıyor (Mars Trek, USGS-NASA Planetary Geologic Mapping Program, `science.nasa.gov` üzerinde önerilen rota animasyon GIF'i `curiositys-proposed-path-up-mount-sharp/`, NASA Worldview, Perseverance ham görüntüleri).
   - **İndirilebilir Curiosity traverse verisi (CSV/GeoJSON/Shapefile) burada bulunamadı.**
2. **NASA Mars Trek** (`https://trek.nasa.gov/mars/`):
   - Katalog API'si (`TrekServices/ws/index/eq/searchItems`) sorgulandığında `traverse` için `0`, `curiosity` için `3` (`Curiosity Landing Site_bookmark`, `curiosity_ctx_mosaic`, `curiosity_hirise_mosaic`), `MSL` için `1` (`mars_pahrump_patch_8k_256m`) kayıt döndü.
   - **Doğrudan indirilebilir Curiosity rota dosyası (CSV/GeoJSON/Shapefile) Mars Trek'te bulunamadı.**
3. **NASA PDS Geosciences MSL** (`https://pds-geosciences.wustl.edu/missions/msl/`):
   - Doğrudan bu sayfada traverse dosyası barındırılmıyor; ancak sayfada **PDS Imaging Node MSL Volumes** (`https://pds-imaging.jpl.nasa.gov/volumes/msl.html`) ve **MSL Analyst's Notebook** (`https://an.rsl.wustl.edu/msl/`) bağlantıları veriliyor.
   - **Resmi ve doğrudan indirilebilir CSV rota verisi (`msl_places`), bu PDS Imaging Node bağlantısı üzerinden bulundu ve doğrulandı.**

---

## 5. Repoya Eklenen Dosyalar (2026-11-14)

| Dosya | İçerik | Boyut |
|---|---|---|
| `localized_interp.csv` | PDS'teki dosyanın **ham ve değiştirilmemiş** kopyası (msl_places v42.0) | 11.755.643 B (~11,76 MB) |
| `gale_traverse.csv` | Gale kutusu içindeki satırlar, 12 sütun: `frame, site, drive, pose, sol, sclk, planetocentric_latitude, longitude, elevation, roll, pitch, yaw` | ~4,4 MB |
| `traverse.geojson` | 1 adet `LineString` (rota) ve 49 adet `Point` (yaklaşık her 100. sol) | ~1,2 MB |

### Kontroller

- **Satır sayısı:** Başlık hariç **49.315** veri satırı. Bu sayı yukarıdaki 49.315 değeriyle ve `localized_interp.csv.xml` etiketindeki `<records>49315</records>` ile birebir aynı.
- **Sol aralığı:** `0` – `4868` (Site `1` – `121`). Ayrıca `sol = -1` olan **2 satır** var. Bunlar `SITE` çerçeve tanımlarıdır ve gerçek bir sürüş anı değildir.
- **Çerçeveler:** `ROVER` tipinde 49.194 satır, `SITE` tipinde 121 satır (her site için bir başlangıç noktası).
- **Gale kutusu** (enlem -7,0..-3,5, boylam 136,0..139,5 D; `data/mola/bounds.json` ile aynı): **Kutunun dışında kalan satır yok, 49.315 satırın tamamı içeride.** Bu yüzden `gale_traverse.csv` bütün satırları içeriyor, sadece sütunlar azaltıldı. Gerçek kapsam: enlem -4,8143..-4,5891, boylam 137,3527..137,4495 D, yükseklik -4.521,3..-3.570,7 m. Eksik yükseklik (`-9999`) yok.
- **Bradbury iniş noktası:** Dosyadaki ilk `sol = 0` satırı `ROVER, site 1, drive 0, pose 0`, konumu enlem -4,589466996 ve boylam 137,441632997. Verilen iniş noktasıyla (-4,5895, 137,4417) karşılaştırınca dosyadaki konum, verilen noktanın yaklaşık **2 m kuzeyinde ve 4 m batısında, toplam ~4,4 m** uzakta. Bu fark, verilen değeri 4 ondalığa yuvarlamanın yapabileceği en büyük sapmadan (her eksende ~3 m) biraz fazla, yani yalnızca yuvarlamayla açıklanamıyor. Dosyadaki boylam 137,441633, 4 ondalığa 137,4416 olarak yuvarlanır (HiRISE notu da 137,4416 kullanıyor). İki konum birkaç metre içinde **uyuşuyor**; hangisinin resmî iniş noktası olduğu bu çalışmada **doğrulanmadı**.

### Koordinat sistemi

- **Enlem/boylam:** Gezegen merkezli enlem (`planetocentric_latitude`) ve doğu pozitif boylam (`longitude`), derece cinsinden. Mars 2000 küresi, R = 3.396.190 m. GeoJSON'da da bu iki sütun kullanıldı, koordinatlar `[boylam, enlem]` sırasında.
- **GeoJSON uyarısı:** GeoJSON standardı normalde Dünya (WGS84) koordinatı varsayar. Bu dosya **Mars koordinatıdır**. Dosyada bunu belirten bir `crs_note` alanı var, harita kütüphanesinde Mars katmanlarıyla birlikte kullanılmalıdır.
- **Yükseklik:** Etikete göre "Elevation of the point relative to the datum. Positive is up". Datumun adı etikette yazmıyor. İniş noktasındaki -4.501 m değeri, `data/mola` DEM'inin aynı yerdeki yaklaşık -4.500 m değeriyle uyumlu. Ama aynı datum olduğu **doğrulanmadı**.
- **Yaw:** Etikete göre saat yönünde, 0 = kuzey, 90 = doğu (derece).

### `traverse.geojson` nasıl üretildi?

- **Rota çizgisi:** Sadece `frame = ROVER` ve `sol ≥ 0` olan satırlar alındı. Sıralama `sol`, `site`, `drive`, `pose` sırasıyla yapıldı (SCLK anomalileri nedeniyle SCLK ile sıralanmadı, bkz. bölüm 2). Koordinatlar önce 7 ondalık basamağa yuvarlandı (~1 cm), sonra art arda tekrar eden aynı koordinatlar tek noktaya indirildi. Sonuçta **46.507 köşe** kaldı (sıra fark ediyor: önce tekilleştirip sonra yuvarlamak 46.749 köşe verir).
- **Noktalar:** 0, 100, 200, … 4800 hedef sollerinin her biri için o sol veya ondan **sonraki ilk** kayıtlı satır alındı. Hedef sol'de satır yoksa sonraki sol'e geçildi. Örneğin 200 yerine 272, 1000 yerine 1030, 2500 yerine 2555, 4000 yerine 4028 alındı. Her noktanın `properties` alanında `sol`, `target_sol`, `site`, `drive`, `elevation_m` var.

### Repoya konmayanlar

Büyük oldukları için `localized_pos.csv` ve `telemetry.csv` repoya **eklenmedi**. Linkleri bölüm 1'de.
