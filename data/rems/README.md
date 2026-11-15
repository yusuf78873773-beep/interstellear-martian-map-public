# Curiosity REMS Hava İstasyonu Verisi (Rover Environmental Monitoring Station)

Gale Krateri'nde doğrudan yüzeyden alınan resmi meteoroloji ölçümleri. Uygulamada modellenmiş tahmin yerine gerçek yerinde ölçüm olduğu için **"Gözlem" (Observation)** rozetiyle gösterilmelidir.

---

## 1. NASA PDS Arşiv Linkleri (PDS Atmospheres Node)

- **REMS Ana Arşiv Sayfası (NMSU / PDS Atmospheres Node):**
  `https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html`
- **REMS Kalibre Edilmiş RDR Arşiv Kök Dizini (`MSLREM_1001`, Sürüm `42`, DOI: `10.17189/vwva-ms24`):**
  `https://atmos.nmsu.edu/PDS/data/mslrem_1001/`
- **PDS4 Bundle Metadatası ve Arşivi:**
  `https://atmos.nmsu.edu/PDS/data/mslrem_1001/bundle_msl_rems.xml` ve `https://atmos.nmsu.edu/PDS/data/PDS4/msl_rems_bundle/`
- **PDS Veri Seti Profili (`MSL-M-REMS-4-ENVRDR-V1.0`):**
  `https://pds.nasa.gov/ds-view/pds/viewProfile.jsp?dsid=MSL-M-REMS-4-ENVRDR-V1.0`

---

## 2. Kapsadığı Sol ve Tarih Aralığı

- **Kapsam:** **Sol `1` – Sol `4843`** (`6–7 Ağustos 2012` – **`22 Mart 2026`** arası; `DATA/` altında `SOL_00001_00089/` .. `SOL_04710_04843/` klasörleri).
- **Arşiv son güncelleme tarihi:** `31 Temmuz 2026` / `5 Ağustos 2026` (`VOLDESC.CAT` ve dizin tarihleri).
- **Ölçüm sıklığı:** `1 Hz` örnekleme hızıyla her saat başında 5 dakikalık düzenli bloklar + gün boyunca ek 60 dakikalık bloklar (`rems.html`).
- *(Küçük şeffaflık notu: `rems.html` üst başlık satırında eski metin olarak `Sol 04488 / March 22, 2025` görünse de aynı sayfadaki `Archive Volumes` bölümü ve sunucudaki `DATA/` dizini fiilen **Sol `1–4843`** dosyalarını içermektedir.)*

---

## 3. Ölçülen Değişkenler

REMS, 6 atmosferik/çevresel parametreyi ölçer:

1. **Hava Sıcaklığı (`Air Temperature`):** Mast üzerindeki 2 bomdan (`Boom 1`, `Boom 2`) ölçülen yerel hava sıcaklıkları ve rover ısıl etkisi düzeltilmiş ortam hava sıcaklığı tahmini (`Kelvin`) — `https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems_temperature.html`
2. **Zemin Parlaklık Sıcaklığı (`Ground Brightness Temperature`):** Kızılötesi termopil algılayıcı ile yüzey sıcaklığı (`Kelvin`, kısa ve uzun vadeli sistematik belirsizlik sütunlarıyla) — `https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems_temperature.html`
3. **Atmosfer Basıncı (`Pressure`):** Yüzey atmosfer basıncı (`Pascal` / `Pa`), sensör konfigürasyonu, mutlak doğruluk ve güven düzeyi — `https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems_pressure.html`
4. **Bağıl Nem (`Relative Humidity`):** Yerel bağıl nem (`%`), sensör çalışma sıcaklığı ve güven düzeyi — `https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems_humidity.html`
5. **Rüzgâr Hızı ve Yönü (`Wind Speed & Direction`):** Yatay ve düşey rüzgâr hızı ile kuzeye göre saat yönünde yönü *(aşağıdaki hasar kısıtına bakınız)* — `https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems_wind.html`
6. **Ultraviyole Radyasyon (`UV Flux`):** Üst güvertedeki UVS sensörüyle 6 bantta (`ABC: 200–380 nm`, `A: 320–380 nm`, `B: 280–320 nm`, `C: 200–280 nm`, `D: 230–290 nm`, `E: 300–350 nm`) UV akısı — `https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems_uv.html`

