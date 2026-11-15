# HiRISE Görüntüleri ve Sayısal Arazi Modelleri (DTM)

- **Kaynaklar:**
  - HiRISE Portal: https://www.uahirise.org/ (DTM teknik detayları: https://www.uahirise.org/dtm/about.php)
  - NASA PDS Arşivi: https://hirise-pds.lpl.arizona.edu/PDS/
  - DTM İndeksi: https://hirise-pds.lpl.arizona.edu/PDS/INDEX/DTMCUMINDEX.TAB
- **Bölge:** Gale Krateri / Sharp Dağı (Aeolis Mons), `lat` -5.80..-3.88, `lon` 137.09..138.57 E
- **Gale Krateri Kapsama Özeti:** PDS `DTMCUMINDEX.TAB` içindeki toplam 1.377 DTM'den **27 tanesi** doğrudan Gale Krateri, Curiosity (MSL) iniş sahası, Peace Vallis, kanyonlar, kumullar ve Sharp Dağı (Aeolis Mons) yamaçlarını kapsar. Bunların **25'i 1.01 m/piksel** (`DTEEC_*`), **2'si 2.02 m/piksel** (`DTEED_*`) çözünürlüktedir. Her DTM seti `.IMG` yükseklik modeline ek olarak **0.25 m/piksel** (`*_A_*`) ve **1.01 m/piksel** (`*_C_*`) ortorektifiye görüntüler (`RED` ve `IRB` `.JP2`) ile `EXTRAS/DTM/` altında hızlı önizleme dosyaları içerir.

---

## Sunum İçin Hazır Notlar (3–4 Satır)

### 1. HiRISE Görüntüleri (RDR / Orto-Görüntü)
- **Nedir:** NASA'nın MRO uydusundaki HiRISE kamerasından elde edilen, radyometrik ve geometrik olarak düzeltilmiş, ~25–30 cm/piksel çözünürlüklü Mars yüzey fotoğraflarıdır (tek bant `RED` ve 3 bant artırılmış renkli `IRB`).
- **Astronota ne söyler:** İniş ve yürüyüş rotası üzerindeki kaya tarlalarını, keskin kayaları, kumul/dalga yapılarını, uçurum kenarlarını ve eski rover izlerini tek tek ayırt ettirerek güvenli geçitleri seçtirir.
- **Sınırı ne:** Tüm Mars'ı değil yalnızca dar şeritleri (~5–6 km genişlikte hedef bölgeleri) kapsar; ~0.5 m'den küçük taşları net seçemez ve gölgeli/tozlu alanlarda yüzey detaylarını gizleyebilir.
- **Gale Krateri durumu:** Curiosity iniş sahası ve Sharp Dağı çevresinde yoğun şerit kapsama sahip; geniş harita boşluklarını `data/ctx/` altındaki 5 m'lik CTX görselleriyle (`gale_ctx_overview.png` ve `gale_ctx_detail_sharp_base.png`; WMTS capabilities dosyası `data/mars-trek/CTX_WMTSCapabilities.xml` içinde) tamamlamak gerekir.

