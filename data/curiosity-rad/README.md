# Curiosity RAD surface radiation (MSL-M-RAD-3-RDR-V1.0)

Source: NASA PDS Planetary Plasma Interactions node
https://pds-ppi.igpp.ucla.edu/data/MSL-M-RAD-3-RDR-V1.0/

- INDEX.TAB: list of every RAD product (5,569 rows; first 218 are CRUISE, the rest are on Mars at Gale Crater).
- sample/: one label (.LBL) and the shared structure files (.FMT) so the format can be read.
- The actual data are one .TXT per sol and each is very large (the sample sol is about 18.7 MB), so the raw files are NOT stored in this repo.
  Download only the sols you need: BASE + /DATA/<SOL_RANGE>/<PRODUCT_ID>.TXT (path column in INDEX.TAB).
- Each .TXT holds counters, histograms, dosimetry and PHA data; dosimetry is the part that gives dose rate.

---

## Çıkarılan doz hızı

Eklenme tarihi: 2026-11-14. Dosya: `rad_daily_dose.csv` (124 satır, ~14 KB). Ham `.TXT` dosyaları repoda **yok**: her biri indirilip işlendikten sonra silindi.

### Birim

Doz hızı **µGy/saat**, yani **soğurulan doz** (microGray per hour). Bu **doz eşdeğeri (mSv) değildir**. Kalite faktörüyle mSv'ye **çevirmedim**: **bu dosyada mSv yok**. (RAD belgeleri, doz eşdeğerini LET dağılımının kalite faktörü Q(L) ile entegre edilmesiyle tanımlıyor. Bu hesap burada yapılmadı.) Basit çevrim: 1 µGy/saat × 24 = 24 µGy/gün.

### Hangi tablo, hangi sütun

- **Kaynak:** `MSL-M-RAD-3-RDR-V1.0`. Her sol için tek `.TXT` dosyası, içinde yaklaşık 15 dakikalık gözlemler.
- **Kullanılan değer:** Her gözlemdeki `[DOSIMETRY_TOTAL_DOSE_E: NN]` (ve karşılaştırma için `[DOSIMETRY_TOTAL_DOSE_B: NN]`) toplam doz hızı. Birim, etiketteki tanıma göre `microGray / Hour`. Tanım: RAD_RDR_SIS bölüm 4.2.1.6, ve `sample/` altındaki `.LBL` etiketi.
- **Günlük değer:** O sol'deki geçerli gözlemlerin **basit ortalaması**, en düşüğü ve en yükseği. Ortalama, gözlem süresine göre ağırlıklandırılmadı.

### Hangi dedektör: E, ve neden

- **E:** Plastik sintilatör (BC-432). Ana değer olarak E'yi seçtim, çünkü plastik hidrokarbon bir malzeme ve insan dokusuna silikondan daha yakın. **RAD belgeleri bu karşılaştırmayı yapmıyor, bu bizim gerekçemiz.**
- **B:** Silikon katı hal dedektörü. Karşılaştırma için ayrı sütunlarda (`dose_B_*`) duruyor. 124 günün ortalaması B için 9,65, E için 9,94 µGy/saat.
- **A:** A1 (dış) ve A2 (iç) silikon halkalar, parçacığın girişini belirleyen dedektör. Ürünlerde **A için ayrı doz değeri yok**, sadece B ve E dozu var. Bu yüzden A'dan doz çıkarılmadı.

### Kalite filtresi (QC) ve elenen gözlemler

