# Jeofizik Katman: MRO SHARAD Yüzey Altı Radarı ve Mars Gravite Verisi

Bu doküman, astronot yürüyüş (EVA) rotası ve bilimsel durak planlaması kapsamında **Gale Krateri / Sharp Dağı (*Aeolis Mons*) / Boxwork** bölgesi için jeofizik veri katmanlarını inceler. Birincil odak **MRO SHARAD** yüzey altı radarı, ikincil odak **MRO Radyo Bilimi küresel gravite modelleri** ve **Curiosity yüzey gravimetri (RIMU)** bulgularıdır.

---

## BÖLÜM A — MRO SHARAD (Shallow Radar) Yüzey Altı Radarı (Birincil)

### 1. Nedir? (Veri Neyi Gösteriyor?)
* **Cihaz ve Çalışma Prensibi:** İtalyan Uzay Ajansı (ASI) tarafından sağlanan ve NASA'nın *Mars Reconnaissance Orbiter* (MRO) uydusunda yer alan **SHARAD**, `20 MHz` merkez frekansında ve `10 MHz` bant genişliğinde (`15–25 MHz` doğrusal frekans modülasyonlu, `85 µs` süreli chirp darbeleri) çalışan yörüngesel bir yüzey altı sondaj radarıdır (`https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/catalog/sharadinst.cat`).
* **Ölçtüğü Büyüklük:** Radar dalgaları yüzeyden aşağı süzülürken kaya, tortul istif, regolit, boşluk ve su/$\text{CO}_2$ buzu katmanları arasındaki **dielektrik geçirgenlik ($\varepsilon_r$) farklarından** geri yansıyan sinyal gücünü (*radar backscatter power*) ölçer (`sharadinst.cat`, `aareadme.txt`).
* **Veri Yapısı (`Radargram`):** Ham telemetri Sentetik Açıklıklı Radar (SAR) odaklamasından geçirilerek **radargram (`RGRAM`)** adı verilen 2 boyutlu düşey kesitler üretilir. Yatay eksen uydunun yüzey izi (*ground track*) boyunca sütunları, düşey eksen ise radar sinyalinin gidiş-dönüş zaman gecikmesini (`round-trip delay time`, `0,0375 µs` örnekleme aralığıyla `3.600` satır) temsil eder (`https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/aareadme.txt` ve `catalog/radargram_ds.cat`).

