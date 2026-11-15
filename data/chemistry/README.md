# ChemCam ve APXS Kaya Kimyası Verileri (Curiosity / MSL)

Gale Krateri / Sharp Dağı rota planında **bilimsel durak noktalarını (science waypoints)**, su ile etkileşmiş kayaçları, mineralojik değişimleri ve olası kaynak/tehlike işaretlerini haritaya işlemek için **Curiosity (Mars Science Laboratory)** ChemCam ve APXS veri setlerinin değerlendirmesi.

---

## 1. Nedir? (Her Cihaz Neyi Ölçüyor?)

- **ChemCam (LIBS — Laser-Induced Breakdown Spectroscopy):**
  Rover direği üzerindeki lazerle kayaya/toprağa uzaktan atış yapıp oluşan plazmanın ışığını analiz ederek noktasal element bileşimini ölçer.
  - **MOC (Multivariate Prediction of Oxide Composition) özet tabloları** **9 ana oksidi** ağırlık yüzdesi (`wt%`) olarak verir: `SiO2`, `TiO2`, `Al2O3`, `FeOT`, `MgO`, `CaO`, `Na2O`, `K2O`, `MnO` (ayrıca `Sum of Oxides`, lazer mesafesi `Distance (m)`, atış standart sapması ve RMSEP belirsizlikleri).
  - **Diyajenez ek paketi** (`urn:nasa:pds:msl_gt_diagenesis_supplement`) damar, nodül ve tabakalı kaya hedefleri için ek olarak `Cr`, `Li`, `Rb`, `Sr`, `B` iz elementleri ve diyajenetik sınıf bilgisini içerir.
- **APXS (Alpha Particle X-Ray Spectrometer):**
  Robotik kol ucundaki sensörle kaya/toprak yüzeyine temas ederek veya birkaç cm yakından alfa parçacıkları + X-ışını floresansı ile yüksek hassasiyetli toplu (bulk) element kimyası ölçer.
  - **16 oksit/element** verir: `Na2O`, `MgO`, `Al2O3`, `SiO2`, `P2O5`, `SO3`, `Cl`, `K2O`, `CaO`, `TiO2`, `Cr2O3`, `MnO`, `FeO` (`wt%`) ve iz elementler `Ni`, `Zn`, `Br` (`ppm`) + ölçüm hataları.

---

## 2. Astronota Ne Söyler? (Rota Planında Ne İşe Yarar?)

- **Bilimsel öncelikli durak seçimi:** Sıradan bazaltik zemin ile kimyasal olarak farklılaşmış kayaçları (yüksek silika `SiO2`, yüksek sülfat `SO3`, yüksek `CaO` içeren damarlar, yüksek `MnO`/`FeO` veya alkalin bileşimler) haritada işaretleyerek astronotun durup örnek alacağı noktaları önceliklendirir.
- **Su ve alterasyon izleri:** `CaO`–`SO3` zengin damarlar (ör. jips/kalsiyum sülfat) ve kil/silika değişim zonları geçmişte sıvı su varlığını gösterir; astronotlar için hem bilimsel açıdan en değerli hem de kaynak/mineral potansiyeli yüksek hedeflerdir.
- **Yüzey/toz ve olası tehlike/ISRU bağlamı:** `Cl`, `SO3`, `Br` oranları tuz ve perkolat/okside tuz ortamlarına işaret eder; APXS'te fırçalanmış (`DRT`) vs. tozlu hedef ayrımı yüzey toz örtüsünü de anlamayı sağlar.
- **İki cihaz birbirini tamamlar:** ChemCam küçük damar/nodül gibi mikro yapıları ve erişilemeyen dik yüzeyleri uzaktan tarar; APXS ise rover kolunun değebildiği yüzeyde daha yüksek doğruluklu referans kimya verir.

---

## 3. Sınırı Nedir? (Tarih/Sol Aralığı, Ölçüm Sayısı, Kapsam)

