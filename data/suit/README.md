# Astronot Kıyafeti (Uzay Giysisi / EVA) Kısıtları ve Performans Verisi

Bu doküman, Gale Krateri / Sharp Dağı yürüyüş (`Marswalk`) rota hesabına girdi sağlamak amacıyla yalnızca **NASA**, **NTRS** (*NASA Technical Reports Server*) ve **NASA PDS** kaynaklarından doğrulanmış uzay giysisi verilerini derler.

> **Önemli Ayrım Kuralı:**  
> - **Bölüm 1–5** altında yalnızca doğrulanmış NASA/Apollo/ISS/Artemis literatür verileri ve repodaki PDS ölçümleri yer alır; Mars yüzeyi için henüz uçuş sertifikalı bir giysi bulunmadığından doğrulanamayan değerler açıkça **`bulunamadı / doğrulanmadı`** olarak işaretlenmiştir.  
> - **Bölüm 6** ise yukarıdaki kaynaklı verilerden yola çıkarak rota algoritmamız için yaptığımız **kendi yorumumuzu ve önerilen parametre setini** ayrı bir bölüm olarak sunar.

---

## 1. Giysi Ağırlığı ve Astronotun Toplam Yükü (Kaynaklı Veriler)

* **Yerçekimi Çarpanı ve Atalet Kuralı:** Dünya yerçekimi $1\,g$ ($9,81\text{ m/s}^2$), Ay yerçekimi $\approx 0,166\,g$ ($1/6\,g$), Mars yüzey yerçekimi ise **$\approx 0,38\,g$** ($3,72\text{ m/s}^2$) düzeyindedir. Mars'ta giysinin hissedilen **ağırlığı (aşağı yönlü kuvvet)** Dünya değerinin `%38`'ine düşse de **eylemsiz kütlesi (ataleti / $m$)** `%100` aynı kalır; bu nedenle astronot hızlanma, yavaşlama, yön değiştirme ve düşmeyi durdurma sırasında tam kütlenin momentumuna karşı koymak zorundadır ([NASA NIAC Spacesuit Report – Dunbar, 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf), [NTRS 20240011717](https://ntrs.nasa.gov/api/citations/20240011717/downloads/IAC-24-A5_1_4%2020240011717%20-%20FINAL.pdf)).

### Giysi Nesillerine Göre Kütle ve Hissedilen Ağırlık Karşılaştırması

| Giysi Sistemi | Bileşen Dağılımı | Dünya Kütlesi ($1\,g$) | Ay Hissedilen ($0,166\,g$) | Mars Hissedilen ($0,38\,g$) *(Giysi)* | Mars Toplam Hissedilen *(Giysi + 80 kg Astronot)* | Kaynak |
|---|---|---|---|---|---|---|
| **Apollo `A7L` / `A7LB`** *(Ay yüzey giysisi)* | Basınç Giysisi (`PGA`) `~22 kg` (`~48–50 lb`) + Sırt Çantası (`PLSS`+`OPS`+sarf) `~26–74 kg` (`~57 lb` taban, tam donanımlı toplam `180–212 lb`) | **`82 – 96 kg`** (`180 – 212 lb`) | `~13,6 – 16 kg` (`~30 – 35 lb`) | **`~31,2 – 36,5 kg`** (`~68 – 80 lb`) | **`~61,5 – 66,9 kg`** *(toplam kütle 162–176 kg)* | [NASA JSC](https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/), [NASA SP-368](https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf) |
| **Shuttle / ISS `EMU`** *(Mikroyerçekimi giysisi)* | Basınç Giysisi (`SSA`) + `PLSS` + sarf malzemeleri + `SAFER` acil itki paketi | **`127 – 145 kg`** (`280 – 319 lb`) | *(Yüzey yürüyüşüne uygun değil)* | **`~48,3 – 55,1 kg`** (`~106 – 121 lb`) | **`~78,7 – 85,5 kg`** *(toplam kütle 207–225 kg)* | [NASA JSC](https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/), [Dunbar NIAC 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf) |
| **Artemis `xEMU` / Axiom `AxEMU`** *(Yeni nesil yüzey giysisi)* | Basınç Giysisi Sistemi (`PGS`) + Gelişmiş `PLSS` sırt çantası (tam yüklü) | **`~180 – 181 kg`** (`~400 lb altı`) | `~30 kg` (`~66 lb`) | **`~68,4 – 68,8 kg`** (`~150 lb`) | **`~98,8 kg`** *(toplam kütle ~260 kg)* | [NASA xEMU](https://www.nasa.gov/image-article/exploration-extravehicular-mobility-unit-xemu/), [NTRS 20240011717](https://ntrs.nasa.gov/api/citations/20240011717/downloads/IAC-24-A5_1_4%2020240011717%20-%20FINAL.pdf), [NTRS 20260002984](https://ntrs.nasa.gov/api/citations/20260002984/downloads/ICES_Final_415_Final_Copyright%20Statement%20Included.pdf) |
| **Mars Hedef Giysisi (Konsept)** | NASA NIAC / gezegen EVA çalışmalarında Mars $0,38\,g$ için hedeflenen hafif `PGS` + `PLSS` toplam kütlesi | **`~55 – 65 kg`** (`~120 – 143 lb` hedef) | `~9 – 11 kg` | **`~21 – 25 kg`** | **`~51 – 55 kg`** *(toplam kütle 135–145 kg)* | [Dunbar NIAC 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf) |
| **Uçuş Sertifikalı Nihai Mars Giysisi** | Mars yüzeyi için uçuş onayı almış operasyonel giysi kütlesi | **Bulunamadı** | **Bulunamadı** | **Bulunamadı** | **Bulunamadı** | *(Henüz geliştirme/konsept aşamasında)* |

* **ISS `EMU` Notu:** Shuttle / ISS `EMU` belden girişli ve alt gövde/kalça eklemleri gezegensel yürüme için tasarlanmamış bir mikro-yerçekimi giysisidir; yalnızca tarihsel ve teknolojik referans karşılaştırması için verilmiştir ([Dunbar NIAC 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf)).
* **Mars İçin Kritik Kütle Sorunu:** Ay'da ($0,166\,g$) `~30 kg` hissedilen `~180 kg`'lık bir Artemis sınıfı giysi, Mars'ta ($0,38\,g$) tek başına **`~68,5 kg`** sırt yüküne ulaşarak ciddi fiziksel yorgunluk ve bel/diz zorlanması doğurur ([Dunbar NIAC 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf)).

---

## 2. Yürüyüş Hızı ve Metabolik Harcama (Kaynaklı Veriler)

* **Apollo Saha Verisi (Gerçek Ay Yüzeyi Ölçümleri):**
  * **Örnekleme ve bilimsel çalışma sırasındaki ortalama yürüyüş hızı (Apollo 15–17):** **`1,1 – 1,6 km/saat`** (`0,31 – 0,44 m/s` / `0,7 – 1,0 mph`) ([NASA SP-368 / NTRS 19760019729](https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf)).
  * **Düz zeminde kesintisiz intikal (traverse) hızı:** **`2,0 – 3,0 km/saat`** (`0,55 – 0,83 m/s` / `1,2 – 1,8 mph`) ([NASA SP-368 / NTRS 19760019729](https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf)).
* **NASA EVA Traverse Planlama Hız Modeli (NTRS):**
  * NASA gezegensel yüzey rota planlama modellerinde temel yürüyüş hızı eğim yüzdesi $S$'ye bağlı olarak şu denklemle tanımlanır ([NTRS 20250005352](https://ntrs.nasa.gov/api/citations/20250005352/downloads/Presentation%20-%20Kim%20-%20Edited.pdf)):
    $$V = -0,01 \cdot S + 0,75\text{ m/s}$$
  * Düz veya hafif eğimli zeminde ($S \approx 0$) nominal konforlu yürüyüş hızı **`0,70 – 0,80 m/s`** (**`2,5 – 2,9 km/saat`**) düzeyindedir ([NTRS 20250005352](https://ntrs.nasa.gov/api/citations/20250005352/downloads/Presentation%20-%20Kim%20-%20Edited.pdf)).
* **Azami / Acil Geri Dönüş (*Walkback Contingency*) Yürüyüş Hızı:**
  * NASA'nın Ay Keşif Aracı (`LRV`) arızası senaryosunda astronotun üsse yaya dönüşü için belirlediği azami sürdürülebilir hız sınırları: **1 saate kadar `3,6 km/saat`** (`1,0 m/s` / `2,2 mph`), **1 saatten uzun yürüyüşlerde ise `2,7 km/saat`** (`0,75 m/s` / `1,7 mph`) ([NASA SP-368 / NTRS 19760019729](https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf)).
  * `NASA-STD-3001`, astronotların bu tür acil 10 km yürüyüş (walkback) gereksinimlerini karşılayabilecek aerobik kapasiteye ($\dot{V}\text{O}_{2\max}$) sahip olmasını şart koşar ([NASA-STD-3001 Vol 1 Rev C](https://standards.nasa.gov/sites/default/files/standards/NASA/C/nasa-std-3001-vol-1-rev-c-signature.pdf)).
* **Metabolik Harcama ve Basınçlı Giysi Cezası:**
  * Apollo yüzey EVA'ları boyunca ölçülen ortalama metabolik enerji harcaması **`200 – 350 kcal/saat`** (`~230 – 400 W`), ortalama oksijen tüketimi ($\dot{V}\text{O}_2$) ise **`800 – 1.000 mL/dk`** olarak kaydedilmiştir ([NASA SP-368 / NTRS 19760019729](https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf), [NTRS 20250005352](https://ntrs.nasa.gov/api/citations/20250005352/downloads/Presentation%20-%20Kim%20-%20Edited.pdf)).
  * Basınçlandırılmış giysi eklemlerinin bükülme direnci (*joint torque*) nedeniyle giysi içinde yürümenin metabolik maliyeti, Dünya'da giysisiz yürümeye kıyasla **`1,5 – 3,0 kat`** daha yüksektir ([Dunbar NIAC 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf)).
* **Doğrulanamayan / Bulunamayan:** Artemis `xEMU` / `AxEMU` ile Ay veya Mars yüzeyinde fiilen ölçülmüş yürüyüş hızı verisi henüz uçuş gerçekleşmediği için **`bulunamadı`** (yalnızca Dünya'daki kısmi yerçekimi/su altı simülasyon verileri mevcuttur).

---

## 3. Oksijen, Enerji ve Soğutma Suyu Süresi — Apollo, ISS EMU ve Artemis xEMU / AxEMU (Kaynaklı Veriler)

Üç giysi neslinin yaşam destek (`PLSS`) sınırları birbirine karıştırılmadan ayrı ayrı aşağıda verilmiştir:

### Karşılaştırma Tablosu

| Özellik | 1) Apollo `A7L` / `A7LB` | 2) Shuttle / ISS `EMU` | 3) Artemis `xEMU` / Axiom `AxEMU` |
|---|---|---|---|
| **Kullanım Ortamı** | Ay Yüzeyi (`1/6 g`, vakum) | Alçak Dünya Yörüngesi / ISS (`0 g`, vakum) | Ay / Gezegen Yüzeyi (vakum/kısmi $g$) |
| **Nominal EVA Süresi** | `A7L`: **`~4 – 5 saat`**<br>`A7LB` (Apollo 15–17): **`7 saat`** | **`7 – 8 saat`** *(tipik ~7 saat çıkış + hava kilidi)* | **`8 saat`** |
| **Acil Durum Yedeği** | **`+30 dakika`** (`OPS` – Oxygen Purge System) | **`+30 dakika`** (`SOP` – Secondary Oxygen Pack) | **`+1 saat`** acil/kontenjans rezervi *(toplam **9 saate kadar**)* |
| **Çalışma Basıncı ($\text{O}_2$)** | **`3,7 psi`** (`25,5 kPa`), `%100` $\text{O}_2$ | **`4,3 psi`** (`29,6 kPa`), `%100` $\text{O}_2$ | Nominal **`4,3 psi`** (`29,6 kPa`), ön-solunum ve DCS tedavisi için **`8,2 psi`**'a (`56,5 kPa`) kadar değişken |
| **$\text{CO}_2$ Temizleme Sistemi** | Tek kullanımlık **`LiOH`** (Lityum Hidroksit) kartuşu | Tek kullanımlık **`LiOH`** veya rejeneratif **`MetOx`** kanisteri | **`RCA`** (*Rapid Cycle Amine*) — iki yataklı vakum-rejeneratif amin sistemi (sürekli $\text{CO}_2$ + nem atar, doyma sınırı yok) |
| **Soğutma Yöntemi ve Suyu** | `LCG` + gözenekli plaka **süblimatör**; `A7LB`'de **`~3,9 – 5,4 kg`** besleme suyu | `LCVG` + **süblimatör**; **`~3,8 – 4,1 kg`** (`~8,5 – 9,0 lb`) su *(saatte `~0,5–0,6 kg` tüketim)* | `LCVG` + **`SWME`** (*Spacesuit Water Membrane Evaporator* – hidrofobik içi boş fiber membran); **`~4,1 – 4,5 kg`** su kapasitesi |
| **Güç (Batarya)** | Gümüş-çinko (`Ag-Zn`) batarya (`A7LB`'de **`~279 Wh`**) | Şarj edilebilir batarya (**`~26,6 Ah` / `~17 V`**) | Yüksek yoğunluklu Lityum-İyon (**`Li-Ion`**) batarya |
| **Kaynaklar** | [NASA SP-368](https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf), [NASA JSC](https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/) | [NASA JSC](https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/), [NTRS 20260002984](https://ntrs.nasa.gov/api/citations/20260002984/downloads/ICES_Final_415_Final_Copyright%20Statement%20Included.pdf) | [NASA xEMU](https://www.nasa.gov/image-article/exploration-extravehicular-mobility-unit-xemu/), [NTRS 20260002984](https://ntrs.nasa.gov/api/citations/20260002984/downloads/ICES_Final_415_Final_Copyright%20Statement%20Included.pdf), [NTRS 20240011717](https://ntrs.nasa.gov/api/citations/20240011717/downloads/IAC-24-A5_1_4%2020240011717%20-%20FINAL.pdf) |

* **Mars Yüzeyine Özel Soğutma Suyu Kısıtı (`SWME` / Süblimatör Sorunu):** Ay ve yörüngedeki yüksek vakumda suyu uzaya buharlaştırarak soğutan klasik süblimatörler ve `SWME` membran buharlaştırıcılar, Mars'ın `~6 – 10 mbar` $\text{CO}_2$ atmosferinde (suyun üçlü noktası civarındaki basınçta) buharlaşma verimini kaybeder. Bu nedenle Mars için geliştirilen yaşam destek sistemlerinde düşük basınçlı egzoz/vakum pompası desteği veya radyatör/faz değiştiren malzeme (*PCM*) hibrit soğutma çözümleri araştırılmaktadır ([NTRS 20260002984](https://ntrs.nasa.gov/api/citations/20260002984/downloads/ICES_Final_415_Final_Copyright%20Statement%20Included.pdf), [Dunbar NIAC 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf)).
* **Doğrulanamayan:** Mars yüzeyi için sertifikalı bir `PLSS` ünitesinin kesin Lityum-İyon batarya kapasitesi (`Wh`) ve `SWME` hibrit soğutma suyu tüketim hızı henüz operasyonel uçuş donanımı üretilmediği için **`bulunamadı`**.

---

## 4. Hareket Sınırları: Esneklik, Yorgunluk ve Düşme Riski (Kaynaklı Veriler)

> **Eğim Sınırları Atfı:** Astronotun tırmanabileceği/inebileceği azami eğim değerleri ve arazi eğim/pürüzlülük tehlike sınıfları zaten **[`data/slope-hazard/README.md`](../slope-hazard/README.md)** içinde ayrıntılı olarak yer almaktadır. Tekrara düşmemek için azami eğim sayıları burada tekrar edilmemiş, yalnızca giysinin kendi mekanik ve fizyolojik kısıtları ele alınmıştır.

1. **Basınçlandırma Torku (*Pressurized Joint Torque*) ve Doğal Yürüme Kısıtı:**
   * Giysi içi basınç (`3,7 – 4,3 psi`) kumaş katmanlarını gerginleştirerek eklemlerin bükülmesine karşı yay benzeri direnç ("balonlaşma") oluşturur. Her adım, yalnızca ileri yer değiştirme değil aynı zamanda kalça, diz ve ayak bileği eklemlerindeki basınç torkunu yenme işi gerektirir; bu durum yorgunluğu artırır ve adım boyunu kısaltır ([Dunbar NIAC 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf)).
2. **Eğilme, Diz Çökme ve Sırt/Bel Giriş Mimarisi:**
   * **Apollo `A7L/A7LB` ve ISS `EMU`:** Bel ve kalça hareketliliği sınırlı olduğu için astronotlar yerden doğrudan el ile örnek almakta zorlanmış, uzun saplı maşalar kullanmak veya bir dizi üzerine çökmek durumunda kalmıştır ([NASA SP-368](https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf)).
   * **Artemis `xEMU` / `AxEMU`:** Geleneksel belden giriş yerine **arkadan giriş kapağı (*rear-entry hatch*)** kullanan Sert Üst Gövde (`HUT`), **bel rulmanı (*waist bearing*)**, kalça/uyluk rulmanları ve yeni ayak bileği eklemleri sayesinde çömelme, diz çökme ve Ay'da "tavşan sıçrayışı" yerine doğal insan yürüyüşü yapabilme yeteneği kazandırılmıştır ([NASA xEMU](https://www.nasa.gov/image-article/exploration-extravehicular-mobility-unit-xemu/), [NTRS 20240011717](https://ntrs.nasa.gov/api/citations/20240011717/downloads/IAC-24-A5_1_4%2020240011717%20-%20FINAL.pdf)).
3. **Ağırlık Merkezi (*Center of Gravity - CG*) Kayması ve Düşme Riski:**
   * Sırtta taşınan ağır `PLSS` yaşam destek ünitesi, astronot + giysi sisteminin toplam kütle merkezini yukarı ve arkaya doğru çeker ([NTRS 20240011717](https://ntrs.nasa.gov/api/citations/20240011717/downloads/IAC-24-A5_1_4%2020240011717%20-%20FINAL.pdf)).
   * Apollo görevlerinde astronotlar kaygan regolit ve eğimli/engebeli zeminde birden çok kez düşmüştür; yüksek atalet (`82–180 kg` giysi kütlesi) nedeniyle düşerken kollarla müdahale etmek zorlaşmış, yerden tekrar doğrulmak ise ciddi metabolik efor gerektirmiştir ([NASA SP-368](https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf)).
   * Mars'taki $0,38\,g$ yerçekimi Ay'ın $0,166\,g$ yerçekiminin **`2,28 katı`** olduğu için düşüş anında yere çarpma enerjisi çok daha büyüktür; Gale Krateri / Sharp Dağı'ndaki keskin bazalt kayalar veya kutu örgüsü (*boxwork*) sırtları üzerine düşmek dış koruma katmanının delinmesi/yırtılması açısından kritik güvenlik riskidir ([Dunbar NIAC 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf)).
4. **Eldiven Yorgunluğu ve İnce Motor Kısıtları:**
   * Basınçlı eldivenlerde parmak bükme direnci ön kol kaslarında hızlı yorgunluğa, kavrama kuvveti kaybına ve uzun EVA'larda tırnak ayrılmasına (*onycholysis*) varan mekanik travmalara yol açar; bu nedenle jeolojik çekiç/örnek toplama duraklarında düzenli dinlenme ve alet ergonomisi zorunludur ([NASA-STD-3001 Vol 2](https://www.nasa.gov/reference/nasa-std-3001v2/), [NASA SP-368](https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf)).

---

## 5. Sıcaklık ve Radyasyon Koruması + `data/curiosity-rad` Karşılaştırması (Kaynaklı Veriler)

### A. Sıcaklık Çalışma Aralığı ve Mars Atmosferi Kısıtı
* **Giysi Tasarım Sıcaklık Aralığı:** Apollo, ISS `EMU` ve Artemis `xEMU` giysilerinin dış Termal ve Mikrometeorit Giysisi (`TMG` – Orthofabric, alüminize Mylar çok katmanlı yalıtım `MLI`, Neopren kaplı naylon ve Dacron katmanları) vakum ortamında **`-157°C` ile `+121°C`** (`-250°F` ile `+250°F`) arasındaki dış yüzey sıcaklıklarına dayanacak şekilde tasarlanmıştır ([NASA JSC](https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/), [NASA xEMU](https://www.nasa.gov/image-article/exploration-extravehicular-mobility-unit-xemu/)).
* **Gale Krateri Koşullarıyla Uyumu ve Atmosferik Isı Kaybı:** Gale Krateri'nde yıl boyu yüzey/hava sıcaklıkları kış geceleri yaklaşık **`-90°C` / `-100°C`** ile yaz gündüzleri **`0°C` / `+20°C`** arasında seyreder (`data/rems` ve `data/themis`); bu aralık giysinin `-157°C / +121°C` dış malzeme sınırlarının **tamamen içindedir**. Ancak Mars'taki `~6 – 10 mbar` $\text{CO}_2$ atmosferi, vakumda çalışmak üzere tasarlanan `MLI` katmanlarının arasına gaz girerek gaz iletimi (*gas conduction*) ve rüzgârla taşınım (*convection*) yaratmasına yol açar; bu da klasik `MLI`'nın yalıtım performansını düşürür ve Mars giysilerinde düşük basınçta çalışan aerojel/köpük tabanlı yalıtım gerektirir ([Dunbar NIAC 2022](https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf)).

### B. Radyasyon Koruması (Alansal Yoğunluk) ve `NASA-STD-3001` Limitleri
* **Giysinin Zırhlama Kalınlığı (*Areal Density*):** Uzay giysisinin yumuşak kumaş katmanları (`TMG` + basınç kesesi) radyasyon zırhlaması açısından yalnızca **`~0,2 – 0,5 g/cm²`** alansal yoğunluk sağlar; Sert Üst Gövde (`HUT`) ve sırt çantası (`PLSS`) arkasındaki bazı noktalarda bu değer yerel olarak **`~1 – 2,5 g/cm²`** seviyesine çıkar ([NTRS 20060046504](https://ntrs.nasa.gov/api/citations/20060046504/downloads/20060046504.pdf), [NTRS 20170005580](https://ntrs.nasa.gov/citations/20170005580)).
* **Neye Karşı Korur, Neye Karşı Koruyamaz?** Bu ince zırh yalnızca çok düşük enerjili elektronları ve düşük enerjili güneş protonlarını kısmen keserek deri/bazal tabaka dozunu azaltır. Buna karşılık yüksek enerjili **Galaktik Kozmik Işınları (`GCR` — yüzlerce MeV – GeV)**, güçlü **Güneş Parçacığı Olaylarının (`SPE`)** yüksek enerjili protonlarını (`>30–50 MeV`) ve Mars yüzeyinden geri saçılan ikincil nötronları **durduramaz** ([NTRS 20060046504](https://ntrs.nasa.gov/api/citations/20060046504/downloads/20060046504.pdf)).
* **`NASA-STD-3001` Radyasyon Limitleri:**
  * `NASA-STD-3001 Vol 1 Rev C` (`[V1 4031]`): Tasarım referansı bir Güneş Parçacığı Olayı (`SPE`) sırasında astronotun alacağı toplam etkin doz **`250 mSv`** (`250.000 µSv`) altında tutulmalıdır; kariyer toplam etkin doz sınırı **`600 mSv`**'dir ([NASA-STD-3001 Vol 1 Rev C](https://standards.nasa.gov/sites/default/files/standards/NASA/C/nasa-std-3001-vol-1-rev-c-signature.pdf)).
  * `NASA-STD-3001 Vol 2 (Section 11.0 Spacesuits)`: EVA sırasında aktif kişisel dozimetre taşınmasını ve uzay havası (SPE) izleme/uyarı sistemini zorunlu kılar ([NASA-STD-3001 Vol 2](https://www.nasa.gov/reference/nasa-std-3001v2/)).

### C. Repodaki `data/curiosity-rad` Verileriyle Doğrudan Karşılaştırma
Repomuzdaki **[`data/curiosity-rad/README.md`](../curiosity-rad/README.md)** (`MSL-M-RAD-3-RDR-V1.0`, [PDS PPI](https://pds-ppi.igpp.ucla.edu/data/MSL-M-RAD-3-RDR-V1.0/), `rad_daily_dose.csv`) verisinde, insan dokusuna yakın plastik sintilatör dedektörü (**Dedektör E**, BC-432) için Sol 1–4836 arasında seçilen 124 sol'de ölçülen yüzey **soğurulan doz hızı** değerleri şunlardır:

* **124 sol genel ortalaması (Dedektör E):** **`9,94 µGy/saat`** (`~239 µGy/gün`); günlük ortalamalar **`6,06 – 13,27 µGy/saat`** aralığında, medyan **`9,64 µGy/saat`**.
* **Güneş parçacığı olayı adayı sol'ler (`possible_sep = 1`):**
  * **Sol 351:** Tepe değer **`28,8 µGy/saat`** (sol içi medyan `8,6 µGy/saat`).
  * **Sol 390:** Tepe değer **`27,5 µGy/saat`** (sol içi medyan `8,5 µGy/saat`).
  * *(Ayrıca Sol 39'da `23,5 µGy/saat` kaydedilmiştir; bu değerler mSv cinsinden doz eşdeğeri değil, doğrudan soğurulan doz cinsinden `µGy/saat` verisidir ve kalite faktörü $Q(L)$ çarpımı yapılmamıştır — bkz. [`data/curiosity-rad/README.md`](../curiosity-rad/README.md)).*

**Karşılaştırma Sonucu:**  
1. Uzay giysisinin yumuşak katmanları (`~0,2–0,5 g/cm²`) Gale Krateri yüzeyindeki arka plan `GCR` radyasyonunu (`~9,94 µGy/saat`) kayda değer ölçüde azaltamaz.  
2. **8 saatlik** nominal bir EVA çıkışında astronot ortalama **`8 × 9,94 ≈ 79,5 µGy`** (sakin günlerde **`~48,5 – 106,2 µGy`**, Sol 351 tepe hızında **`~230 µGy`**) yüzey soğurulan dozuyla karşılaşır.  
3. Tekil bir sakin EVA günündeki doz, `NASA-STD-3001` sınırlarıyla karşılaştırıldığında anlık tehlike yaratmaz; ancak güçlü bir güneş fırtınası (`SPE`) sırasında giysi neredeyse hiç kalkan sağlamadığı için astronot `data/curiosity-rad` verisindeki ani artış eşiğine göre açık araziden çıkıp basınçlı keşif aracına, habitat sığınağına veya yüksek kaya/yar gölgesi altına sığınmak zorundadır.

---

## 6. Yorumumuz ve Rota Hesabı İçin Önerilen Parametreler *(Kaynaklı Verilerden Ayrı Bölüm)*

> **Not:** Bu bölüm doğrudan NASA teknik raporlarından kopyalanan sayılar değil; **Bölüm 1–5**'teki kaynaklı sınırları kullanarak *İnterstellear* Marswalk rota planlama algoritması için türettiğimiz **uygulama ve tasarım önerilerimizdir**.

| Rota Parametresi | Önerilen Değer (Algoritma Girdisi) | Dayandığı Kaynaklı Gerçek / Gerekçe |
|---|---|---|
| **Tek EVA Maksimum Süresi** | **`8 saat` toplam çalışma** *(maksimum `6 saat` aktif ilerleme + bilimsel durak, `2 saat` güvenlik/dönüş tamponu)* + **`1 saat` acil yedek** | Artemis `xEMU` / `AxEMU` nominal `8 saat` + `1 saat` rezerv standardı baz alınmıştır. |
| **Düz Zeminde Yürüyüş Hızı** | Intikal: **`2,2 – 2,5 km/saat`** (`~0,61–0,69 m/s`)<br>Örnekleme dahil efektif hız: **`1,2 – 1,5 km/saat`** | Apollo saha ortalaması (`1,1–1,6 km/saat` çalışma, `2,0–3,0 km/saat` intikal) ve NTRS `0,75 m/s` düz zemin hızı temel alınarak Mars'ta $0,38\,g$ sırt yükü payı düşülmüştür. |
| **Eğimli Zeminde Hız Formülü** | $V(S) = \max(0,25,\; 0,75 - 0,01 \cdot S)\text{ m/s}$ + [`data/slope-hazard/README.md`](../slope-hazard/README.md) geçilmez eğim maskesi | NTRS 20250005352 eğim hız modeli ile repodaki HiRISE DTM eğim tehlike katmanı birleştirilmiştir. |
| **Tek Yaya EVA Menzil Sınırı** | Rover/ara istasyon olmadan tek yön **en fazla `4 – 5 km`** (gidiş-dönüş toplam **`8 – 10 km`**) | `1,5–2,5 km/saat` hız, `6 saat` aktif süre ve `2 saat` acil dönüş (*walkback*) güvenliği. **Sonuç:** Bradbury Landing'den Boxwork bölgesine (`~15 km` kuş uçuşu) tek bir yaya EVA ile gidilemez; basınçlı rover destekli son-mil yürüyüşü veya çok sol'lü (*multi-sol*) kamp aşamaları planlanmalıdır. |
| **Toplam Yük Senaryoları (UI Seçeneği)** | **Senaryo A (Mevcut Teknoloji `xEMU`):** `~180 kg` giysi + `80 kg` astronot = **`~98,8 kg`** Mars ağırlığı (`260 kg` atalet)<br>**Senaryo B (Hedef Mars Giysisi):** `~60 kg` giysi + `80 kg` astronot = **`~53,2 kg`** Mars ağırlığı (`140 kg` atalet) | Kullanıcı arayüzünde giysi kütlesinin metabolik tüketim ve eğim tırmanma hızı üzerindeki farkını net gösterebilmek için iki ayrı profil önerilir. |
| **Termal ve Radyasyon Zamanlama Kuralı** | **Gündüz EVA Penceresi (`08:00 – 16:00 LMST`)** + `>25 µGy/saat` (`possible_sep = 1`) uyarısında **en yakın sığınağa/rover'a acil rota** | Mars'ta `MLI` gece soğuğunda (`-90°C`) verim kaybettiğinden sıcak gündüz saatleri tercih edilmeli; güneş fırtınasında giysi zırhsız kaldığından (`~0,2–0,5 g/cm²`) rota motoru otomatik geri çekilme çizmelidir. |

---

## 7. Doğrulanan Kaynak Linkleri

* NASA JSC – *Spacewalk & Spacesuit Basics*: https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/
* NASA – *Exploration Extravehicular Mobility Unit (xEMU)*: https://www.nasa.gov/image-article/exploration-extravehicular-mobility-unit-xemu/
* NASA NIAC (Bonnie Dunbar, 2022) – *A Novel Spacesuit Architecture for Mars Surface Operations*: https://www.nasa.gov/wp-content/uploads/2025/06/niac-2022-phi-dunbar-spacesuit-tagged.pdf
* NASA SP-368 / NTRS `19760019729` – *Biomedical Results of Apollo*: https://ntrs.nasa.gov/api/citations/19760019729/downloads/19760019729.pdf
* NTRS `20240011717` – *IAC-24 Exploration Spacesuit / xEMU & AxEMU Architecture*: https://ntrs.nasa.gov/api/citations/20240011717/downloads/IAC-24-A5_1_4%2020240011717%20-%20FINAL.pdf
* NTRS `20250005352` – *Lunar EVA Traverse Speed & Metabolic Planning*: https://ntrs.nasa.gov/api/citations/20250005352/downloads/Presentation%20-%20Kim%20-%20Edited.pdf
* NTRS `20260002984` – *Spacesuit PLSS / SWME & Mars Heat Rejection Studies*: https://ntrs.nasa.gov/api/citations/20260002984/downloads/ICES_Final_415_Final_Copyright%20Statement%20Included.pdf
* NTRS `20060046504` – *Space Radiation Shielding & Spacesuit Areal Density Analysis*: https://ntrs.nasa.gov/api/citations/20060046504/downloads/20060046504.pdf
* NTRS `20170005580` – *EVA Radiation Shielding & Transport Studies*: https://ntrs.nasa.gov/citations/20170005580
* `NASA-STD-3001 Volume 1 Rev C` – *Space Flight Human-System Standard: Crew Health*: https://standards.nasa.gov/sites/default/files/standards/NASA/C/nasa-std-3001-vol-1-rev-c-signature.pdf
* `NASA-STD-3001 Volume 2` – *Human Factors, Habitability, and Environmental Health*: https://www.nasa.gov/reference/nasa-std-3001v2/
* NASA PDS PPI – *Curiosity RAD Archive (`MSL-M-RAD-3-RDR-V1.0`)*: https://pds-ppi.igpp.ucla.edu/data/MSL-M-RAD-3-RDR-V1.0/
* Repo İçi Atıflar: [`data/slope-hazard/README.md`](../slope-hazard/README.md) ve [`data/curiosity-rad/README.md`](../curiosity-rad/README.md)
