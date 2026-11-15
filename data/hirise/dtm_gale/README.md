# HiRISE DTM: Gale kırpması (eğim ve tehlike sınıfı)

HiRISE (MRO) yüksek çözünürlüklü sayısal arazi modellerinden (DTM) üretilen, Curiosity rotası ve boxwork kuşağı çevresi için **seyreltilmiş** yükseklik, eğim ve tehlike sınıfı dosyaları. Erişim tarihi: 2026-11-14. Kaynak listesi ve boyutlar: `../dtm_priority.md`.

> **En önemli uyarı:** Çakışan DTM'ler birbirinden **belirgin biçimde farklı** (aşağıda "DTM'ler arası farklar"). Bu yüzden DTM'ler **harmanlanmadı**: birleştirilmiş dosyada her piksel tek bir DTM'den gelir (öncelik sırasıyla) ve DTM sınırlarında yükseklik basamakları olabilir. Her DTM ayrıca `per_dtm/` altında tek başına verildi.

## Dosyalar

Hepsi aynı ızgarada: **2271 × 3296 piksel**, **8,09 m/piksel** (7323,3 piksel/derece), satır 0 = kuzey kenar. Sınırlar: enlem -4,9501 .. -4,5000, boylam 137,2400 .. 137,5501 D. Tam değerler ve piksel→koordinat formülleri `bounds.json` içinde (koordinat sistemi `data/mola` ile aynı: Mars 2000 küre, R = 3396190 m, doğu pozitif boylam).

| Dosya | İçerik | Boyut |
|---|---|---|
| `gale_hirise_dem_int16le.bin` | Yükseklik, int16 little-endian, **metre**, nodata = **-32768** | ~15,0 MB |
| `gale_hirise_dem.tif` | Aynı yükseklik, GeoTIFF (`data/mola/gale_mola_dem.tif` ile aynı Mars geokey'leri), nodata -32768 | ~15,0 MB |
| `gale_hirise_slope_deg_uint8.bin` | Eğim, **derece**, uint8, **255 = veri yok** | ~7,5 MB |
| `gale_hirise_hazard_class_uint8.bin` | Tehlike sınıfı: **0 = yeşil, 1 = sarı, 2 = kırmızı, 255 = veri yok** | ~7,5 MB |
| `per_dtm/gale_hirise_dtm1..5_dem_int16le.bin` | Her DTM tek başına, kendi geçerli kutusuna kırpılmış, harmanlanmamış yükseklik (int16, m) | 2,3–3,1 MB her biri |
| `bounds.json` | Sınırlar, boyutlar, kaynak ürünler, fark istatistikleri | küçük |

JavaScript ile okuma:

```js
const z = new Int16Array(await (await fetch('gale_hirise_dem_int16le.bin')).arrayBuffer()); // 2271 sütun × 3296 satır
const elev = (row, col) => z[row * 2271 + col];            // -32768 = veri yok
// piksel merkezi: lat = -4.5 - (row + 0.5) / 7323,3118,  lon = 137.24 + (col + 0.5) / 7323,3118
```

## Kaynak ve yöntem

- **Kaynak:** HiRISE DTM ürünleri (`DTEEC_*`, 1,01 m/piksel, equirectangular, 32-bit float), `https://hirise-pds.lpl.arizona.edu/PDS/DTM/` altında. Kullanılan 5 DTM: `DTEEC_019698_1750_019988_1750_U01`, `DTEEC_009149_1750_009294_1750_U01`, `DTEEC_040770_1755_039280_1755_U01`, `DTEEC_023957_1755_024023_1755_U01`, `DTEEC_001488_1750_001752_1750_U02`. Sırayla dtm1…dtm5 (`../dtm_priority.md` sırası). Ürün etiketine göre değerler "Mars 2000 Datum" (eş potansiyel yüzey, areoid) üzerindeki **metre** cinsinden yüksekliktir, yani `data/mola` DEM'i ile aynı referans.
- **Okuma:** Python/GDAL kurulu olmadığı için dosyalar Node ile doğrudan okundu (PDS3 etiketi dosyanın başında, ham float32). Sadece kırpma kutusundaki satırlar indirildi, ham dosyalar repoya konmadı.
- **Kırpma kutusu:** enlem -4,95..-4,50, boylam 137,24..137,55 (ızgara tam piksellere oturtulduğu için doğu kenarı 137,5501).
- **Seyreltme:** 8 × 8 yerel piksellik **blok ortalaması** (1,01 m → 8,09 m). Bir hücrede 64 pikselin en az 32'si geçerliyse hücre geçerli sayıldı. Yükseklikler tam metreye yuvarlandı.
- **Eğim:** Seyreltilmiş ızgarada **Horn 3×3** yöntemiyle, her DTM'in **kendi içinde** hesaplandı (DTM dikişlerinde sahte dik eğim oluşmasın diye), sonra aynı öncelikle birleştirildi: bir piksel için sırayla ilk geçerli eğime sahip DTM alındı. **Yerel 1 m çözünürlükte eğim hesaplanmadı** (1 m'de gürültülü). ~8 m ızgarada eğim, küçük kaya ve çukurları yumuşatır, yani gerçek yerel eğimi **hafife alabilir**. Her DTM'in geçerli alanının 1 piksellik kenarında eğim yok (255).
- **Kapsama:** Izgaranın **%52,7'inde** yükseklik var (dtm1: 1.124.796, dtm2: 661.736, dtm3: 444.106, dtm4: 883.038, dtm5: 829.752 hücre kullanıldı). Kalan hücreler nodata.