---

## 4. Dosya Formatı, Doğrudan İndirme Linkleri ve Boyutlar

- **Format:** Sabit genişlikli / sütunlu ASCII tablolar (**`.TAB`**), yanlarında PDS3 (**`.LBL`**) ve PDS4 (**`.xml`**) şema dosyaları (`collection` envanteri **`.csv`**).
- **Veri seviyeleri (her sol klasöründe `4` ana `.TAB` ürünü):**
  - `RMD` (**`MODRDR`**): En yüksek işlenmiş seviye — rover etkisi vb. etkenler için düzeltilmiş fiziksel birimler (**uygulama için önerilen ana tablo**).
  - `RNV` (`ENVRDR`): Ham dönüşümle fiziksel birimlere çevrilmiş çevresel veriler.
  - `RTL` (`TELRDR`): Elektriksel / ısıl mühendislik birimleri.
  - `ADR`: Yardımcı işleme verileri.
  - Ayrıca `DATA_UV_CORRECTED/` (`UVRDR`) klasöründe toz birikimi ve düşük güneş zenit açısı düzeltmesi uygulanmış toplu UV tabloları vardır.

| Dosya / Klasör | Açıklama | Doğrudan İndirme Linki | Doğrulanmış Boyut |
|---|---|---|---|
| **Ana İndeks (`INDEX.TAB`)** | Sol 1–4843 tüm dosya kataloğu | `https://atmos.nmsu.edu/PDS/data/mslrem_1001/INDEX/INDEX.TAB` | **`7,02 MiB`** (`7,36 MB` / `7.363.092` B) |
| **PDS4 Envanter (`.csv`)** | Kalibre veri ürün listesi | `https://atmos.nmsu.edu/PDS/data/mslrem_1001/DATA/collection_mslrems_data_calibrated_inventory.csv` | **`1,49 MiB`** (`1,56 MB` / `1.561.396` B) |
| **UV İndeksi (`UV_INDEX.TAB`)** | Düzeltilmiş UV dosya listesi | `https://atmos.nmsu.edu/PDS/data/mslrem_1001/INDEX/UV_INDEX.TAB` | **`9,5 KiB`** (`9.765` B) |
| **Sol Klasörleri (`DATA/`)** | Sol `1`–`4843` per-sol tabloları | `https://atmos.nmsu.edu/PDS/data/mslrem_1001/DATA/` | Örnek tek sol (`SOL04843`): `RMD ~8,1 MB`, `RNV ~14 MB`, `RTL ~18 MB`, `ADR ~3,3 MB` |
| **Örnek Güncel Sol (`SOL04843`)** | En güncel sol dosyaları | `https://atmos.nmsu.edu/PDS/data/mslrem_1001/DATA/SOL_04710_04843/SOL04843/` | Toplam ~`43,4 MB` (`RMD + RNV + RTL + ADR`) |
| **Toz Düzeltmeli UV (`DATA_UV_CORRECTED/`)** | 100 solluk `REMS_UVS_*.TAB` | `https://atmos.nmsu.edu/PDS/data/mslrem_1001/DATA_UV_CORRECTED/` | Her 100-sol dosya ~`872 MB – 1,5 GB` *(ilk 5 dosya doğrulandı; tamamının toplam boyutu tek tek toplanmadı — doğrulanmadı)* |

*(Not: Tüm `DATA/` klasöründeki `4.843` solun sıkıştırılmış tek bir toplu zip arşivi sunucuda yoktur ve toplam GB boyutu tek tek toplanmamıştır — doğrulanmadı. Uygulama prototipi için `INDEX.TAB` üzerinden seçili solların yalnızca `RMD` dosyaları ~`8 MB`/sol boyutla çekilebilir.)*

