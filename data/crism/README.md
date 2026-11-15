# CRISM mineral haritaları (MRO CRISM): Gale Krateri / Sharp Dağı

> Not: İlk sürüm takım üyesi Büşra'nın hazırladığı özetti. Bu sürüm 14 Kasım 2026'da NASA PDS Mars ODE REST servisinden gerçek sorguyla yeniden yazıldı. Sorguyu Liora (Claude) çalıştırdı. Düzeltilen yerler aşağıda "Düzeltmeler" bölümünde.

**Kaynak:** PDS Geosciences Node, MRO CRISM
https://pds-geosciences.wustl.edu/missions/mro/crism.htm
Ürün arama servisi: Mars ODE (Orbital Data Explorer), https://ode.rsl.wustl.edu/mars/

## Ne bulundu

Gale kutusunda (enlem -5.1..-4.5, doğu boylamı 137.3..137.8) **23 adet MTRDR (Map-projected Targeted Reduced Data Record) ürünü** var. Liste `gale_mtrdr_products.csv` dosyasında: ürün adı, gözlem tarihi, merkez ve sınır koordinatları, çözünürlük, hedef açıklaması ve ODE ürün/dosya sayfası linkleri.

Sorgu (tarayıcıda açılırsa JSON döner):
`https://oderest.rsl.wustl.edu/live2/?query=product&target=mars&results=m&ihid=MRO&iid=CRISM&pt=MTRDR&minlat=-5.1&maxlat=-4.5&westernlon=137.3&easternlon=137.8&output=JSON&limit=50`
(`results=c` eklenince ürün sayısı olan 23 görülür. `results=v` yanlış, boş sonuç verir.)

- **Tarih aralığı:** 2006-11-15 ile 2011-12-08 arası. ODE'deki MTRDR veri setinin tamamı için son gözlem 2012-05-21.
- **Çözünürlük:** `Map_resolution` alanı FRT ürünlerinde yaklaşık 3293 piksel/derece, HRL ve HRS ürünlerinde yaklaşık 1646 piksel/derece. Mars'ta 1 derece yaklaşık 59.27 km olduğundan bu yaklaşık **18 m/piksel** (FRT) ve **36 m/piksel** (HRL/HRS) eder. Bu m/piksel değerleri `Map_resolution` alanından bizim hesabımızdır, ODE'nin doğrudan verdiği bir değer değildir. CSV'deki `approx_m_per_px` sütunu bu hesaptır.
- **Dosya boyutu:** Bilinmiyor. Görüntü dosyaları repoya indirilmedi. Ürün sayfalarındaki dosyalar (hiperspektral küp, özet parametreler, browse görüntüleri) ürün başına büyük olabilir, indirmeden önce ODE ürün sayfasından bakılmalı.

### Boxwork ve iniş bölgesine yakın ürünler
- `frt000058a3_07_if165j_mtr3`: merkez -4.820, 137.444 ("MSL Site f"), Bradbury ve Sharp eteği yakını.
- `frt0000b6f1_07_if165j_mtr3`: merkez -4.802, 137.427 ("Gale höyüğü yamacında katmanlar ve kanal").
- `hrl0000baba_07_if182j_mtr3`: merkez -4.812, 137.425, aynı hedefin yüksek çözünürlüklü (36 m) kaydı.
- `hrl0001233b_07_if183j_mtr3`: merkez -4.850, 137.385 ("Gale'de sülfat ve kil katmanları").
- `frt0001bba1_07_if165j_mtr3`: merkez -4.820, 137.287 ("KB Gale'de olası sülfat ve kil katmanları").

## Parametre katmanları (Büşra'nın kontrolü; bağımsız doğrulanmadı)
- **PHY:** Fe/Mg fillosilikatlar ve smektitler (kil mineralleri).
- **HYD:** Genel hidratlı mineral göstergesi. Tek başına "sülfat" demek değildir.
- **SINDEX / MINORS:** Sülfat minerallerine özel parametreler.
- **ALT:** MTRDR parametre listelerinde böyle bir katman bulunamadı. Daha önceki nottan çıkarıldı.

## Sunum ve görev notu

- **Nedir?** Mars yüzeyindeki killer ve sülfatlar gibi suyla etkileşime girmiş mineralleri haritalayan hiperspektral yörünge verisidir.
- **Astronota ne söyler?** Su çıkarımı (ISRU) ve bilimsel numune toplama için en yüksek potansiyele sahip durak noktalarını gösterir.
- **Sınırı ne?** Sadece yüzeyin en üst mikrometrelik tabakasını görür. Kalın toz örtüsü altındaki ana kayayı maskeler. Bu 23 ürün tek tek hedefli görüntülerdir, tüm bölgeyi kesintisiz kaplamaz.