## DTM'ler arası farklar (harmanlanmadı)

Çakışan alanlarda aynı noktanın yüksekliği DTM'e göre değişiyor (fark = ilk DTM − ikinci DTM, aynı ızgara hücresinde):

| Çift | Çakışma | Ortalama fark | RMS | Ortanca \|fark\| | %95 \|fark\| | En büyük \|fark\| |
|---|---|---|---|---|---|---|
| dtm1–dtm2 | 31,0 km² | -2,8 m | 18,3 m | 8,6 m | 40,4 m | 92 m |
| dtm1–dtm3 | 10,3 km² | 4,8 m | 14,0 m | 7,5 m | 29,9 m | 79 m |
| dtm1–dtm5 | 15,2 km² | -5,6 m | 11,8 m | 5,8 m | 26,7 m | 65 m |
| dtm2–dtm3 | 28,1 km² | 4,3 m | 19,8 m | 7,6 m | 43,6 m | 113 m |

- **Yatay kayma testi:** İki DTM'i birbirine göre ±6 hücre (±49 m) kaydırıp RMS farkına bakıldı. En iyi kayma her çiftte pencerenin kenarına (≈49 m) dayandı ve RMS ciddi düştü (dtm1–dtm2: 18,3 → 10,0 m; dtm1–dtm5: 11,8 → 3,6 m). Yani DTM'ler birbirine göre **yatayda en az yaklaşık 50 m kaymış görünüyor**, gerçek kayma daha büyük olabilir. Bu fark dik yamaçlarda büyük dikey farka dönüşür. Kayma bu çalışmada **düzeltilmedi** (aranan pencere sınırlıydı ve kaynak yeniden hizalanmadı). Nedeni (DTM'lerin kendi hizalaması) doğrulanmadı.
- **MOLA'ya göre sapma** (DTM, 463 m MOLA pikselleri üzerinde ortalaması − MOLA, ortanca [%5–%95]): dtm1 +38,7 m [4,5; 87,6], dtm2 +43,9 m [0,7; 106,8], dtm3 +6,2 m [-8,4; 75,5], dtm4 +0,7 m [-13,8; 57,0], dtm5 +26,3 m [-8,3; 95,3]. Dik arazide MOLA'nın kaba (463 m) olması bunun bir kısmını açıklayabilir, ama DTM'den DTM'ye değişimin sebebi **doğrulanmadı**.
- **Sonuç:** Birleştirilmiş yükseklik "hangi DTM'den geldiğini bilerek" kullanılmalı. Yükseklik farkı gereken analizlerde `per_dtm/` dosyaları tercih edilmeli. Eğim her DTM'in içinde hesaplandığı için bu kaymadan etkilenmez, ama kaymayla birlikte aynı yerin eğimi DTM'e göre değişebilir.

## Eğim ve tehlike sınıfı

- **Eğim dağılımı** (geçerli 3.929.118 hücre): ortanca 6,9°, %95'lik 30,0°, en büyüğü 73,6° (uint8'e yuvarlanır, en fazla 90).
- **Sınıflandırma:** `data/slope-hazard/README.md` bölüm 2'deki eşiklerle: **0 yeşil: eğim < 15°**, **1 sarı: 15° ≤ eğim ≤ 20°**, **2 kırmızı: eğim > 20°**, 255 veri yok. Hücre dağılımı: yeşil %79,8, sarı %7,3, kırmızı %12,9.
- **Bu bir proje önerisidir.** Eşikler NASA'nın sabit bir renk standardı değil, `data/slope-hazard/README.md`'deki proje tasarım önerisidir. O belgedeki "> 25° aşırı kritik" ayrımı ayrı bir sınıf olarak **kodlanmadı** (kırmızı içinde). Sınıf sadece eğime bakar: gevşek kum, kaya yüzeyi ve basamaklar hesaba katılmadı.

## Bilinen sınırlar

- ~8 m ızgara, yerel 1 m ayrıntı kaybolmuştur. DTM'ler arası yatay kayma ve dikey fark yukarıda.
- Yükseklikler tam metreye yuvarlandı. Ölçüm hatası (HiRISE DTM dikey hassasiyeti) bu çalışmada incelenmedi.
- DTM'lerin kapsamadığı yerler nodata. `dtm_priority.md`'deki 27 DTM'in sadece 5'i kullanıldı.
