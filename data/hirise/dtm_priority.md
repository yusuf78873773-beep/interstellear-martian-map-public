# HiRISE DTM Öncelik Listesi (5 Set)

Gale Krateri içindeki toplam 27 HiRISE DTM'in tamamını (~9–10 GB) indirmek yerine, uygulamada **(a) Kutu Örgüsü (Boxwork) ana hedef bölgesi** ile **(b) Bradbury Landing iniş noktasından (`-4.5895° G, 137.4416° D`) Sharp Dağı eteğine uzanan yürüyüş/araç rota koridorunu** kapsayan **en öncelikli 5 DTM** aşağıda sıralanmıştır.

- **Kaynak İndeks:** `https://hirise-pds.lpl.arizona.edu/PDS/INDEX/DTMCUMINDEX.TAB`
- **Doğrulama Notu:** Aşağıdaki dosya boyutlarının tamamı `https://hirise-pds.lpl.arizona.edu/PDS/` sunucusundan `HTTP HEAD Content-Length` ile doğrudan sorgulanıp bayt hassasiyetinde doğrulanmıştır.

---

## Seçilen Öncelikli 5 DTM (Önem Sırasıyla)

| Sıra | Ürün Adı (`Product ID`) | Enlem (`lat`) | Boylam (`lon` E) | Çözünürlük | Boyut (`Sunucu HEAD`) | Öncelik Gerekçesi |
|---|---|---|---|---|---|---|
| **1** | `DTEEC_019698_1750_019988_1750_U01` | `-5.0410° .. -4.7291°` | `137.3120° .. 137.4390°` | `1,01 m/px` | **`517,58 MiB`** (`542,72 MB` / `542.721.784` B) | Curiosity'nin gezdiği boxwork çekirdek alanının (`-4.811°..-4.797°`, `137.379°..137.387° D`) tamamını ve Sharp Dağı tırmanış yamacını tek parçada kapsayan ana arazi modelidir. |
| **2** | `DTEEC_009149_1750_009294_1750_U01` | `-4.9231° .. -4.6762°` | `137.3530° .. 137.4690°` | `1,01 m/px` | **`372,46 MiB`** (`390,55 MB` / `390.551.132` B) | Hem boxwork kampanya alanını hem de Sharp Dağı eteklerine tırmanan orta-üst rota koridorunu (`-4.68°..-4.81°`) kesintisiz kapsar. |
| **3** | `DTEEC_040770_1755_039280_1755_U01` | `-4.7922° .. -4.5833°` | `137.3350° .. 137.4430°` | `1,01 m/px` | **`294,13 MiB`** (`308,42 MB` / `308.422.800` B) | Bradbury Landing (`-4.5895°, 137.4416° D`) kenarından başlayıp Bagnold kumulları üzerinden Sharp Dağı eteğine (`-4.79°`) ulaşan ana rota koridorunu birbirine bağlar. |
| **4** | `DTEEC_023957_1755_024023_1755_U01` | `-4.7014° .. -4.4126°` | `137.4290° .. 137.5450°` | `1,01 m/px` | **`436,72 MiB`** (`457,94 MB` / `457.936.380` B) | Başlangıç noktası Bradbury Landing'i (`-4.5895°, 137.4416° D`), Yellowknife Bay çevresini ve rotanın ilk kilometrelerini yüksek çözünürlükle modeller. |
| **5** | `DTEEC_001488_1750_001752_1750_U02` | `-4.9488° .. -4.7206°` | `137.2390° .. 137.3540°` | `1,01 m/px` | **`343,71 MiB`** (`360,40 MB` / `360.402.944` B) | NASA'nın `PIA26306` boxwork fotoğrafının üretildiği `PSP_001752_1750` şeridini kapsayarak boxwork kuşağının batı uzantısını tamamlar. |

> **Toplam boyut (5 `.IMG` DTM dosyası):** `2.060.035.040` bayt (**`1.964,60 MiB`** / **`2,06 GB`**). Eğer prototipte en hızlı başlangıç için tek DTM çekilecekse yalnızca **1 numaralı** `DTEEC_019698_1750_019988_1750_U01` (~`517,6 MiB`) indirilebilir; rota analizinin tamamı için ilk **4 set** (`1.620,89 MiB` / `1,70 GB`) Bradbury → Boxwork hattını uçtan uca bağlar.

---

## Doğrudan İndirme Linkleri (`.IMG` — Ham 32-Bit Yükseklik Modeli)

1. **`DTEEC_019698_1750_019988_1750_U01` (`517,58 MiB`):**
   `https://hirise-pds.lpl.arizona.edu/PDS/DTM/ESP/ORB_019600_019699/ESP_019698_1750_ESP_019988_1750/DTEEC_019698_1750_019988_1750_U01.IMG`
2. **`DTEEC_009149_1750_009294_1750_U01` (`372,46 MiB`):**
   `https://hirise-pds.lpl.arizona.edu/PDS/DTM/PSP/ORB_009100_009199/PSP_009149_1750_PSP_009294_1750/DTEEC_009149_1750_009294_1750_U01.IMG`
3. **`DTEEC_040770_1755_039280_1755_U01` (`294,13 MiB`):**
   `https://hirise-pds.lpl.arizona.edu/PDS/DTM/ESP/ORB_040700_040799/ESP_040770_1755_ESP_039280_1755/DTEEC_040770_1755_039280_1755_U01.IMG`
4. **`DTEEC_023957_1755_024023_1755_U01` (`436,72 MiB`):**
   `https://hirise-pds.lpl.arizona.edu/PDS/DTM/ESP/ORB_023900_023999/ESP_023957_1755_ESP_024023_1755/DTEEC_023957_1755_024023_1755_U01.IMG`
5. **`DTEEC_001488_1750_001752_1750_U02` (`343,71 MiB`):**
   `https://hirise-pds.lpl.arizona.edu/PDS/DTM/PSP/ORB_001400_001499/PSP_001488_1750_PSP_001752_1750/DTEEC_001488_1750_001752_1750_U02.IMG`

- *(Not: `README.md` içinde yer alan `DTEEC_040770_1755_039280_1755_A01` ile yukarıdaki `_U01` aynı bölgenin USGS üretimi sürümüdür; `_U01` dosyası 13–14 m yakınlıkla tam aynı kutuyu kaplar ve doğrudan boyut doğrulaması yapılmıştır.)*
- *(Her `.IMG` dosyasının aynı klasördeki önizleme görsellerine `https://hirise-pds.lpl.arizona.edu/PDS/EXTRAS/DTM/...` altından, metadata/projeksiyon etiketine ise `.IMG` yerine `.LBL` uzantısıyla ulaşılabilir.)*