- **Mekânsal kapsam:** Yalnızca Curiosity rover güzergâhı boyunca örneklenen noktalarla sınırlıdır (Bradbury Landing / Aeolis Palus → Sharp Dağı alt yamaçları). Tüm Gale Krateri'ni kaplayan sürekli bir harita vermez; yalnızca rota üzerindeki noktasal ölçümlerdir.
- **ChemCam (LIBS RDR / MOC):**
  - **Tarih / Sol aralığı:** `2012-08-06` – `2026-03-22` (**Sol `10` – `4843`**; `data/` altında `3.274` sol klasörü).
  - **Ölçüm sayısı:** 42 adet `moc_*.csv` dosyasında toplam **`31.175` ölçüm satırı** (lazer gözlem noktası) ve **`4.328` benzersiz hedef (`Target`) adı** *(üzerinde rover kalibrasyon hedefleri de bulunur, haritalamadan önce filtrelenmelidir)*. `index/libsindex.tab` içinde tüm dosya türleriyle `121.298` kayıt yer alır.
- **APXS:**
  - **Ana RDR arşivi (`mslapx_1xxx`):** `2012-09-22` – `2026-03-21` (**Sol `46` – `4842`**); `index/index.tab` içinde **`3.214` adet `APXS_RWP`** (oksit/element ağırlık yüzdesi) ve `3.213` adet `APXS_RSP` (spektrum) ölçümü.
  - **Birleştirilmiş Jeokimya Ek Paketleri (JGR Supplements):**
    - Sol `46` – `3076`: **`1.028` ölçüm**
    - Sol `3054` – `3712`: **`290` ölçüm** *(Sol `3054`–`3076` aralığı iki dosyada ortaktır, birleştirilirken tekilleştirilmelidir).*
    - Sol `3713` – `4842` arası APXS ölçümleri henüz bu toplu ek pakete eklenmemiştir; yalnızca `mslapx_1xxx/data/` altında sol bazlı ayrı `*rwp*.csv` dosyaları olarak bulunur.
- **Ölçüm kısıtları:**
  - ChemCam lazer noktası milimetre altı çaptadır; heterojen kayalarda tek bir nokta bütün kayayı temsil etmez (`Target` bazında noktaların ortalamasını veya her noktanın ayrı değerini göstermek gerekir) ve hedef kaya rover konumundan `Distance (m)` sütunundaki mesafe (tipik olarak birkaç metre) kadar uzaktadır.
  - APXS'te fırçalanmamış (`undisturbed`/tozlu) hedefler gerçek kaya yerine yüzey tozunu yansıtabilir (`Preparation_method` sütununa dikkat edilmelidir).
  - PDS yayın döngüsü nedeniyle Mart 2026 sonrası son aylar henüz arşivde yoktur.

---

## 4. Ölçüm Noktalarının Konumu (En Kritik Madde)

Veri setleri koordinat varlığı açısından ikiye ayrılır:

1. **APXS Birleştirilmiş Ek Paketlerinde (Sol 46 – 3712): DOĞRUDAN KOORDİNAT VAR**
   - `ds01_2021je007171r.csv` ve `ds01_2024.csv` dosyalarının içinde doğrudan **`Northing_m` / `Northing`**, **`Easting_m` / `Easting`**, **`Elevation_m` / `Elevation`** (metre) ve **`Sol`** sütunları bulunur.
   - Bu koordinatlar `data/curiosity-traverse/README.md` içinde tanımlanan Equirectangular projeksiyonla (`R = 3396.19 km`) uyumludur; ek bir konum eşleştirmesi yapmadan doğrudan haritaya işlenebilir.
   - *Küçük teknik not:* `ds01_2024.xml` şema açıklamasında `Easting_m` alanı yanlışlıkla `"Target Longitude (Degrees)"` etiketiyle yazılmıştır; ancak CSV içindeki gerçek değerler metre cinsinden `Easting` koordinatıdır (ör. `8145086.98`).