## Düzeltmeler (ilk nota göre)
- "2006-2018 arası MTRDR/TER ürünleri": Bu kutudaki ürünler **2006-2011** arasıdır, MTRDR veri seti 2012-05-21'e kadar gözlem içerir.
- "~18 m/piksel": FRT ürünleri için doğru. HRL ve HRS ürünleri yaklaşık 36 m/pikseldir.
- "ALT (kil/sülfat) ve HYD katmanları": ALT yok. Kil için PHY, genel hidratlı mineral için HYD, sülfat için SINDEX.

---

## Repoya eklenen browse görselleri (2026-11-14)

`browse/` klasöründe, yukarıdaki 5 ürün için PDS'in hazır **browse PNG** görselleri var. Her ürün için 3 görsel: **PHY**, **HYD** ve **HYS**. Toplam 15 dosya, ~6,3 MB. Hiperspektral I/F küpü **indirilmedi**: ürün başına yaklaşık 0,5–1,1 GB olduğu için.

| Ürün | Tarih | Çözünürlük | Görsel boyutu (piksel) |
|---|---|---|---|
| `frt000058a3_07_if165j_mtr3` | 2007-04-22 | ~18 m/px | 788 × 735 |
| `frt0000b6f1_07_if165j_mtr3` | 2008-07-09 | ~18 m/px | 775 × 714 |
| `hrl0000baba_07_if182j_mtr3` | 2008-07-20 | ~36 m/px | 425 × 658 |
| `hrl0001233b_07_if183j_mtr3` | 2009-04-23 | ~36 m/px | 551 × 916 |
| `frt0001bba1_07_if165j_mtr3` | 2010-11-06 | ~18 m/px | 760 × 680 |

Her ürünün 3 görseli aynı boyutta. Dosya adı `<ürün>_<br...j>_mtr3.png`: `brphyj` = PHY, `brhydj` = HYD, `brhysj` = HYS. Kaynak: PDS Geosciences `mrocr_4001/browse/...` (ürün sayfası linkleri `gale_mtrdr_products.csv` içinde). Sınırlar ve piksel bilgileri `bounds.json` içinde.

### Görseller ne gösteriyor

PNG'ler **3 bantlı renk bileşimleridir**, tek bir parametrenin haritası değildir. Aşağıdaki açıklamalar ürünlerin PDS etiketlerinden alınmıştır:

| Görsel | Bantlar (etiketteki sıra) | Etiketteki açıklama (özet) |
|---|---|---|
| PHY | D2300, D2200, BD1900R2 | Hidroksilli minerallerle (filosilikatlar dahil) ilgili. Mg/Fe-OH mineralleri kırmızı veya (hidratlı ise) macenta, Al/Si-OH mineralleri yeşil veya (hidratlı ise) camgöbeği görünebilir. Mavi diğer hidratlı mineralleri gösterebilir. |
| HYD | SINDEX2, BD2100_2, BD1900_2 | Minerallerdeki bağlı suyla ilgili. Çok hidratlı sülfatlar macenta, tek hidratlı sülfatlar sarı/yeşil görünebilir. Mavi diğer hidratlı mineraller olabilir. |
| HYS | MIN2250, BD2250, BD1900R2 | Si/Al-hidroksilli mineraller için tamamlayıcı. Hidratlı silika beyaz, Al-OH mineralleri veya diğer hidratlı mineraller daha mavi görünebilir. |

Etiketler, kesin mineral tanımı için CRISM spektrumlarının incelenmesi gerektiğini de söylüyor (Viviano-Beck ve diğerleri, 2014). **SINDEX**, HYD görselinin bantlarından biridir (SINDEX2), ayrı bir görsel olarak verilmemiştir.

### Sınırlar

- **Bantların R/G/B'ye eşlenmesi doğrulanmadı.** Etiket bant adlarını sıralıyor, ama hangi bandın kırmızı, yeşil ve mavi olduğu bu çalışmada doğrulanmadı. Renk yorumları için yukarıdaki etiket açıklamalarına bakılmalı.
- **Koordinat:** Sınırlar `gale_mtrdr_products.csv` içindeki ODE ayak izi sınırlarıdır (ek olarak her görselin genişlik ve yüksekliğinin, sınırlar ve piksel/derece değerinden hesaplanan boyutla 1 piksel içinde uyuştuğu kontrol edildi). Sayısal bir hizalama testi (örneğin MOLA ile) yapılmadı.
- **Görseller RGBA PNG:** Alfa kanalı, verisi olmayan alanları gösteriyor olabilir; bu doğrulanmadı.
- **Kapsam:** 5 ürün tek tek hedefli görüntüler, tüm bölgeyi kesintisiz kaplamaz. Tarihler 2007–2010 arasında.
- **Nicel analiz yok:** Bu görseller sunum için görsel katmandır. Mineral miktarı veya bolluğu çıkarmak için kullanılmamalı.