### 2. HiRISE DTM (Sayısal Arazi Modeli)
- **Nedir:** Farklı açılardan çekilmiş HiRISE stereo görüntü çiftlerinden üretilen, ~1–2 m/piksel (Gale'de 25 set 1.01 m, 2 set 2.02 m) yatay aralıklı ve onlarca santimetre bağıl düşey hassasiyetli 3B yükseklik modelleridir (`.IMG` + gölgeli kabartma ve orto-görüntüler).
- **Astronota ne söyler:** Sharp Dağı tırmanışında gerçek eğim derecelerini, geçilemeyecek dik yamaçları, vadi/krater derinliklerini ve devrilme ya da kayma riski taşıyan tehlike bölgelerini çıkarır.
- **Sınırı ne:** Üretimi yoğun manuel işlem gerektirdiği için her stereo çiftten DTM çıkarılamaz (Gale Krateri'nde 27 adet mevcut); ayrıca gölgeli dik kayalıklarda ve düz kumullarda eşleştirme gürültüsü/boşlukları oluşabilir, küresel mutlak yüksekliği MOLA'ya bağlı (~±5 m) kalibre edilir.

### Tek Slaytlık Özet (4 Satır)
- **Veri:** MRO/HiRISE ~25 cm/px yüzey görüntüleri ve stereo çiftlerden üretilen ~1–2 m/px 3B arazi modelleri (DTM); PDS arşivinde Gale Krateri / Sharp Dağı için **27 adet** hazır DTM seti bulunur.
- **Astronota katkısı:** Kaya/engel dağılımını görsel olarak netleştirir (görüntü) ve tırmanılabilir eğimler ile tehlikeli uçurum/çukur bölgelerini (DTM) metrik doğrulukla haritalar.
- **Sınırı:** Şerit bazlı çalıştığı için kraterin tamamını kesintisiz kaplamaz; ~0.5 m altı engeller ve gölgeli/kumul bölgelerdeki stereo eşleştirme gürültüsü gözden kaçabilir.
- **Çözüm:** Kritik rota ve iniş noktalarında yüksek çözünürlüklü HiRISE, kapsam dışı kalan genel geçişlerde ise `data/ctx/` altındaki CTX görselleri (`gale_ctx_overview.png` ve `gale_ctx_detail_sharp_base.png`), `data/mola/` altındaki MOLA verisi ve `data/mars-trek/` altındaki WMTS capabilities dosyaları (`CTX_WMTSCapabilities.xml`, `MOLA_ClrShade_WMTSCapabilities.xml`) birlikte kullanılmalıdır.

---

## Gale Krateri / Sharp Dağı Hazır DTM Listesi (PDS `DTMCUMINDEX.TAB`)

Temel URL: `https://hirise-pds.lpl.arizona.edu/PDS/`

| # | Product ID | Açıklama | Enlem (`lat`) | Boylam (`lon` E) | Ölçek | PDS Yolu |
|---|---|---|---|---|---|---|
| 1 | `DTEEC_001488_1750_001752_1750_U02` | Layered outcrop in Gale Crater | -4.9488..-4.7206 | 137.2390..137.3540 | 1.01 m | `DTM/PSP/ORB_001400_001499/PSP_001488_1750_PSP_001752_1750/DTEEC_001488_1750_001752_1750_U02.IMG` |
| 2 | `DTEEC_006855_1750_007501_1750_A01` | Canyon in mound of sedimentary rocks in Gale Crater | -5.2217..-4.9504 | 137.1716..137.2895 | 1.01 m | `DTM/PSP/ORB_006800_006899/PSP_006855_1750_PSP_007501_1750/DTEEC_006855_1750_007501_1750_A01.IMG` |
| 3 | `DTEEC_008147_1750_007356_1750_H01` | Large dunes possibly of aqueous origin in Gale Crater | -5.3774..-5.0159 | 137.3813..137.5068 | 1.01 m | `DTM/PSP/ORB_008100_008199/PSP_008147_1750_PSP_007356_1750/DTEEC_008147_1750_007356_1750_H01.IMG` |
| 4 | `DTEEC_008437_1750_008938_1750_U01` | Layered outcrop in Gale Crater | -5.0304..-4.8169 | 138.2921..138.4076 | 1.01 m | `DTM/PSP/ORB_008400_008499/PSP_008437_1750_PSP_008938_1750/DTEEC_008437_1750_008938_1750_U01.IMG` |
| 5 | `DTEEC_009149_1750_009294_1750_U01` | Gale Crater filled channel and fan deposit | -4.9231..-4.6762 | 137.3530..137.4690 | 1.01 m | `DTM/PSP/ORB_009100_009199/PSP_009149_1750_PSP_009294_1750/DTEEC_009149_1750_009294_1750_U01.IMG` |
| 6 | `DTEEC_009505_1755_009571_1755_U01` | Characterize surface hazards and science of possible MSL rover landing site | -4.6757..-4.2514 | 137.4240..137.5670 | 1.01 m | `DTM/PSP/ORB_009500_009599/PSP_009505_1755_PSP_009571_1755/DTEEC_009505_1755_009571_1755_U01.IMG` |
| 7 | `DTEEC_009650_1755_009716_1755_U01` | Characterize surface hazards and science of possible MSL rover landing site | -4.8250..-4.4019 | 137.2350..137.3780 | 1.01 m | `DTM/PSP/ORB_009600_009699/PSP_009650_1755_PSP_009716_1755/DTEEC_009650_1755_009716_1755_U01.IMG` |
| 8 | `DTEEC_010573_1755_010639_1755_U01` | Possible MSL landing site in Gale Crater | -4.6344..-4.3546 | 137.3450..137.4670 | 1.01 m | `DTM/PSP/ORB_010500_010599/PSP_010573_1755_PSP_010639_1755/DTEEC_010573_1755_010639_1755_U01.IMG` |
| 9 | `DTEEC_011417_1755_011562_1755_U01` | Possible MSL landing site in Gale Crater | -4.6272..-4.2556 | 137.5440..137.6780 | 1.01 m | `DTM/ESP/ORB_011400_011499/ESP_011417_1755_ESP_011562_1755/DTEEC_011417_1755_011562_1755_U01.IMG` |
| 10 | `DTEEC_012340_1750_012195_1750_A01` | Grand canyon of Gale Crater | -5.3690..-5.0103 | 137.2912..137.4154 | 1.01 m | `DTM/ESP/ORB_012300_012399/ESP_012340_1750_ESP_012195_1750/DTEEC_012340_1750_012195_1750_A01.IMG` |
| 11 | `DTEEC_012551_1750_012841_1750_U01` | Sulfate and clay strata in Gale Crater | -5.0029..-4.6985 | 137.1590..137.2850 | 1.01 m | `DTM/ESP/ORB_012500_012599/ESP_012551_1750_ESP_012841_1750/DTEEC_012551_1750_012841_1750_U01.IMG` |
| 12 | `DTEEC_012907_1745_013540_1745_A01` | Sulfate beds in Gale Crater with possible repeating section | -5.4153..-5.2289 | 137.1548..137.2654 | 1.01 m | `DTM/ESP/ORB_012900_012999/ESP_012907_1745_ESP_013540_1745/DTEEC_012907_1745_013540_1745_A01.IMG` |
| 13 | `DTEEC_014186_1745_020410_1745_A01` | Exposure of layers in south Gale Crater with possible sulfates | -5.7277..-5.4059 | 138.2695..138.3931 | 1.01 m | `DTM/ESP/ORB_014100_014199/ESP_014186_1745_ESP_020410_1745/DTEEC_014186_1745_020410_1745_A01.IMG` |
| 14 | `DTEEC_016520_1750_016375_1750_A01` | Potential rhythmic layering in east Gale Crater with hydrated signature | -5.3754..-4.9252 | 138.4278..138.5666 | 1.01 m | `DTM/ESP/ORB_016500_016599/ESP_016520_1750_ESP_016375_1750/DTEEC_016520_1750_016375_1750_A01.IMG` |
| 15 | `DTEEC_017509_1745_017364_1745_A01` | Southern Gale Crater strata with possible sulfates and clays | -5.7705..-5.4005 | 138.2034..138.3374 | 1.01 m | `DTM/ESP/ORB_017500_017599/ESP_017509_1745_ESP_017364_1745/DTEEC_017509_1745_017364_1745_A01.IMG` |
| 16 | `DTEEC_017509_1745_017364_1745_H02` | Southern Gale Crater strata with possible sulfates and clays | -5.7713..-5.4026 | 138.2018..138.3352 | 1.01 m | `DTM/ESP/ORB_017500_017599/ESP_017509_1745_ESP_017364_1745/DTEEC_017509_1745_017364_1745_H02.IMG` |
| 17 | `DTEEC_017931_1745_017786_1745_A01` | Repeated sulfate and clay beds in west Gale Crater | -5.4954..-5.2159 | 137.0853..137.2020 | 1.01 m | `DTM/ESP/ORB_017900_017999/ESP_017931_1745_ESP_017786_1745/DTEEC_017931_1745_017786_1745_A01.IMG` |
| 18 | `DTEEC_018788_1755_018287_1755_A01` | Possible MSL rover landing site in Gale Crater covering north central mound | -4.7427..-4.4225 | 137.7510..137.8726 | 1.01 m | `DTM/ESP/ORB_018700_018799/ESP_018788_1755_ESP_018287_1755/DTEEC_018788_1755_018287_1755_A01.IMG` |
| 19 | `DTEEC_018854_1755_018920_1755_U01` | Possible MSL landing site in Gale Crater | -4.7146..-4.4579 | 137.3360..137.4570 | 1.01 m | `DTM/ESP/ORB_018800_018899/ESP_018854_1755_ESP_018920_1755/DTEEC_018854_1755_018920_1755_U01.IMG` |
| 20 | `DTEEC_019698_1750_019988_1750_U01` | Lower northwest portion of mound in Gale Crater | -5.0410..-4.7291 | 137.3120..137.4390 | 1.01 m | `DTM/ESP/ORB_019600_019699/ESP_019698_1750_ESP_019988_1750/DTEEC_019698_1750_019988_1750_U01.IMG` |
| 21 | `DTEEC_023957_1755_024023_1755_U01` | MSL landing site in Gale Crater | -4.7014..-4.4126 | 137.4290..137.5450 | 1.01 m | `DTM/ESP/ORB_023900_023999/ESP_023957_1755_ESP_024023_1755/DTEEC_023957_1755_024023_1755_U01.IMG` |
| 22 | `DTEEC_024234_1755_024300_1755_U01` | MSL rover landing site in Gale Crater | -4.7853..-4.5032 | 137.1860..137.3010 | 1.01 m | `DTM/ESP/ORB_024200_024299/ESP_024234_1755_ESP_024300_1755/DTEEC_024234_1755_024300_1755_U01.IMG` |
| 23 | `DTEEC_040770_1755_039280_1755_A01` | Gale Crater dunes and Curiosity rover | -4.7903..-4.5826 | 137.3350..137.4410 | 1.01 m | `DTM/ESP/ORB_040700_040799/ESP_040770_1755_ESP_039280_1755/DTEEC_040770_1755_039280_1755_A01.IMG` |
| 24 | `DTEEC_040770_1755_039280_1755_U01` | Gale Crater dunes and Curiosity rover | -4.7922..-4.5833 | 137.3350..137.4430 | 1.01 m | `DTM/ESP/ORB_040700_040799/ESP_040770_1755_ESP_039280_1755/DTEEC_040770_1755_039280_1755_U01.IMG` |
| 25 | `DTEEC_063319_1745_052242_1745_A01` | Fan material at alcove on southwestern Aeolis Mons | -5.5712..-5.3885 | 137.2675..137.3643 | 1.01 m | `DTM/ESP/ORB_063300_063399/ESP_063319_1745_ESP_052242_1745/DTEEC_063319_1745_052242_1745_A01.IMG` |
| 26 | `DTEED_018643_1745_019065_1745_A01` | Candidate MSL landing site in Gale Crater | -5.8035..-5.1783 | 138.3480..138.5115 | 2.02 m | `DTM/ESP/ORB_018600_018699/ESP_018643_1745_ESP_019065_1745/DTEED_018643_1745_019065_1745_A01.IMG` |
| 27 | `DTEED_062963_1760_062172_1760_A01` | Peace Vallis in Gale Crater | -4.1972..-3.8785 | 137.2406..137.3573 | 2.02 m | `DTM/ESP/ORB_062900_062999/ESP_062963_1760_ESP_062172_1760/DTEED_062963_1760_062172_1760_A01.IMG` |

---

## İndirme ve Dosya Yapısı Notu (Claude Code İçin)
- **Ham dosyalar repoda tutulmaz** (tek bir `.IMG` DTM ~360 MB, tam çözünürlüklü `*_RED_A_01_ORTHO.JP2` ~370–390 MB boyutundadır).
- **Tam çözünürlüklü veri:** Yukarıdaki `PDS Yolu` klasörünün içinde `*.IMG` (DTM), `*_RED_A_01_ORTHO.JP2` (0.25 m), `*_RED_C_01_ORTHO.JP2` (1.01 m), `*_IRB_*_ORTHO.JP2` ve `.LBL` etiket dosyaları bulunur.
- **Hafif önizleme / sunum görselleri:** Aynı klasör yolunun başına `EXTRAS/` eklendiğinde (`https://hirise-pds.lpl.arizona.edu/PDS/EXTRAS/DTM/...`) ~0.2–1.7 MB boyutunda hazır JPEG'ler alınabilir:
  - `*.cb.jpg` / `*.ca.jpg`: Renkli yükseklik haritası (colorized altimetry)
  - `*.sb.jpg` / `*.sa.jpg`: Gölgeli kabartma (shaded relief)
  - `*.br.jpg` / `*.ab.jpg`: Gri tonlu / etiketli önizleme
