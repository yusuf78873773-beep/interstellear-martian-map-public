# Mars Odyssey THEMIS Termal Verisi (Gündüz ve Gece IR Mozaikleri)

Gale Krateri / Sharp Dağı rota planlamasında yüzey malzemesi (kaya vs. toz/kum) ve göreceli gündüz-gece ısıl davranışını değerlendirmek için kullanılan **Mars Odyssey THEMIS (Thermal Emission Imaging System)** kızılötesi mozaikleri.

---

## 1. Nedir?
- **Kaynak:** NASA'nın 2001 Mars Odyssey yörünge aracındaki THEMIS kamerasının termal kızılötesi (IR) gözlemlerinden üretilen, jeodezik olarak kontrol edilmiş küresel mozaiklerdir (USGS Viking Orbiter MDIM 2.1 koordinat sistemine bağlanıp ortoprojekte edilmiştir).
- **Gündüz IR (`MO THEMIS-IR Day, Global Mosaic`):** Güneş'e bakan sıcak yamaçların parlak, gölgeli yamaçların koyu göründüğü gündüz kızılötesi mozaiğidir; ağırlıklı olarak **topoğrafyayı** vurgular.
- **Gece IR (`MO THEMIS-IR Night, Global Mosaic`):** Şafak öncesi/gece ölçümlerinden oluşur ve yüzeyin **termal atalet (thermal inertia)** farklarını ortaya çıkarır: gece ısıyı hızla kaybeden ince toz/kum alanları **koyu (soğuk)**, ısıyı tutan kayalık ve sertleşmiş zeminler ise **parlak (sıcak)** görünür.

## 2. Astronota Ne Söyler?
- **Zemin türü ve taşıma/batma riski (Gece IR):** Gece parlak (sıcak) görünen birimler anakaya veya yoğun taşlık zemine işaret eder; koyu (soğuk) görünen birimler ise gece çok hızlı soğuyan gevşek toz veya ince kum birikintilerini (rover/astronot için batma ve toz kalkma riski) gösterir.
- **Isıl konfor ve ekipman/batarya planı:** Gece en soğuk kalan koyu bölgeler ile ısıyı gece boyunca daha uzun koruyan parlak kayalık hatlar ayırt edilerek kamp/durak noktaları ve gece/sabah erken saat geçişleri daha güvenli seçilir.
- **Kısıt notu (saatlik/Kelvin sıcaklık):** Mars Trek üzerindeki bu 100 m mozaikler saat saat değişen canlı bir sıcaklık tablosu veya doğrudan Kelvin değeri **vermez**; Mars Odyssey'in güneş-eşzamanlı yörüngesinde sabit yerel saatlerde çekilmiş şeritlerin kontrast-gerilmiş görsel birleşimidir.

## 3. Sınırı Ne?
- **Çözünürlük:** **100 m/piksel** (tek bir piksel içinde kaya, kum ve tozun karışım ortalaması yer alır; metre altı taşları veya dar yürüyüş patikalarını tek başına seçemez — bunun için HiRISE ile birlikte kullanılmalıdır).
- **Kapsama aralığı:** Bu kontrollü mozaikler **`65° S` – `65° N`** enlemleri arasını kapsar (`bbox: -179.9999997, -65.0006576, 179.9998849, 65.0007535`); kutup bölgeleri dışarıdadır.
- **Bilinen kısıtlar:**
  - Mars Trek WMTS katmanları **görsel (`image/png`)** mozaiklerdir; piksel parlaklıkları **mutlak Kelvin sıcaklığı değildir** (doğrudan sıcaklık/parlaklık sıcaklığı ölçümü için PDS `BTR`/`PBT` şeritleri gerekir).
  - Farklı mevsim ve yerel saatlerde çekilmiş şeritler birleştirildiği için atmosferik toz, mevsimsel değişim ve Gale Krateri/Sharp Dağı gibi dik eğimli topoğrafyalarda gölge/bakı kaynaklı lokal sapmalar görülebilir.
  - Nicel termal atalet modellerinde mutlak belirsizlik tipik olarak ~%20 mertebesindedir.