### 2. Astronota Ne Söyler? (Rota Planında ve Bilimsel Durak Seçiminde Ne İşe Yarar?)
* **Yeraltı Su Buzu ve Kaynak (ISRU) Tespiti:** Yüzeyin altında (`~15–20 m`'den itibaren birkaç yüz metre derinliğe kadar) gömülü su buzu mercekleri veya buz-kaya karışımlı birimler varsa bunları kuru tortul/bazalt istiflerinden ayırmaya yardımcı olur (`sharadinst.cat`).
* **Yüzey Altı Tabaka Kalınlığı ve Yapısal Süreklilik:** Gale Krateri tabanı (*Aeolis Palus*) ile Sharp Dağı eteklerindeki tortul birimlerin derinlik boyunca sürekliliğini ve gözeneklilik / yoğunluk geçişlerini yorumlamada bölgesel jeolojik bağlam sunar.
* **Bilimsel Durak Zenginleştirme:** Astronotun Boxwork kuşağına yürüyüşünde gördüğü yüzey tabakalarının derinlere nasıl indiğini (kesit perspektifini) anlamak için kullanılır. *(Not: Kısıtlar nedeniyle yürüyüş güvenliği için anlık engel/çukur tespit aracı olarak kullanılamaz; bkz. Bölüm 3.)*

### 3. Sınırı Ne? (Çözünürlük, Kapsama ve Bilinen Kısıtlar)
* **Çözünürlük (`sharadinst.cat` & `radargram_ds.cat`):**
  * **Düşey (derinlik) çözünürlüğü:** Boş uzayda **`15 m`**, Mars yüzey altı malzemelerinde dielektrik sabitine göre **`~10–20 m`** düzeyindedir (`aareadme.txt`: birkaç on metreden yaygın kayaçlarda birkaç yüz metreye, düşük kayıplı kutup buzlarında ~`4 km`'ye kadar nüfuz). Dikey örnek aralığı `0,0375 µs`'dir (~`2x` aşırı örneklenmiş).
  * **İz boyunca (along-track) yatay çözünürlük:** SAR işleme sonrası **`300–1.000 m`**; ABD SHARAD (`USRDRV2`) ürünlerinde sütun aralığı sabit **`128 piksel/derece` (~`460 m`)**'dir.
  * **İze dik (cross-track) ayak izi genişliği:** Arazi pürüzlülüğüne bağlı olarak **`1.500–8.000 m`** (**`1,5–8 km`**).
* **Kapsama Yapısı ve Tarih Aralığı:**
  * **Sürekli harita DEĞİLDİR; iz (track) bazlıdır.** Yalnızca MRO yörüngesinin geçiş çizgileri boyunca ayrık kesitler vardır.
  * PDS arşivindeki **3B sürekli hacim ürünleri (`SHARAD 3D`, `mro_sharad_3d`) yalnızca Kuzey ve Güney kutup bölgelerini** (`Planum Boreum` `60,2°K–90°K` ve `Planum Australe` `-90°G..-59,8°G`) kapsar (`https://pds-geosciences.wustl.edu/missions/mro/sharad_3d_pds4.htm`). Ekvator ve Gale Krateri için 3B/2B sürekli SHARAD haritası yoktur.
  * **Arşiv güncelliği (`MRO Release 78`, Eylül 2026):** ABD SHARAD radargram (`mrosh_2101`, `37.699` ürün) ve Clutter Simülasyonu (`mro_sharad_simulations`, `37.700` ürün) arşivi **`6 Aralık 2006 – 9 Şubat 2026`**; İtalyan RDR/EDR arşivi (`MROSH_1001..1004`, `40.154` RDR) ise **`6 Aralık 2006 – 2 Şubat 2026`** dönemini kapsar (`https://pds-geosciences.wustl.edu/missions/mro/sharad.htm` ve Mars ODE `IIPT` sorgusu).
* **Bilinen Kritik Kısıtlar (Gale Krateri İçin Hayati):**
  1. **Yüzey Saçılması / Yan Yankı ("Surface Clutter"):** `radargram_ds.cat` belgesinde vurgulandığı üzere, `1,5–8 km`lik ize dik ayak izi içinde yer alan krater duvarları, sırtlar ve dik yamaçlardan gelen **yüzey** yansımaları aynı gidiş-dönüş gecikmesinde kesite düşer ve gerçek **yeraltı** katmanı gibi görünür. **Gale Krateri'nin yüksek çeperi ve `~5,5 km` yükselen Sharp Dağı'nın dik yamaçları çok yoğun surface clutter üretir.** Bu nedenle ham radargramdaki parlak hatları doğrudan yeraltı buzu sanmamak ve mutlaka **Clutter Simülasyonu (`SHSIMU`)** ürünleriyle kıyaslamak gerekir (`https://pds-geosciences.wustl.edu/mro/urn-nasa-pds-mro_sharad_simulations/`).
  2. **Ölçek Uyuşmazlığı (Astronot Yürüyüşü İçin Çok Kaba):** Bir radargram pikselinin yatayda `~460 m × 1,5–8 km` alanı bütünleştirmesi nedeniyle `10–50 m` genişliğindeki Boxwork sırtlarını veya sığ yürüyüş zeminindeki küçük çöküntü/mağara tehlikelerini çözemez.
  3. **İyonosfer ve Uydu Duruş Etkisi:** Gündüz geçişlerinde (`SZA < 100°`) iyonosfer sinyali zayıflatır ve faz kayması yaratır; uydu yatış açısı (*roll*), güneş paneli ve yüksek kazançlı anten konumu da geri saçılma genliğini etkiler (`radargram_ds.cat`).

### 4. Gale ve Sharp Dağı İçin Durum (Kaç İz Var, Ürün ID'leri, Hazır Harita Var mı?)
* **Hazır Harita Durumu:** Gale Krateri veya Sharp Dağı için hazırlanmış bir GeoTIFF/PNG yeraltı buz ya da derinlik haritası **yoktur**. Yalnızca **ham/işlenmiş 2B kesit radargramları (`*_rgram.img`, `*_tiff.tif`, `*_thm.jpg`)**, yörünge koordinat tabloları (`*_geom.tab`) ve Mars ODE'nin ürettiği **iz çizgisi (polyline) Shapefile/KML dosyaları** mevcuttur.
* **Bölgeden Geçen SHARAD İz Sayıları (`oderest.rsl.wustl.edu/live2/` API sorgusu ile doğrulandı):**
  * **Genel Gale Krateri (`lat -6.2°..-4.4°G, lon 136.8°..138.8°D`):** **`53` adet ABD SHARAD (`USRDRV2`)** izi ve **`57` adet İtalyan (`RDR`)** izi.
  * **Sharp Dağı Eteği / CTX Detay Kutusu (`lat -4.86°..-4.52°G, lon 137.27°..137.61°D`):** **`10` adet ABD SHARAD (`USRDRV2`)** izi, **`10` adet Clutter Simülasyonu (`SHSIMU`)** izi ve **`10` adet İtalyan (`RDR`)** izi.
  * **Bradbury İniş Noktası (`-4.5895°G, 137.4416°D`) – Boxwork (`-4.7974°..-4.8107°G, 137.3791°..137.3867°D`) Koridorunu Doğrudan Kesen Öncelikli `4` İz:**
    * **`s_02600701`** (Yörünge `26007`, `2012-02-13`): Detay kutusunu sütun `3222` (`-4.5204°G, 137.4133°D`) – sütun `3265` (`-4.8539°G, 137.3727°D`) arasında keser; **Boxwork sondaj bölgesinin neredeyse tam üzerinden geçer.**
    * **`s_02176201`** (Yörünge `21762`, `2011-03-19`): Sütun `360` (`-4.5254°G, 137.4304°D`) – sütun `403` (`-4.8589°G, 137.3898°D`) arasında, Bradbury İniş Noktası batısından Boxwork doğu kenarına geçer.
    * **`s_01050101`** (Yörünge `10501`, `2008-10-22`): Sütun `210` (`-4.5215°G, 137.3851°D`) – sütun `253` (`-4.8550°G, 137.3444°D`) arasında, Boxwork batı kanadı üzerinden geçer.
    * **`s_06903102`** (Yörünge `69031`, `2021-04-18`): Güneyden kuzeye sütun `7070` (`-4.8592°G, 137.4492°D`) – sütun `7113` (`-4.5256°G, 137.4080°D`) arasında, Curiosity tırmanış koridorundan geçer.

#### Sharp Dağı Eteği Kutusunu (`-4.86°..-4.52°G, 137.27°..137.61°D`) Kesen Tüm `10` SHARAD İzi

| # | ABD Ürün ID (`USRDRV2`) | İtalyan Ürün ID (`RDR`) | Yörünge | Gözlem Tarihi (UTC) | Tüm İz Lat / Lon Sınırları | Öncelik / Not |
|---:|---|---|---:|---|---|---|
| 1 | `s_01050101_rgram` | `r_1050101_001_ss19_700_a` | `10501` | `2008-10-22` | `-7.33°..-2.90°` / `137.04°..137.58°` | **Öncelikli** (Boxwork batısı) |
| 2 | `s_01963202_rgram` | `r_1963202_001_ss19_700_a` | `19632` | `2010-10-04` | `-8.55°..-1.71°` / `136.94°..137.77°` | Kutu batı kenarı |
| 3 | `s_02176201_rgram` | `r_2176201_001_ss19_700_a` | `21762` | `2011-03-19` | `-9.43°..-1.74°` / `136.83°..137.77°` | **Öncelikli** (Bradbury–Boxwork) |
| 4 | `s_02232901_rgram` | `r_2232901_001_ss19_700_a` | `22329` | `2011-05-02` | `-7.58°..-3.31°` / `137.22°..137.74°` | Sharp Dağı doğu yamacı |
| 5 | `s_02324501_rgram` | `r_2324501_001_ss19_700_a` | `23245` | `2011-07-12` | `-7.75°..-2.62°` / `137.24°..137.86°` | Doğu etekler |
| 6 | `s_02501901_rgram` | `r_2501901_001_ss19_700_a` | `25019` | `2011-11-27` | `-7.67°..-2.56°` / `136.92°..137.55°` | Batı etekler |
| 7 | `s_02600701_rgram` | `r_2600701_001_ss19_700_a` | `26007` | `2012-02-13` | `-10.24°..+20.46°` / `136.71°..140.50°` | **1. Öncelik** (Boxwork tam üstü) |
| 8 | `s_02678501_rgram` | `r_2678501_001_ss19_700_a` | `26785` | `2012-04-13` | `-10.31°..+20.40°` / `136.63°..140.41°` | Boxwork doğu-güneydoğu yakını |
| 9 | `s_06903102_rgram` | `r_6903102_001_ss4_700_a` | `69031` | `2021-04-18` | `-59.70°..+0.01°` / `136.85°..145.99°` | **Öncelikli** (Güney-Kuzey geçişi) |
| 10 | `s_08714901_rgram` | `r_8714901_001_ss4_700_a` | `87149` | `2025-02-27` | `-29.38°..-0.18°` / `137.00°..140.67°` | En güncel uzun iz |

### 5. Format, Doğrudan İndirme Linkleri ve Sunucudan Doğrulanmış Dosya Boyutları
* **Formatlar (`aareadme.txt`, `s_01050101_rgram.lbl`, `s_01050101_geom.lbl`):**
  * `*_rgram.img` + `.lbl`/`.xml`: 32-bit IEEE kayan noktalı (`PC_REAL`) ham işlenmiş radargram ikili matrisi (`3.600` satır × iz uzunluğunca sütun).
  * `*_geom.tab` + `.lbl`/`.xml`: Her radargram sütunu için `100` baytlık sabit genişlikli ASCII tablo (`10` sütun: `RADARGRAM COLUMN`, `TIME`, `LATITUDE`, `LONGITUDE`, `MARS RADIUS`, `SPACECRAFT RADIUS`, `RADIAL VELOCITY`, `TANGENTIAL VELOCITY`, `SZA`, `PHASE/1.0E16`).
  * `*_tiff.tif` & `*_thm.jpg`: `-3 dB..+32 dB` logaritmik gri ölçekli tam çözünürlüklü TIFF ve küçültülmüş JPEG kesit önizlemesi.
  * `*_rgram_xml.zip` & `*_rgram_xml.kml`: Mars ODE tarafından üretilmiş hazır ESRI Shapefile (`.zip`) ve KML iz geometrileri.
  * `*_sim.img` & `*_browse_combined.tif`: Clutter simülasyonu verisi (sol, sağ ve birleşik yüzey yankısı) ve karşılaştırma TIFF'i.

| Dosya / Ürün | Açıklama | Doğrudan İndirme Linki | Doğrulanmış Boyut (`HTTP HEAD` / PDS) |
|---|---|---|---|
| `s_02600701_rgram.img` | Boxwork üstü 32-bit radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0260xx/s_02600701_rgram.img` | **`54,38 MiB`** (`57.024.000` B) |
| `s_02600701_geom.tab` | `s_02600701` sütun koordinat tablosu | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/geom/s_0260xx/s_02600701_geom.tab` | **`386,7 KiB`** (`396.000` B) |
| `s_02600701_tiff.tif` | `s_02600701` tam çözünürlüklü kesit TIFF | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/browse/tiff/s_0260xx/s_02600701_tiff.tif` | **`13,61 MiB`** (`14.267.208` B) |
| `s_02600701_thm.jpg` | `s_02600701` önizleme JPEG | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/browse/thm/s_0260xx/s_02600701_thm.jpg` | **`2,98 MiB`** (`3.126.471` B) |
| `s_02600701_rgram_xml.zip` | `s_02600701` ODE Shapefile çizgisi | `https://ode.rsl.wustl.edu/mars/datafile/shapefiles/mro_sharad_us_radargrams-data/mrosh_2101/data/rgram/s_0260xx/s_02600701_rgram_xml.zip` | **`10,3 KiB`** (`10.546` B) |
| `s_02176201_rgram.img` | Bradbury–Boxwork 32-bit radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0217xx/s_02176201_rgram.img` | **`13,64 MiB`** (`14.299.200` B) |
| `s_02176201_geom.tab` | `s_02176201` sütun koordinat tablosu | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/geom/s_0217xx/s_02176201_geom.tab` | **`97,0 KiB`** (`99.300` B) |
| `s_02176201_thm.jpg` | `s_02176201` önizleme JPEG | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/browse/thm/s_0217xx/s_02176201_thm.jpg` | **`787,1 KiB`** (`805.970` B) |
| `s_01050101_rgram.img` | Boxwork batısı 32-bit radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0105xx/s_01050101_rgram.img` | **`7,86 MiB`** (`8.236.800` B) |
| `s_01050101_geom.tab` | `s_01050101` sütun koordinat tablosu | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/geom/s_0105xx/s_01050101_geom.tab` | **`55,9 KiB`** (`57.200` B) |
| `s_01050101_tiff.tif` | `s_01050101` tam çözünürlüklü kesit TIFF | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/browse/tiff/s_0105xx/s_01050101_tiff.tif` | **`1,97 MiB`** (`2.061.156` B) |
| `s_01050101_thm.jpg` | `s_01050101` önizleme JPEG | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/browse/thm/s_0105xx/s_01050101_thm.jpg` | **`440,2 KiB`** (`450.743` B) |
| `s_01050101_rgram_xml.zip` | `s_01050101` ODE Shapefile çizgisi | `https://ode.rsl.wustl.edu/mars/datafile/shapefiles/mro_sharad_us_radargrams-data/mrosh_2101/data/rgram/s_0105xx/s_01050101_rgram_xml.zip` | **`9,2 KiB`** (`9.459` B) |
| `s_01050101_rgram_xml.kml` | `s_01050101` ODE KML çizgisi | `https://ode.rsl.wustl.edu/mars/datafile/kmlfiles/mro_sharad_us_radargrams-data/mrosh_2101/data/rgram/s_0105xx/s_01050101_rgram_xml.kml` | **`3,5 KiB`** (`3.534` B) |
| `s_01050101_sim.img` | `s_01050101` clutter simülasyonu (sol/sağ/birleşik) | `https://pds-geosciences.wustl.edu/mro/urn-nasa-pds-mro_sharad_simulations/data/s_0105xx/s_01050101/s_01050101_sim.img` | **`23,57 MiB`** (`24.710.400` B) |
| `s_01050101_browse_combined.tif` | `s_01050101` clutter simülasyonu önizleme TIFF | `https://pds-geosciences.wustl.edu/mro/urn-nasa-pds-mro_sharad_simulations/browse/s_0105xx/s_01050101/s_01050101_browse_combined.tif` | **`1,96 MiB`** (`2.059.322` B) |
| `s_06903102_rgram.img` | 2021 G-K geçişi 32-bit radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0690xx/s_06903102_rgram.img` | **`105,72 MiB`** (`110.851.200` B) |
| `s_06903102_geom.tab` | `s_06903102` sütun koordinat tablosu | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/geom/s_0690xx/s_06903102_geom.tab` | **`751,8 KiB`** (`769.800` B) |
| `s_06903102_thm.jpg` | `s_06903102` önizleme JPEG | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/browse/thm/s_0690xx/s_06903102_thm.jpg` | **`6,04 MiB`** (`6.335.412` B) |
| `s_01963202_rgram.img` | Kutu batı kenarı radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0196xx/s_01963202_rgram.img` | **`12,13 MiB`** (`12.715.200` B) |
| `s_02232901_rgram.img` | Sharp doğu yamacı radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0223xx/s_02232901_rgram.img` | **`7,57 MiB`** (`7.934.400` B) |
| `s_02324501_rgram.img` | Doğu etekler radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0232xx/s_02324501_rgram.img` | **`9,09 MiB`** (`9.532.800` B) |
| `s_02501901_rgram.img` | Batı etekler radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0250xx/s_02501901_rgram.img` | **`9,08 MiB`** (`9.518.400` B) |
| `s_02678501_rgram.img` | Doğu-güneydoğu radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0267xx/s_02678501_rgram.img` | **`54,38 MiB`** (`57.024.000` B) |
| `s_08714901_rgram.img` | En güncel (2025) iz radargram | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/rgram/s_0871xx/s_08714901_rgram.img` | **`51,70 MiB`** (`54.216.000` B) |
| `index.tab` (`mrosh_2101`) | Tüm ABD radargram kataloğu | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/index/index.tab` | **`14,17 MiB`** (`14.853.800` B) |

---

## BÖLÜM B — Mars Gravite Verisi (İkincil)

### 1. Nedir? (Veri Neyi Gösteriyor?)
* **Yörünge Gravite Modelleri (`MRO-M-RSS-5-SDP-V1.0`):** MRO, *Mars Global Surveyor* (MGS), *Mars Odyssey* ve iniş araçlarının (*Viking 1*, *Pathfinder*, *InSight*) radyo takip verilerindeki Doppler kaymalarından üretilen `120. derece ve mertebe` (`120×120`) küresel harmonik modelleridir (`GMM-3` / GSFC, Genova et al., 2016; `MRO120D/F/G` / JPL, Konopliv et al., 2016–2026 — `https://pds-geosciences.wustl.edu/missions/mro/gravity.htm`). Serbest hava gravite anomalisi (`mGal`), topoğrafya etkisi çıkarılmış **Bouguer gravite anomalisi** (`mGal`), geoid (areoid) yüksekliği (`m`) ve **kabuk kalınlığı (`km`)** haritaları içerir (`ggmro_120_anom_100.lbl`, `ggmro_120_bouguer_90.lbl`, `ggmro_120_crust.lbl`).
* **Yüzey Gravimetrisi (`Curiosity RIMU` — Lewis et al., 2019):** Curiosity'nin mühendislik ivmeölçerleri (*Rover Inertial Measurement Units*), Gale Krateri ve Sharp Dağı alt yamaçlarındaki duraklarda yerçekimi değişimini ölçerek alttaki tortul ana kayanın yığın yoğunluğunu **`1.680 ± 180 kg/m³`** (beklenenden düşük yoğunluk, yüksek gözeneklilik) olarak saptamıştır (`https://doi.org/10.1126/science.aat0738`).

### 2. Astronota Ne Söyler?
* **Yörünge gravitesi:** Gale Krateri'nin bölgesel ölçekte Mars kabuk kalınlığı ve dikotomi (kuzey-güney kabuk geçişi) kuşağındaki jeofizik konumunu açıklar.
* **Curiosity yüzey gravimetrisi:** Sharp Dağı alt birimlerinin çok gözenekli olduğunu (`1.680 ± 180 kg/m³`) göstererek bu katmanların derin gömülme altında tamamen taşlaşıp sıkışmadığını — dolayısıyla geçmişte yeraltı suyu dolaşımına ve Boxwork mineral damarlarının oluşumuna açık bir kaya yapısı barındırdığını — bilimsel hikâye olarak destekler.

### 3. Sınırı Ne?
* **Yörünge Gravitesi Astronot Ölçeği İçin Çok Kabadır:** `120×120` küresel harmonik modellerin gerçek fiziksel yarı-dalga boyu çözünürlüğü **`~89–110 km`** (`derece 90–120`) mertebesindedir. PDS `RSDMAP` ızgaraları **`16 piksel/derece`** (`GGMRO_120_*`) veya **`1 piksel/derece`** (`59,29 km/piksel`, `JGMRO_120D_*`) çözünürlüktedir (`ggmro_120_anom_100.lbl`, `jgmro_120d_anom_095.lbl`). Bu nedenle **`150 km` çaplı Gale Krateri bu veride kabaca 1–2 anomali bölgesi gibi görünür**; birkaç kilometrelik yürüyüş rotasında piksel bazında karar verdirmez.
* **Güncellik (`errata.txt`, `jgmro_120g_sha.lbl`):** En güncel yörünge gravite katsayı seti **`MRO120G` (`24 Eylül 2026` yayını, `30 Ağustos 2006 – 15 Şubat 2025` takip verisi)** olup yalnızca küresel harmonik katsayı tablosudur (`jgmro_120g_sha.tab`). Hazır küresel `.IMG` haritaları `GMM-3` (`2016`) ve `MRO120D` (`2016`) sürümlerindedir.

### 4. Gale İçin Durum
* PDS `RSDMAP` klasöründe Gale'i de kapsayan küresel hazır sayısal haritalar (`.IMG`, `-90°..+90°` Simple Cylindrical) vardır; ancak bölgesel (onlarca km) ölçeklidir.

### 5. Format, Doğrudan İndirme Linkleri ve Doğrulanmış Boyutlar (`MRO-M-RSS-5-SDP-V1.0`)
Formatlar `64-bit PC_REAL` düz ikili harita (`.img` + `.lbl`) ve ASCII küresel harmonik katsayı tablosudur (`.tab` + `.lbl`).

| Dosya | Açıklama | Doğrudan İndirme Linki | Doğrulanmış Boyut (PDS Dizin) |
|---|---|---|---|
| `ggmro_120_anom_100.img` | GMM-3 Serbest hava gravite anomalisi (`mGal`, `16 pix/deg`) | `https://pds-geosciences.wustl.edu/mro/mro-m-rss-5-sdp-v1/mrors_1xxx/data/rsdmap/ggmro_120_anom_100.img` | **`126,56 MiB`** (`132.710.400` B) |
| `ggmro_120_bouguer_90.img` | GMM-3 Bouguer gravite anomalisi (`mGal`, `16 pix/deg`) | `https://pds-geosciences.wustl.edu/mro/mro-m-rss-5-sdp-v1/mrors_1xxx/data/rsdmap/ggmro_120_bouguer_90.img` | **`126,56 MiB`** (`132.710.400` B) |
| `ggmro_120_crust.img` | GMM-3 + MOLA kabuk kalınlığı (`km`, `16 pix/deg`) | `https://pds-geosciences.wustl.edu/mro/mro-m-rss-5-sdp-v1/mrors_1xxx/data/rsdmap/ggmro_120_crust.img` | **`126,56 MiB`** (`132.710.400` B) |
| `ggmro_120_geoid_90.img` | GMM-3 Mars geoid/areoid yüksekliği (`4 pix/deg`) | `https://pds-geosciences.wustl.edu/mro/mro-m-rss-5-sdp-v1/mrors_1xxx/data/rsdmap/ggmro_120_geoid_90.img` | **`253,1 KiB`** (`259.200` B) |
| `jgmro_120d_anom_095.img` | JPL MRO120D serbest hava anomalisi (`1 pix/deg`) | `https://pds-geosciences.wustl.edu/mro/mro-m-rss-5-sdp-v1/mrors_1xxx/data/rsdmap/jgmro_120d_anom_095.img` | **`509,1 KiB`** (`521.280` B) |
| `jgmro_120g_sha.tab` | En yeni JPL MRO120G harmonik katsayıları (Eylül 2026) | `https://pds-geosciences.wustl.edu/mro/mro-m-rss-5-sdp-v1/mrors_1xxx/data/shadr/jgmro_120g_sha.tab` | **`879,5 KiB`** (`900.604` B) |
| `gmm3_120_sha.tab` | GSFC GMM-3 harmonik katsayıları | `https://pds-geosciences.wustl.edu/mro/mro-m-rss-5-sdp-v1/mrors_1xxx/data/shadr/gmm3_120_sha.tab` | **`879,5 KiB`** (`900.604` B) |

---

## BÖLÜM C — Uygulamada Nasıl Kullanılabilir? (Dürüst Mühendislik Önerisi)

SHARAD verisi düz bir 2B harita görüntüsü değil, uydu izi boyunca **düşey zaman/derinlik kesiti** olduğu için ve gravite modelleri de `~90–110 km` ölçeğinde kaba kaldığı için, bu katmanlar HiRISE veya THEMIS gibi **doğrudan piksel bazlı raster ısı haritası olarak üst üste bindirilmemelidir**. Bunun yerine **dürüst, hafif ve görsel olarak güçlü** üç entegrasyon önerilir:

1. **SHARAD Yörünge İzlerini Çizgi (Polyline) Katmanı Olarak Gösterin:**
   * Haritada *"Jeofizik / SHARAD İzleri"* katmanı açıldığında, Sharp Dağı koridorunu kesen `4` öncelikli izi (`s_02600701`, `s_02176201`, `s_01050101`, `s_06903102`) — veya kutudaki `10` izin tamamını — Mars ODE'nin hazır `*_rgram_xml.zip` (Shapefile) / `*_rgram_xml.kml` / `*_geom.tab` koordinatlarından GeoJSON çizgisi olarak çizin.
2. **İze Tıklanınca Açılan "Yüzey Altı Radar Kesiti + Clutter Uyarısı" Penceresi:**
   * Kullanıcı haritadaki bir SHARAD çizgisine (özellikle Boxwork üzerinden geçen `s_02600701` izine) tıkladığında yan panelde/modalda `*_thm.jpg` veya `*_tiff.tif` kesit görselini açın; harita kutusuna denk gelen sütun aralığını (`ör. s_02600701` için `3222–3265`) vurgulayın ve mümkünse yanına `*_browse_combined.tif` clutter simülasyonunu koyun.
   * Kartın altında mutlaka şunu belirtin: *"SHARAD çözünürlüğü iz boyunca ~460 m, dik yönde 1,5–8 km'dir; Sharp Dağı'ndaki dik yamaçlar nedeniyle kesitte güçlü yüzey yan yankısı (clutter) bulunur."*
3. **Graviteyi Ağır Raster Yerine "Bölgesel Bağlam + RIMU Kaya Yoğunluğu Kartı" Olarak Sunun:**
   * `126 MiB`lık kaba küresel `.IMG` rasterını yürüyüş haritasına yüklemek yerine, Sharp Dağı / Boxwork bilgi kartına **"Curiosity RIMU Yerinde Gravimetri Ölçümü: `1.680 ± 180 kg/m³` düşük ana kaya yoğunluğu / yüksek gözeneklilik (Lewis et al., 2019)"** maddesini ekleyin; yörünge gravitesini (`GMM-3` / `MRO120G`) yalnızca genel Gale Krateri jeofizik özetinde referans değeri olarak kullanın.

---

## BÖLÜM D — Kaynak Linkleri ve Bulunamayan / Doğrulanamayan Bilgiler

### Kaynak Linkleri
* **PDS Geosciences Node — MRO SHARAD Ana Sayfası:** `https://pds-geosciences.wustl.edu/missions/mro/sharad.htm`
* **PDS SHARAD U.S. Radargrams (`mrosh_2101`, PDS4):** `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/`
* **SHARAD Cihaz & Veri Seti Belgeleri:** `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/catalog/sharadinst.cat` | `radargram_ds.cat` | `aareadme.txt` | `https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/document/rgram_processing.pdf`
* **SHARAD Surface Clutter Simülasyonları (`mro_sharad_simulations`):** `https://pds-geosciences.wustl.edu/mro/urn-nasa-pds-mro_sharad_simulations/`
* **SHARAD 3D Kutupsal Ürünler Sayfası:** `https://pds-geosciences.wustl.edu/missions/mro/sharad_3d_pds4.htm`
* **PDS Geosciences Node — MRO Gravity / Radio Science:** `https://pds-geosciences.wustl.edu/missions/mro/gravity.htm` (`errata.txt`: `.../mrors_1xxx/errata.txt`, haritalar: `.../mrors_1xxx/data/rsdmap/`, katsayılar: `.../mrors_1xxx/data/shadr/`)
* **Mars Orbital Data Explorer (ODE) Arama ve REST API:** `https://ode.rsl.wustl.edu/mars/` ve `https://oderest.rsl.wustl.edu/live2/`
* **Curiosity Yüzey Gravimetrisi Makalesi (Lewis et al., 2019):** `https://doi.org/10.1126/science.aat0738`
* **MRO120G Makale Referansı (Konopliv et al., 2026):** `https://doi.org/10.3847/PSJ/ae9ba7`

### Bulunamayan / Doğrulanamayan Bilgiler
1. **Gale Krateri İçin Hazır Sürekli 2B/3B SHARAD Haritası Yoktur:** PDS'teki `SHARAD 3D` arşivi (`urn:nasa:pds:mro_sharad_3d`) yalnızca kuzey ve güney kutup bölgelerini kapsar; Gale / Sharp Dağı için sürekli bir yüzey altı haritası bulunamadı.
2. **Gale / Sharp Dağı Altında Doğrulanmış Saf Su Buzu Katmanı Tespiti Yoktur:** Sharp Dağı yamaçlarındaki radargramlar yoğun topoğrafik yan yankı (clutter) içerdiğinden, PDS verilerinde Boxwork kuşağının hemen altında SHARAD ile doğrulanmış erişilebilir bir su buzu tabakası olduğuna dair hazır bir ürün veya kesinleşmiş tespit doğrulanmadı.
3. **Curiosity RIMU Yüzey Gravimetri Doğrudan İndirme Tablosu (PDS CSV):** `Lewis et al. (2019)` çalışmasının türetilmiş noktasal $g$ / yoğunluk tablosu PDS Geosciences üzerinde bağımsız bir türetilmiş CSV dosyası olarak bulunamadı; çalışma *Science* makalesinin (`DOI: 10.1126/science.aat0738`) ek materyallerine dayanmaktadır (**doğrudan açık PDS indirme linki doğrulanmadı**).
4. **Mars Trek WMTS Katmanı:** NASA Mars Trek API katman listesinde (`https://trek.nasa.gov/tiles/apidoc/trekAPI.html?body=mars`) Gale için canlı bir SHARAD radargram veya `MRO120G` WMTS karo katmanı bulunmadı.
5. **Diğer `9` İtalyan/Clutter/TIFF Dosyasının Tamamı Tek Tek `HEAD` Edilmedi:** Öncelikli ve temsilci ABD `rgram.img`, `geom.tab`, `thm.jpg`, `tiff.tif`, `sim.img` dosyalarının boyutları sunucudan doğrulandı; İtalyan RDR klasöründeki karşılıkların tamamının ayrı ayrı bayt boyutları tek tek çekilmedi (**doğrulanmadı**).

---

## Repoya eklenen veri (2026-11-14)

| Dosya | İçerik | Boyut |
|---|---|---|
| `sharad_tracks.geojson` | README'deki 10 SHARAD izi, her biri bir `LineString`. Koordinatlar `[boylam, enlem]` (Mars, WGS84 değil). | ~88 KB |
| `s_02176201_thm.jpg` | `s_02176201` izinin radargram önizleme görseli (PDS `browse/thm`). Sadece görsel, kutuya göre konumlandırılmamıştır. | 806 KB |
| `bounds.json` | Bölge kutusu, Sharp detay kutusu ve dosya açıklamaları (`data/mola/bounds.json` ile aynı kutu). | küçük |

### Geometri nereden geldi

Her izin koordinatları, PDS'teki `*_geom.tab` ürününden alındı (`https://pds-geosciences.wustl.edu/mro/mro-m-sharad-5-radargram-v2/mrosh_2101/data/geom/s_XXXXxx/s_XXXXXXXX_geom.tab`). Tabloda her radargram sütunu için bir satır var: sütun numarası, zaman, `LATITUDE`, `LONGITUDE` (ve diğer geometri alanları). Hiçbir koordinat tahmin edilmedi veya sonradan eklenmedi.

### Nasıl kırpıldı

Her iz **Gale kutusuna** (enlem -7,0..-3,5, boylam 136,0..139,5 D) kırpıldı. Kutu içindeki noktalar art arda gelen radargram sütunlarıdır (10 izin hepsinde kesintisiz). Her özelliğin `radargram_column_first` ve `radargram_column_last` alanı, kırpılan parçanın radargramdaki sütun aralığını verir. Bu sayede tam radargramı indirip bu sütunları kesmek mümkündür. Tam izler çok daha uzun (örneğin `s_06903102` -59,7° ile 0° arası).

### Kontrol

- Tablodaki Sharp detay kutusu (`-4,86..-4,52` enlem, `137,27..137,61` boylam) içine düşen sütun aralıkları, yukarıdaki README'de yazılanlarla uyuşuyor: `s_02600701` 3222–3265, `s_02176201` 360–403, `s_01050101` 210–253, `s_06903102` 7070–7113 (başlangıç ve bitiş koordinatları README'dekiyle aynı).
- Her iz için kutudaki nokta sayısı ve Sharp kutusundaki nokta sayısı (`points_in_box`, `points_in_sharp_detail_box`) özelliklerde yazılı. `s_02501901` ve `s_08714901` izlerinde Sharp kutusunda 38 ve 43 nokta var (diğerlerinde 44).

### Boxwork koridoru bayrağı

`boxwork_koridoru = true` olan 4 iz: `s_02600701`, `s_02176201`, `s_01050101`, `s_06903102`. Bu seçim yukarıdaki "Boxwork koridorunu kesen izler" listesindendir. Koridorun sınırı bu çalışmada yeniden hesaplanmadı.

### Sınırlar

- Radargram **verisi** (`*_rgram.img`) repoya konmadı, sadece iz çizgileri ve bir önizleme görseli. Yüzey altı yorumu için ilgili radargramlar PDS'ten indirilmelidir (linkler yukarıda).
- Önizleme görseli yalnızca `s_02176201` için. Başka iz için görsel eklenmedi.
- İzler yörüngenin yer izidir. Radarın yan yansımaları (clutter) izin iki yanından gelebilir; bu çizgiler yüzey altı bir yapının konumu değildir.
