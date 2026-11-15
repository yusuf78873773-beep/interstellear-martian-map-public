# NASA Ames Mars İklim Simülasyonu (MCMC)

> Not: Bu not takım üyesi Büşra'nın hazırladığı özet. İçeriği kaynak sayfasından ayrıca doğrulanmadı.

**Kaynak:** NASA Ames Mars Climate Modeling Center
https://data.nas.nasa.gov/mcmcref/

**Gale Krateri uygunluğu:** Kısmi uyumlu. Makro iklim için doğrudan geçerli. Krater içi yerel rüzgârlar için topoğrafya/DEM verisiyle desteklenmelidir.

## Sunum ve görev notu

- **Nedir?** Mars atmosferinin yıllık sıcaklık, yüzey basıncı, rüzgâr ve toz yoğunluğu döngülerini simüle eden 3 boyutlu küresel iklim modelidir.
- **Astronota ne söyler?** Termal koruma, güneş paneli tozlanma riski ve araç dışı etkinlik (EVA) için güvenli hava pencerelerini bildirir.
- **Sınırı ne?** Küresel grid çözünürlüğü kaba olduğu için Gale Krateri'ndeki dik yamaçların yarattığı yerel rüzgâr türbülanslarını tek başına yakalayamaz.

## Önerilen veri klasörü

`/data/climate/`: Yıllık L_s (0°-360°) döngüsü için yüzey sıcaklığı (Ts), basınç (Ps), rüzgâr (U, V) ve toz optik derinliği (tau).

> Not: Bu model çıktısıdır, gözlem değildir. Uygulamada "model" rozetiyle gösterilmelidir.

## Doğrulanan dosya adları (14 Kasım 2026)

Veri dizini: https://data.nas.nasa.gov/legacygcm/legacygcm/ACTIVECLDS_NCDF/ (listeleme 200 döndü, 68 `.nc` dosyası).

- **Ls 70-74 civarı (uzak güneş mevsimi):** `LegacyGCM_Ls070_Ls074.nc`
- **Ls 250 civarı (toz fırtınası mevsimi):** Dilimler düzensiz adlandırılmış. `LegacyGCM_Ls250_Ls254.nc` diye bir dosya yok. Ls 250'yi kapsayan dosya `LegacyGCM_Ls247_Ls253.nc`, sonrası `LegacyGCM_Ls254_Ls259.nc`.
- **Boyut:** Dilim başına yaklaşık 279 MB (Büşra'nın okuduğu değer, sunucudan bu iki dosya için doğrulanmadı). Tek dosyalık tam yıl `LegacyGCM_1year.nc` yaklaşık 18 GB, uygulama için kullanılmayacak.
- **Dosya indirme testi yapılmadı.** Bu iki dosyanın indirilebilirliği henüz denenmedi.
- **Grid çözünürlüğü:** Bulunamadı. "5° x 5° civarı" ifadesi tahmindir, doğrulanmadı. Gale bu hücre boyutuna göre çok küçük bir alandır, bölgesel yorum için DEM ile desteklenmelidir.
- **Değişkenler:** Yüzey sıcaklığı (`ts`), yüzey basıncı (`ps`), rüzgâr (`u`, `v`) ve sütun toz optik derinliği (`taudust`). Büşra dokümandan okuyarak yazdı, dosyanın içinden doğrulanmadı.