## 4. Gale Krateri / Sharp Dağı İçin Durum
- **Kullanılabilir kapsama var mı?** **Evet, %100 kapsanıyor.** Gale Krateri / Sharp Dağı (`lat` ~`-5.8°..-3.9°`, `lon` ~`137.1°..138.6° E`), `65° S – 65° N` mozaik sınırlarının tamamen içindedir.
- **Mars Trek Katman Adları ve WMTS Bağlantıları (12 zoom seviyesi `0`–`11`, `image/png`, `EPSG::104905`):**
  - **Gündüz IR Katman Adı:** `THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018` (`MO THEMIS-IR Day, Global Mosaic`)
    - WMTS Capabilities: `https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018/1.0.0/WMTSCapabilities.xml`
    - Tile şablonu: `https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018/1.0.0//default/default028mm/{TileMatrix}/{TileRow}/{TileCol}.png`
  - **Gece IR Katman Adı:** `THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018` (`MO THEMIS-IR Night, Global Mosaic`)
    - WMTS Capabilities: `https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018/1.0.0/WMTSCapabilities.xml`
    - Tile şablonu: `https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018/1.0.0//default/default028mm/{TileMatrix}/{TileRow}/{TileCol}.png`
  - **Ek (Nicel Termal Atalet — 3 km çözünürlük):** `TES_Thermal_Inertia` (`MGS TES, Global Thermal Inertia`, 20 ppd / 3 km; WMTS / Mars Trek üzerinden)

## 5. Kaynak Linkleri ve Bulunamayanlar
- **Mars Trek Portalı:** https://trek.nasa.gov/mars/
- **Mars Trek Metadata API (doğrulandı):**
  - Day IR: `https://trek.nasa.gov/mars/TrekServices/ws/index/eq/getItem?productLabel=THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018`
  - Night IR: `https://trek.nasa.gov/mars/TrekServices/ws/index/eq/getItem?productLabel=THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018`
- **NASA PDS Alternatifleri (kalibre Kelvin parlaklık sıcaklığı `BTR`/`PBT` şeritleri için):**
  - PDS Geosciences THEMIS sayfası: https://pds-geosciences.wustl.edu/missions/odyssey/themis.html
  - PDS Imaging Mars Odyssey hacimleri: https://pds-imaging.jpl.nasa.gov/volumes/ody.html
  - ASU THEMIS PDS Arşivi (`ODTGEO_v2`, `ODTSDP_v1`): http://static.mars.asu.edu/pds/
- **Bulunamayan / Mevcut Olmayan:** Mars Trek içinde doğrudan THEMIS'e ait saatlik sıcaklık serisi veya indirilebilir sayısal Kelvin termal atalet GeoTIFF katmanı **bulunamadı** (Mars Trek katalog aramasında `THEMIS` için 100 m Day/Night görsel mozaikleri dışında sıcaklık dereceli küresel THEMIS haritası yok; sayısal termal atalet katmanı olarak yalnızca 3 km çözünürlüklü `TES_Thermal_Inertia` bulunuyor).

---

## Repoya eklenen görüntüler (2026-11-14)

Mars Trek WMTS katmanlarından **Gale kutusu** için iki görüntü üretildi. Kutu `data/mola/bounds.json` ile aynı: enlem -7,0..-3,5, boylam 136,0..139,5 D. Yöntem `data/ctx/` ile aynı: tile'lar indirildi, birleştirildi, kutuya kırpıldı.

| Dosya | Katman | Boyut (piksel) | Dosya boyutu |
|---|---|---|---|
| `gale_themis_day_ir.png` | `THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018` | 1274 × 1275 | ~1,0 MB |
| `gale_themis_night_ir.png` | `THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018` | 1274 × 1275 | ~1,1 MB |
| `bounds.json` | Kutu, piksel→koordinat formülü, katman ve tile bilgisi | | küçük |

- **Zoom ve çözünürlük:** Zoom **8**, 364,09 piksel/derece, yaklaşık **162,8 m/piksel**. Katmanın kendi çözünürlüğü 100 m. Zoom 9 yaklaşık 81 m/piksel verirdi ve 100 m sınırını aşardı, bu yüzden zoom 8 seçildi. Yani görüntü katmanın yerel çözünürlüğünden biraz **daha kaba**.
- **Tile'lar:** Zoom 8, satır 132–137, sütun 449–454 (36 tile). Her iki katmanda da bozuk tile çıkmadı. Tile adresi şablonu yukarıdaki "Mars Trek Katman Adları" bölümündeki gibi.
- **Piksel-koordinat:** Piksel `(satır, sütun)` için enlem `kuzey − (satır + 0,5) / 364,0889`, boylam `batı + (sütun + 0,5) / 364,0889`. Tam sınırlar `bounds.json` içinde.
- **Görüntü doğrulaması:** Görüntü gözle kontrol edildi, Gale Krateri ve Sharp Dağı kutunun ortasında ve `data/mola`/`data/ctx` ile aynı yerde. Sayısal bir hizalama testi yapılmadı.
- **Katman gösterim notu:** Bu görüntüler gündüz ve gece kızılötesi mozaiklerinin parlaklığıdır. Yukarıdaki "Kısıt" bölümünde yazdığı gibi mutlak sıcaklık değildir.