Her gözlemin bir `QC` bayrağı var (SIS 4.2.1.2: `00000000` = sorun yok, `00000001` = bilinmeyen kalite sorunları olabilir, `00000100` = RAD DAN modunda, yani rover'ın nötron üreteci açıkken). İşlenen dosyalarda sadece `00000000` ve `00000001` görüldü. **Yalnızca `QC = 00000000` olan gözlemler** kullanıldı.

- İşlenen 125 dosyada (atlanan sol 2340 dahil) toplam **17.983 gözlem** vardı, bunların **619'u (%3,4)** `00000001` olduğu için elendi. Elenen gözlemler **103 sol'e** dağılmış durumda.
- CSV'de her sol için `n_obs_used` (kullanılan gözlem sayısı) ve `n_obs_qc_excluded` (QC ile elenen gözlem sayısı) sütunları var.

### CSV sütunları

`sol`, `date_utc`, `dose_E_mean`, `dose_E_min`, `dose_E_max`, `dose_B_mean`, `dose_B_min`, `dose_B_max`, `n_obs_used`, `n_obs_qc_excluded`, `unit` (`uGy/h`), `possible_sep`, `product_id` (kaynak ürün adı).

`date_utc` o sol'ün dosyasındaki **ilk gözlemin başlangıç zamanı** (`INDEX.TAB` içindeki `START_TIME`), sol'ün tam tarihi değil. Aralık: 2012-08-07 – 2026-03-14.

### Seçilen sol'ler

Sol 0–4843 arasında **her 39 sol'de bir** hedef alındı (125 hedef). Hedef sol'ün verisi yoksa en yakın sol kullanıldı: **0 yerine 1, 2184 yerine 2175, 2574 yerine 2580, 2808 yerine 2807**. Bir sol için birden fazla ürün varsa ilki alındı. Sonuçta CSV'deki **124 sol**:

1, 39, 78, 117, 156, 195, 234, 273, 312, 351, 390, 429, 468, 507, 546, 585, 624, 663, 702, 741, 780, 819, 858, 897, 936, 975, 1014, 1053, 1092, 1131, 1170, 1209, 1248, 1287, 1326, 1365, 1404, 1443, 1482, 1521, 1560, 1599, 1638, 1677, 1716, 1755, 1794, 1833, 1872, 1911, 1950, 1989, 2028, 2067, 2106, 2145, 2175, 2223, 2262, 2301, 2379, 2418, 2457, 2496, 2535, 2580, 2613, 2652, 2691, 2730, 2769, 2807, 2847, 2886, 2925, 2964, 3003, 3042, 3081, 3120, 3159, 3198, 3237, 3276, 3315, 3354, 3393, 3432, 3471, 3510, 3549, 3588, 3627, 3666, 3705, 3744, 3783, 3822, 3861, 3900, 3939, 3978, 4017, 4056, 4095, 4134, 4173, 4212, 4251, 4290, 4329, 4368, 4407, 4446, 4485, 4524, 4563, 4602, 4641, 4680, 4719, 4758, 4797, 4836

**Atlanan sol:** **2340** (`RAD_RDR_2019_065_20_52_2340_V00`). Dosyada 87 gözlem ve hepsi QC'den geçti, ama okunabilir sayısal `TOTAL_DOSE_E` değeri bulunamadı. Sebebi **incelenmedi, doğrulanmadı**. Bu hedef sol için başka sol aranmadı. Bu yüzden CSV'de **124 sol** var (hedef 125).

### Veri olmayan sol'ler (boşluklar)

`INDEX.TAB`'da hiç ürün olmayan iki büyük aralık var:

| Sol aralığı | Sol sayısı | Yaklaşık tarih | Yerine alınan |
|---|---|---|---|
| 2176–2203 | 28 | 2018-09-19 – 2018-10-17 | 2175 (hedef 2184) |
| 2539–2579 | 41 | 2019-09-27 – 2019-11-07 | 2580 (hedef 2574) |

- **2018 boşluğu:** Zamanlama JPL'in duyurduğu Curiosity bilgisayar/hafıza arızasıyla örtüşüyor: arıza 15 Eylül 2018'de başladı, 3 Ekim 2018'de yedek bilgisayara (Side-A) geçildi (kaynak: https://www.jpl.nasa.gov/news/curiosity-on-the-move-again/). RAD arşivi bu boşluğun sebebini **söylemiyor**. RAD'ın bu arıza yüzünden kapalı ya da ölçümsüz kaldığı **doğrulanmadı**: sebebi doğrulanmadı.
- **2019 boşluğu:** Sebebi için bir kaynak bulamadım: **sebebi doğrulanmadı**.
- Daha küçük boşluklar da var (örneğin sol 445–452, 479–484). Bunlar seçilen sol'leri etkilemedi.

### Bilinen sınırlar

- **Güneş parçacığı olayı bayrağı (`possible_sep`):** Sol içindeki en yüksek E değeri, o sol'ün gözlemlerinin medyanının **3 katından** büyükse 1. Bu bizim hesaplama kuralımız, **kesin tespit değil** ve bilinen bir olay listesiyle karşılaştırılmadı. İki sol işaretlendi: **351** (en yüksek 28,8, medyan 8,6) ve **390** (27,5 ve 8,5). Sol 39'daki 23,5 değeri 3 katın altında kaldığı için işaretlenmedi.
- **Örnekleme:** Her 39 sol'de bir örnek alındığı için kısa süren olaylar (güneş fırtınaları dahil) örneğe girmemiş olabilir. CSV, görev boyunca değişimi gösterir, her olayı değil.
- **Gözlem sayısı değişken:** Sol başına kullanılan gözlem sayısının ortancası 84 (en çok 89), ama bazılarında çok az: sol 2379 (3 gözlem), 2613 (5), 2769 (9), 1 (14), 2730 (21), 234 (24). Bu sol'lerin ortalaması günü temsil etmeyebilir.
- **Zaman hataları:** Arşivin ERRATA dosyası (sürüm 1–3 notu) dosyaların yaklaşık %20'sinde zaman hataları olduğunu söylüyor. Bunun doz değerlerini etkileyip etkilemediği **incelenmedi**.
- **Astronot dozu değil:** Değerler rover üzerindeki RAD'ın ölçümü. Rover gövdesinin ve cihazın çevresindeki malzemenin etkisi bu çalışmada **incelenmedi**. Astronotun alacağı doz olarak doğrudan kullanılmamalı, sunumda yaklaşık bir referans olarak gösterilmeli.
- **Genel görünüm:** 124 günün ortalaması E için **9,94 µGy/saat** (~239 µGy/gün). Günlük ortalamalar 6,06 ile 13,27 µGy/saat arasında, medyan 9,64.
- **İndirme:** Toplam indirme yaklaşık 6,9 GB oldu (ham dosyalar silindi).