2. **ChemCam MOC/RDR (Sol 10 – 4843) ve Ham APXS RDR (Sol 46 – 4842): DOĞRUDAN LAT/LON YOK — ROVER `SITE/DRIVE` İLE HARİTAYA KOYULABİLİR**
   - `moc_*.csv` dosyalarında, `libsindex.tab`'da ve ham `*rwp*.csv` dosyalarında doğrudan enlem/boylam (`lat/lon`) veya `Northing/Easting` sütunu **yoktur**.
   - **Ancak her ölçümde konum anahtarı vardır:**
     - `Sol` ve `Spacecraft Clock (SCLK)`
     - **Rover Hareket Sayacı (`SITE` ve `DRIVE`)** — örneğin ChemCam dosya adı `CL5_827419445CCS_F1210762CCAM03842P3.CSV` ve yanındaki `.xml` dosyası `SITE = 121`, `DRIVE = 0762` içerir; APXS dosya adı `APB_827365543RWP48421210762_______P1.CSV` ise `Sol = 4842`, `SITE = 121`, `DRIVE = 0762` kodlar.
   - **Çözüm:** [Curiosity Rota Verisi](../curiosity-traverse/README.md) içindeki `localized_interp.csv` (`msl_places`, Sol `0`–`4868`, Site `1`–`121`) tablosuyla `(site, drive)` (veya `sol`) üzerinden `JOIN` yapıldığında **tüm ChemCam (Sol 4843'e kadar) ve tüm APXS (Sol 4842'ye kadar) ölçümleri koordinatlı hale getirilebilir**. *(ChemCam için bulunan nokta rover'ın durduğu koordinattır; hedef kaya bundan `Distance (m)` kadar uzaktadır.)*
   - *(Ek not: ChemCam Diyajenez ek paketinde `Sol` ve `Elevation (m)` vardır, `lat/lon` yoktur; `Target` + `Sol` ile aynı eşleştirme yapılabilir.)*

---

## 5. Format, Doğrudan İndirme Linkleri ve Yaklaşık Boyutlar

| Veri Seti | Kapsam | Format | Boyut / Ölçüm Sayısı | Doğrudan İndirme Linki |
|---|---|---|---|---|
| **APXS Toplu Tablo (JGR 2022)** *(koordinatlı)* | Sol 46–3076 | CSV | **~300 KB** (`306.318` B), `1.028` satır | `https://pds-geosciences.wustl.edu/msl/urn-nasa-pds-msl_apxs_supplement_sols_0_3076/data/ds01_2021je007171r.csv` |
| **APXS Toplu Tablo (JGR 2024)** *(koordinatlı)* | Sol 3054–3712 | CSV | **~95 KB** (`96.899` B), `290` satır | `https://pds-geosciences.wustl.edu/msl/urn-nasa-pds-msl_apxs_supplement_sols_3054_3712/data/ds01_2024.csv` |
| **APXS RDR İndeks** | Sol 46–4842 | ASCII Tablo | **~1,73 MB** (`1.818.841` B), `6.427` satır (`3.214` RWP) | `https://pds-geosciences.wustl.edu/msl/msl-m-apxs-4_5-rdr-v1/mslapx_1xxx/index/index.tab` |
| **APXS RDR Sol Klasörleri** (`*rwp*.csv`) | Sol 46–4842 | Sol başına ayrı CSV | Toplu zip yok (`data/` altında `1.334` klasör/öğe) | `https://pds-geosciences.wustl.edu/msl/msl-m-apxs-4_5-rdr-v1/mslapx_1xxx/data/` |
| **ChemCam MOC Oksit Tabloları** | Sol 10–4843 | 42 adet CSV (`moc_0000_0089.csv` .. `moc_4710_4843.csv`) | **Toplam ~7,32 MB** (`7.675.978` B), `31.175` ölçüm satırı | `https://pds-geosciences.wustl.edu/msl/msl-m-chemcam-libs-4_5-rdr-v1/mslccm_1xxx/data/moc/` |
| **ChemCam RDR İndeks** | Sol 10–4843 | ASCII Tablo | **~30,4 MB** (`31.901.374` B), `121.298` kayıt | `https://pds-geosciences.wustl.edu/msl/msl-m-chemcam-libs-4_5-rdr-v1/mslccm_1xxx/index/libsindex.tab` |
| **ChemCam Diyajenez Ek Paketi** | Seçili diyajenetik hedefler | CSV (`veins.csv`, `nodules.csv` vb.) | `veins.csv`: **~220 KB** (`225.440` B); `nodule_rich_bedrock.csv`: **~650 KB** | `https://pds-geosciences.wustl.edu/msl/urn-nasa-pds-msl_gt_diagenesis_supplement/data/` |

> **Toplam harita indirmesi:** Harita prototipi için gereken **2 APXS koordinatlı CSV + 42 ChemCam MOC CSV** setinin tamamı yalnızca **~7,7 MB** tutar (üzerine sol `3713`–`4842` APXS eklenmek istenirse `index.tab` üzerinden ilgili `*rwp*.csv` dosyaları çekilebilir).

---

## 6. Kaynak Linkleri ve Bulunamayanlar

### Kaynak Linkleri
- **NASA PDS Geosciences Node — MSL Ana Sayfası:** `https://pds-geosciences.wustl.edu/missions/msl/`
- **PDS ChemCam Arşiv Sayfası:** `https://pds-geosciences.wustl.edu/missions/msl/chemcam.htm`
- **PDS APXS Arşiv Sayfası:** `https://pds-geosciences.wustl.edu/missions/msl/apxs.htm`
- **ChemCam LIBS RDR Paketi (`10.17189/cwjs-nt23`):** `https://pds-geosciences.wustl.edu/msl/msl-m-chemcam-libs-4_5-rdr-v1/mslccm_1xxx/`
- **APXS RDR Paketi (`10.17189/rrmc-dg75`):** `https://pds-geosciences.wustl.edu/msl/msl-m-apxs-4_5-rdr-v1/mslapx_1xxx/`
- **APXS Ek Paketi (Sol 0–3076):** `https://pds-geosciences.wustl.edu/msl/urn-nasa-pds-msl_apxs_supplement_sols_0_3076/`
- **APXS Ek Paketi (Sol 3054–3712):** `https://pds-geosciences.wustl.edu/msl/urn-nasa-pds-msl_apxs_supplement_sols_3054_3712/`

### Bulunamayan / Mevcut Olmayanlar (Açık Not)
- **ChemCam için tüm solları içeren ve doğrudan `lat/lon` barındıran tek bir hazır CSV bulunmamaktadır.** Resmi MOC oksit verisi 90-solluk 42 ayrı CSV'ye bölünmüştür ve `localized_interp.csv` (`SITE/DRIVE`) ile eşleştirme gerektirir.
- **APXS için Sol `3713`–`4842` dönemini kapsayan koordinatlı tek bir JGR ek CSV dosyası bulunmamaktadır** (en güncel koordinatlı ek dosya Sol `3712`'ye kadardır; sonrası ham `*rwp*.csv` + `localized_interp.csv` eşleştirmesiyle alınabilir).
- **Ham tüm RDR spektrum arşivlerinin (`data/solXXXXX/`) tek parça sıkıştırılmış zip boyutu** PDS dizin sayfasında yazmamaktadır ve binlerce küçük sol dosyası olduğu için toplam ham spektrum arşivi boyutu ölçülmemiştir; harita için gerekli özet CSV boyutları yukarıda kesin olarak doğrulanmıştır.

---

## 7. Repoya Eklenen Dosyalar (2026-11-14)

### Ham dosyalar (`raw/`)

Bölüm 5'teki linklerden **değiştirilmeden** indirildi:
- **APXS:** `ds01_2021je007171r.csv` (306.318 B) ve `ds01_2024.csv` (96.899 B). Boyutları bölüm 5'teki değerlerle birebir aynı.
- **ChemCam:** 42 adet `moc_*.csv`, toplam 7.675.978 B. Bu toplam da bölüm 5'teki değerle birebir aynı.

`libsindex.tab` (~30 MB) repoya **eklenmedi**.

### `chemcam_moc_all.csv` (~8,9 MB)

- **Nasıl birleştirildi:** 42 MOC dosyası tek tabloda toplandı. Her dosyanın ilk 7 satırı atlandı: 6 satırlık "Testset Quartiles" istatistik bloğu ve sütun başlığı (başlık tabloda bir kez yazıldı). 42 dosyanın sütun başlığı birebir aynı.
- **Satır sayısı:** **31.175**. Bölüm 3'teki 31.175 ile aynı, fark yok. Benzersiz `Target` sayısı **4.328**, bu da bölüm 3'teki değerle aynı.
- **Eklenen sütunlar:** Orijinal sütunların önüne şunlar eklendi: `moc_file`, `sol_from_sclk`, `sclk`, `site`, `drive`, `is_calibration_target`.
- **SITE/DRIVE kaynağı:** MOC tablosunda SITE/DRIVE *sütunu* yok. Bu değerler, `File` sütunundaki PDS ürün adından okundu. Ad yapısı `CL5_<SCLK 9 hane>CCS_F<SITE 3 hane><DRIVE 4 hane>CCAM…` şeklinde. Bu kodlama bir örnekle doğrulandı: `sol00013/cl5_398645626ccs_f0030004ccam02013p3.lbl` etiketinde `ROVER_MOTION_COUNTER = (3,4,…)` yani SITE 3, DRIVE 4, ve `PLANET_DAY_NUMBER = 13` yazıyor. 31.175 dosya adının hepsi bu kalıba uyuyor.
- **`sol_from_sclk` sütunu:** MOC tablosunda sol sütunu yok. Bu değer SCLK'den hesaplandı: `floor((SCLK − 397.450.130) / 88.775,244)`. Sabit, `localized_interp.csv` içindeki SCLK ve sol çiftlerinden çıkarıldı. Bu değer, farklı yıllardan seçilen **9 PDS etiketindeki** `PLANET_DAY_NUMBER` ile karşılaştırıldı (sol 13, 90, 762, 1685, 2359, 3199, 4126, 4389, 4816) ve hepsinde aynı çıktı. Sabit yaklaşık 0,7 sollük bir aralıkta belirlendiği için teorik olarak yerel gece yarısına yakın ölçümlerde ±1 sol sapma olabilir, ama böyle bir örnek bulunmadı. Kesin sol gerekirse ilgili PDS etiketindeki `PLANET_DAY_NUMBER` değerine bakılmalıdır.
- **MOC dosya adındaki sol aralığı ile `sol_from_sclk` farklı olabilir:** Örneğin "Portage" hedefinin 9 satırı `moc_0000_0089.csv` içinde ama ölçüm sol **90**'da yapıldı (etiket: `PLANET_DAY_NUMBER = 90`, site 5, drive 104). `sol_from_sclk` değeri dosya aralığının dışına düşen satır sayısı tam 9 ve hepsi bu hedefe ait. Dosyaların neye göre gruplandığı **belirlenmedi** (ürün adındaki sayı da bunu tutarlı biçimde açıklamıyor). Bu yüzden `sol_from_sclk` sütunu kullanılmalı, dosya adı değil.

### Kalibrasyon hedefleri

`is_calibration_target = 1` olan **378 satır** var. Hiçbiri silinmedi. İşaretleme iki koşulun ikisi de sağlanınca yapıldı:
1. **Hedef adı:** Ad şunlardan biriyle başlıyor: `Shergottite`, `Norite`, `Picrite`, `Macusanite`, `NAu-2_*`, `Kga-d_Med-S`, `Graphite`, `Cal_Target*`.
2. **Lazer mesafesi:** `Distance (m)` değeri 1,50 ile 1,65 m arasında. İşaretlenen satırların gerçek mesafesi 1,570–1,604 m. Bu, rover güvertesindeki kalibrasyon tablasına olan mesafe. Başka hiçbir hedef bu mesafe aralığında değil.

Bulunan adlar: Cal_Target, Cal_Target_10_9_8_7, Cal_Target_1_Zstack, Cal_Target_6_Kaolinite_95A, Graphite, Kga-d_Med-S, Macusanite, NAu-2_Hi-S, NAu-2_Low-S, NAu-2_Med-S, Norite, Picrite, Shergottite.

Not: Ad listesi dosyadaki adlardan ve mesafe kontrolünden çıkarıldı. PDS'te resmi bir "kalibrasyon hedefi listesi" ile karşılaştırılmadı (**doğrulanmadı**).

### `chemcam_points.csv` (~6,1 MB)

Her MOC satırına rover konumu eklendi. Sütunlar şunlar:
- **Kimlik ve konum:** `sol_from_sclk`, `site`, `drive`, `target`, `is_calibration_target`, `rover_lat`, `rover_lon`, `rover_elevation_m`, `location_match`, `matched_site_drive`, `distance_m`
- **Kimya:** 9 oksit (wt%) ve `sum_of_oxides`
- **Kaynak:** `file`, `moc_file`

**Birleştirme yöntemi:** `(site, drive)` ikilisi üzerinden `../curiosity-traverse/localized_interp.csv` dosyasındaki `frame = ROVER` satırlarıyla **tam eşleştirme** yapıldı. Bir `(site, drive)` için birden fazla pose varsa dosyadaki **son** satır (o sürüşün son duruşu) alındı. Yedek yöntem de vardı: aynı site içinde bir önceki drive alınacaktı ve `location_match = site_prev_drive` olarak işaretlenecekti. Ama buna hiç gerek kalmadı.

**Sonuç:**

| `location_match` | Satır |
|---|---|
| `site_drive` (tam eşleşme) | **31.175** |
| `site_prev_drive` (yaklaşık) | 0 |
| konum alamayan | **0** |

> **Önemli:** `rover_lat` / `rover_lon`, ChemCam ölçümü yapılırken **rover'ın durduğu noktadır, hedef kayanın yeri değildir.** Hedef, rover'dan `distance_m` kadar uzakta. Kalibrasyon dışı 30.797 satırda bu mesafenin ortancası 2,69 m. Satırların 5.–95. yüzdelik aralığı 2,29–3,96 m, en uzak değer 7,45 m. Hedefin rover'a göre yönü bu tabloda yok. Kalibrasyon hedefleri rover'ın kendi üzerinde olduğu için onların konumu rover konumuyla aynıdır.

### `apxs_all.csv` (~0,47 MB)

**Satır sayısı:** 1.028 (2021 dosyası) + 290 (2024 dosyası) − 12 (çakışan) = **1.306 satır**, Sol 46 – 3712. Dosyada **59 sütun** var: 56 veri sütunu ve başa eklenen `source_file`, `lat_from_northing`, `lon_from_easting`. `source_file` her satırın hangi dosyadan geldiğini gösterir.

**Sütun eşleştirme.** İki dosyanın sütun adları farklı. PDS4 etiketlerindeki (`.xml`) açıklamalara bakılarak yalnızca **anlamı ve birimi aynı olanlar** birleştirildi:
- **Sadece ad farkı olanlar:** `sol→Sol`, `Northing→Northing_m`, `Easting→Easting_m`, `Elevation→Elevation_m`, `Start Time→Start_Time`, `Preparation method→Preparation_method`, `Fit Type→Fit_Type`, `SH Temp→SH_Temp_C`, `FWHM→FWHM_FeKa_eV`, `Strat_group→Strat_group_formal`, `Strat_formation→Strat_fm`, `Strat_member→Strat_mbr`.
- **`Offset_cm`:** 2024 dosyasındaki `Standoff_distance` sütunuyla (etikette `Standoff Distance`) **aynı büyüklük**: iki etiket de "APXS temas sensörü ile hedef yüzey arasındaki tahmini mesafe (cm)" diyor ve 12 çakışan ölçümün hepsinde değerler aynı. Bu yüzden tek sütunda birleştirildi.
- **`Lifetime_s`** (saniye): İki dosyada **farklı birimlerde**. 2021 dosyasında ölçüm süresi bir günün kesri (örneğin `0,013194444`), 2024 dosyasında saniye (`1139,999962`). 12 çakışan ölçümün hepsinde 2021 değeri × 86.400 = 2024 değeri çıktı. Tek sütun için 2021 değerleri ×86.400 ile saniyeye çevrilip tam saniyeye yuvarlandı (sapma en fazla ~0,00004 sn), 2024 değerleri de tam saniyeye yuvarlandı. Orijinal `Lifetime_h:mm:ss` ve `Lifetime` sütunları dosyada **yok**; ham değerler `raw/` altında duruyor. (2021 etiketi bu sütun için "HH:MM:SS" yazıyor, ama CSV'deki değerler gün kesri.)
- **Sadece 2021'de olanlar:** `Ca-S_notes`, `Duplicate_measurement`. **Sadece 2024'te olanlar:** `Note`, `Diagenetic_observations`.

**Tekilleştirme.** Sol 3054–3076 aralığında iki dosyada da **12'şer** satır var. `(Sol, Target, Start_Time)` anahtarıyla 12'si de aynı ölçüm. Oksitler, konum, yükseklik, `Offset_cm` ve ölçüm süresi aynı. Ama **her sütun aynı değil**: bu 12 satırda stratigrafik bilgi farklı (2021: `Strat_mbr = Glasgow`, bölge adı `Glen_Torridon`; 2024: `Strat_mbr = Mercou`, bölge adı `Clay-Sulfate-Transition`). 2021 satırı tutuldu, 2024 kopyaları çıkarıldı. Bilgi kaybolmasın diye:
- 2024'teki `Note` (12 satırın hepsi) ve `Diagenetic_observations` (4 satır) 2021 satırına **taşındı**.
- 2024'teki farklı stratigrafik değerler `overlap_2024_strat` sütununa yazıldı (örneğin `Strat_mbr=Mercou; waypoint=Clay-Sulfate-Transition`). Hangisinin doğru olduğu bu çalışmada **değerlendirilmedi**.

**Kodlama düzeltmesi.** 2021 ham dosyasında bir satırda (Sol 1242, `Gobabeb_DumpC_corrected`, `Preparation_method`) tek bir Latin-1 `µ` baytı var (`Sieve150µm-1mm`). Çıktıda bu UTF-8 olarak yazıldı. Bunun dışında bütün değerler ham dosyalarla aynı.

**Yazım farkı.** İki dosyada stratigrafik adlar farklı yazılmış (2021: `Mt. Sharp`, 2024: `Mt._Sharp`). Orijinal `Strat_group_formal` sütunu **olduğu gibi** bırakıldı ve yanına alt çizgileri boşluğa çeviren `Strat_group_norm` sütunu eklendi (örneğin `Mt. Sharp` 978 satır). Gruplama için bu sütun kullanılmalı. `Strat_fm`, `Strat_mbr` ve bölge adı sütunları normalleştirilmedi.

**Sol ile Start_Time uyumsuzluğu.** `Start_Time` sütunu `SSSSSMhh:mm:ss` biçiminde sol bilgisi taşıyor (örneğin `01266M22:38:58`). `sol_minus_starttime_sol` sütunu `Sol − Start_Time'daki sol` farkını verir. **21 satırda** fark sıfır değil. 12 satırda farkın mutlak değeri 1 (hepsi −1; sebebi doğrulanmadı; bazı ölçümler gün ortasında, bu yüzden yalnızca gece yarısı etkisi değil). **Farkın mutlak değeri 2 veya daha büyük olan 9 satır** şunlar. İlk 5'i 2021 dosyasından, son 4'ü 2024 dosyasından geliyor:

| Sol | Hedef | `Start_Time` | Fark |
|---|---|---|---|
| 1202 | Gobabeb_Scuff_APXS | 01223M20:46:44 | −21 |
| 1273 | Stockdale_DRT | 01266M22:38:58 | 7 |
| 2631 | Staxigoe | 02606M10:37:44 | 25 |
| 2631 | Gretna_Green | 02608M18:05:47 | 23 |
| 2807 | Chambers_Street_DRT | 02801M20:20:09 | 6 |
| 3078 | Orliac | 03081M10:41:16 | −3 |
| 3491 | Pitinga_DRT | 03488M19:25:05 | 3 |
| 3493 | Parepona_DRT | 03491M19:29:42 | 2 |
| 3626 | Canaima_tailings | 03624M18:21:36 | 2 |

İlk 5 satırın `Northing/Easting` değerleri `localized_interp.csv` içindeki rover konumlarıyla karşılaştırıldı: konum, `Start_Time`'daki sol'den 1–2 sol önceki bir rover konumuna 0,01 m'den az uyuyor (rover bu sürede hareket etmemiş görünüyor), `Sol` sütununun gösterdiği sol'deki konumlara ise yaklaşık 56–83 m uzakta. Yani bu satırlarda **konum doğru görünüyor, `Sol` sütunu şüpheli**. Bu fark PDS kaynak dosyasında zaten var, birleştirmede oluşmadı. Sol'e göre süzme yapılacaksa bu satırlar dikkate alınmalı. Doğruluk bu çalışmada **PDS ile teyit edilmedi**.

**Enlem/boylam:** `lat_from_northing` ve `lon_from_easting` sütunları eklendi. Hesap: `derece = metre / 3.396.190 × 180/π`, yani merkezi 0°/0° olan equirectangular projeksiyonun tersi. Formül `localized_interp.csv` iniş noktasında doğrulandı: northing -272.039,268 m → -4,589467°, easting 8.146.811,223 m → 137,441633°. Bu değerler dosyadaki enlem/boylam ile birebir aynı. Dosyadaki koordinatlar etikette "hedef" diye geçiyor ama rover konumuyla çakışıyor (medyan fark 0,00 m).

**Kapsam dışı:** Sol 3713–4842 arası APXS ölçümleri bu tabloda **yok**, bkz. bölüm 3.

**Not (bölüm 4 için):** Bölüm 4'teki `Easting_m` etiket hatası `ds01_2024.xml` ile sınırlı değil. `ds01_2021je007171r.xml` içinde de `Easting_m` alanı "Target Longitude (Degrees)" diye tanımlanmış. İki dosyada da CSV'deki gerçek değerler metredir.