---

## 5. Bilinen Kısıtlar

1. **Rüzgâr Sensörü Hasarı (En Kritik Kısıt):**
   - Curiosity iniş sırasında (`Ağustos 2012`) Sky Crane roketlerinin kaldırdığı çakıllar `Boom 1` üzerindeki rüzgâr sensörü kartlarına (`board 2 ve 3`) çarparak hasar vermiştir.
   - PDS `rems_wind.html` sayfasına göre üst seviye `MODRDR` (`RMD`) dosyalarında tam işlenmiş rüzgâr hızı/yönü **"not available"** olarak işaretlidir; yalnızca kısmi `TEL`/`ENV` kayıtları mevcuttur (`https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems_wind.html`).
   - Kalan `Boom 2` sensörü de kum/toz aşındırması sonucu **Sol `1491`** civarında tamamen devre dışı kalmıştır; bu nedenle Sol `1491` sonrası için doğrudan çalışan REMS rüzgâr ölçümü yoktur (`https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems_wind.html`).
2. **Bağıl Nem Sensörü Gecikmesi ve Kapsamı:**
   - `MODRDR` dosyaları gerçek serbest atmosfer bağıl nemini değil, sensör içindeki **yerel bağıl nemi** ve sensör sıcaklığını verir; belirsizlik sütunları yer almaz ve düşük sıcaklıklarda **5 dakikaya kadar tepki gecikmesi (time lag)** oluşabilir (`https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems_humidity.html`).
3. **UV Sensörü Toz Birikimi:**
   - Sensör üzerindeki tozlanma ve güneş zenit açısının `< 55°` olduğu durumlardaki kalibrasyon sapması nedeniyle `MODRDR` UV verisi yerine alternatif kalibrasyonlu `DATA_UV_CORRECTED/` (`UVRDR`) dosyaları tercih edilmelidir (`https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html` ve `rems_uv.html`).
4. **Rover Isıl Etkisi ve Geçerlilik:**
   - Rover gövdesindeki nükleer güç kaynağı (MMRTG) yerel sıcaklığı etkileyebilir; bu yüzden ham boma değil `MODRDR` içindeki modellenmiş **ortam hava sıcaklığı (`ambient air temperature`)** ile güven düzeyi (`Confidence Level`) sütunlarına bakılmalıdır (`rems_temperature.html`).
   - Ölçümler Curiosity ile birlikte Gale Krateri tabanından Sharp Dağı yamaçlarına hareket eder (sabit bir istasyon değildir); yine de **Gale Krateri için doğrudan geçerli tek gerçek yüzey meteoroloji gözlemidir**.

---

## Repoya eklenen günlük özet (2026-11-14)

`rems_daily.csv`: **123 sol**, ~27 KB. Sol'ler `data/curiosity-rad/rad_daily_dose.csv` içindeki 124 sol'ün aynısı, **sol 3588 hariç**: o sol'ün klasöründe RMD dosyası bulunamadı (sebebi incelenmedi). Her satır, o sol'ün tek `RMD` (`MODRDR`) ürününün özetidir. Ham `.TAB` dosyaları (sol başına 4–20 MB, toplam yaklaşık 1,4 GB) işlendikten sonra silindi, repoya konmadı. Tarih sütunu yok: sol numarası ile `rad_daily_dose.csv` ile eşleştirilebilir.

### Hangi sütunlar, hangi birim

`MODRDR6.FMT` yapı dosyasına göre ilgili sütunlar ve birimler:

| CSV sütunları | `RMD` sütunu | Birim |
|---|---|---|
| `air_temp_*_K` / `_C` | `AMBIENT_TEMP` (ortam hava sıcaklığı tahmini) | Kelvin, ve `°C = K − 273,15` |
| `ground_temp_*_K` / `_C` | `BRIGHTNESS_TEMP` (zemin parlaklık sıcaklığı) | Kelvin ve °C |
| `pressure_*_Pa` | `PRESSURE` | Pascal |
| `rh_local_*_pct` | `LOCAL_RELATIVE_HUMIDITY` | % |
| `uv_abc_*_Wm2` | `UV_ABC` | W/m² |

Birimler K ve Pa olarak kaldı, °C sütunları ek. Her değişken için o sol'deki geçerli örneklerin **ortalaması, en düşüğü ve en yükseği** yazıldı. `n_air`, `n_ground`, `n_pressure`, `n_rh`, `n_uv` geçerli örnek sayısını, `n_rows` dosyadaki satır sayısını verir. Eksik değer `-999` ve kodları dosyada böyle işaretli, bu değerler dışarıda bırakıldı. Ortalamalar basit ortalamadır, zamana göre ağırlıklandırılmadı.

### Rüzgâr neden yok

Yukarıdaki "Bilinen Kısıtlar" bölümüne göre `RMD` dosyalarında rüzgâr "not available" olarak işaretli. Veride de bunu gördüm: 123 sol'ün **sadece 38'inde** toplam 1.235 rüzgâr değeri var (milyonlarca satırda), sol başına en çok 100. Bu kadar kısmi ve güvenilmez olduğu için rüzgâr özeti CSV'ye **konmadı**. Sadece kaç değer olduğu `n_wind_h_values` sütununda yazılı.

### Bilinen sınırlar

- **Güven düzeyi uygulanmadı:** Ürünlerdeki güven düzeyi sütunları (örneğin `GTS_CONFIDENCE_LEVEL`, `PS_CONFIDENCE_LEVEL`) süzme için kullanılmadı, değerler olduğu gibi özetlendi.
- **Zemin sıcaklığı alt değerleri şüpheli:** `ground_temp_min_K` 38 sol'de **130 K'nin altında** (en düşüğü 85,4 K, sol 4680). Bu değerler gece ölçümlerinden geliyor olabilir, ama gerçekçi olmayacak kadar düşük. Kalibrasyon veya güven sorunu olabilir, **sebebi doğrulanmadı**. `ground_temp_min_*` sütunlarına güvenilmemeli. Ortalama ve en yüksek değerler için de ayrı bir doğrulama yapılmadı.
- **Nem:** Yukarıda yazdığı gibi `rh_local_*` serbest atmosferin değil sensörün yerel bağıl nemidir, düşük sıcaklıklarda gecikmeli tepki verir. Sol 1 için değerler sıfır.
- **UV:** `RMD` içindeki UV, toz birikimi düzeltilmemiş veridir (bu README'nin kısıt bölümü, toz düzeltmeli `DATA_UV_CORRECTED/` dosyalarını önerir). Bu dosyalar 100 solluk parçalar hâlinde ~0,9–1,5 GB olduğu için indirilmedi. Bu yüzden UV değerleri **sunumda yaklaşık/düzeltilmemiş** diye gösterilmeli. Sol 1'de UV değeri yok.
- **Örnekleme:** REMS her sol'de eşit aralıklı ölçüm yapmaz (saat başı 5 dakikalık bloklar ve ek bloklar), bu yüzden ortalama günün her saatini eşit temsil etmeyebilir.
- **Konum:** Ölçümler rover'ın o sol'deki yerine aittir, Gale'de sabit bir istasyonun ölçümü değildir.
- **Eski indeks:** `INDEX/INDEX.TAB` sol 4133'te bitiyor ve sol 4017, 4056, 4095 için eski dosya adlarını (`P1`) veriyor, bu dosyalar sunucuda yok. Sunucudaki güncel `P2` sürümleri kullanıldı. Sol 4134 ve sonrası için dosya adları doğrudan klasör listesinden alındı.
- **Veri seviyesi:** Sadece `RMD` kullanıldı. `RNV`, `RTL` ve `ADR` ürünleri indirilmedi.
