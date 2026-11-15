# Astronot ve Yüzey Aracı İçin Eğim ve Tehlike Eşikleri

Gale Krateri / Sharp Dağı rota planlamasında HiRISE DTM ve MOLA eğim katmanlarını renklendirmek için derlenen resmi NASA eğim sınırları ve proje tasarım önerisi.

> **Önemli Ayrım:** Bölüm 1'deki tüm sayısal eşikler doğrudan NASA / JPL / Apollo / Artemis dokümanlarından ve Gale Krateri telemetrisinden alınmıştır. Bölüm 2'deki "Yeşil / Sarı / Kırmızı" harita renk eşikleri ise bu kaynaklı sınırlara dayanan **proje tasarım önerisidir**.

---

## 1. Kaynaklı NASA / Görev Eğim Değerleri

| Kategori / Sistem | Ölçüt | Doğrulanmış Değer | Kaynak Linki |
|---|---|---|---|
| **Yürüyen Astronot (EVA — Operasyonel Sınır)** | Planlama azami yürüme / inme / yan geçiş eğimi | **`20°`'ye kadar** *(pürüzlülük ve gevşek zemine bağlı)* | NASA EVA ConOps PDF: `https://www.nasa.gov/wp-content/uploads/2020/01/topic_1-_eva_lunar_surface_concept_of_operations.pdf` & LPSC 2025: `https://www.hou.usra.edu/meetings/lpsc2025/pdf/2023.pdf` |
| **Yürüyen Astronot (Apollo 15 & 17 Saha Verisi)** | Gevşek regolitte metabolik yük / kayma eşiği | **`15°–20°`** yerel yamaçlar zorlayıcı; **`>15°–20°`** ciddi yorgunluk ve kayma | LPSC 2025 Apollo EVA Eğim Çalışması: `https://www.hou.usra.edu/meetings/lpsc2025/pdf/2023.pdf` |
| **Yüzey Araçları (Gevşek Yamaç & Krater Duvarı Kısıtı)** | Gevşek (friable) yamaçlarda tipik rover hareket limiti (`30°–35°`) ve regolit durma açısı / dik krater duvarı (`35°–40°`) | **`30°–35°`** hareket sınırı; **`35°–40°`** regolit durma açısı | NASA GRC *Exploration Rover Concepts* PDF (AIAA–2005–2525): `https://www.nasa.gov/wp-content/uploads/2015/06/exploration_rover_concepts_grc.pdf` |
| **Apollo Lunar Roving Vehicle (LRV)** | Tam yüklü tasarım tırmanma ve iniş sınırı | **`25°`** *(0,5 km mesafe)* | NASA NTRS `20100000019`: `https://ntrs.nasa.gov/api/citations/20100000019/downloads/20100000019.pdf` & `19930004820`: `https://ntrs.nasa.gov/api/citations/19930004820/downloads/19930004820.pdf` |
| **Apollo LRV (Statik Devrilme)** | Tam yüklü pitch / roll statik devrilme sınırı | **`45°`** | NASA NTRS `19930004820`: `https://ntrs.nasa.gov/api/citations/19930004820/downloads/19930004820.pdf` |
| **Artemis Lunar Terrain Vehicle (LTV)** | Mürettebatlı/teleoperasyon güvenli çalışma eğim sınırı | **`20°`** | NASA Moonbase Systems: `https://www.nasa.gov/moonbase-systems/` & NASA NTRS: `https://ntrs.nasa.gov/api/citations/20230016699/downloads/Sim_Series_2_Rover_Teleops_to_Support_EVA_Rev.pdf?attachment=true` |
| **Mars Basınçlı Rover (Pressurized Rover)** | Resmi yayımlanmış Mars basınçlı araç azami eğim açısı | **Bulunamadı / Doğrulanmadı** *(kamuya açık Mars araç şartnamesinde sabit tek açı yok; Ay LTV'deki `20°` eşiği en yakın resmi referanstır)* | — |
| **Curiosity (MSL) — Mekanik Sınır** | Rocker-Bogie süspansiyon statik devrilme sınırı | **`45°`** | NASA JPL Bülteni: `https://www.nasa.gov/solar-system/nasas-curiosity-mars-rover-takes-a-new-selfie-before-record-climb/` |
| **Curiosity (MSL) — Mars Rekoru** | Greenheugh Pediment tırmanışı (Mart 2020 / Sol `2696`) | **`31°`** *(Opportunity rekoru `32°`; tekerlek patinajı yaşandı)* | NASA JPL Bülteni: `https://www.nasa.gov/solar-system/nasas-curiosity-mars-rover-takes-a-new-selfie-before-record-climb/` |
| **Curiosity — Boxwork Gerçek Eğim** | Boxwork bölgesinde (`Sol 4534–4845`) araç telemetrisi | **`22,81°`** maksimum bileşik eğim (`|pitch| = 22,80°`, `|roll| = 16,26°`) | NASA PDS `localized_interp.csv`: `https://planetarydata.jpl.nasa.gov/img/data/msl/msl_places/data_localizations/localized_interp.csv` |

---

## 2. ÖNERİ: Harita İçin Yeşil / Sarı / Kırmızı Sınıflandırması (Proje Tasarım Kararı)

> **Not:** Bu tablo doğrudan NASA'dan alınmış sabit bir renk standardı **değildir**; Bölüm 1'deki resmi `15°` (Apollo saha yorgunluk başlangıcı), `20°` (NASA EVA + Artemis LTV operasyonel sınırı) ve `25°` (Apollo LRV tasarım sınırı) referanslarına dayanılarak **tarafımızdan önerilen** harita sınıflandırmasıdır.

| Renk / Sınıf | Eğim Aralığı | Anlamı ve Rota Kararı | Dayandığı Referans |
|---|---|---|---|
| **Yeşil (Güvenli)** | **`0° – 15°`** | Hem yaya astronot hem de basınçlı/keşif aracı için normal, düşük riskli geçiş alanı. | Apollo saha deneyiminde `<15°` eğimlerde metabolik yükün aşırı tırmanmaması (`LPSC 2025`). |
| **Sarı (Dikkat / Koşullu)** | **`15° – 20°`** | Yaya astronot ve Artemis LTV operasyonel üst sınırına (`20°`) yaklaşan bölge. Sağlam ana kayada (`bedrock`) kontrollü geçilebilir; ancak gevşek kumlu bölgelerde (`Bagnold` kumulları / `boxwork` çukurları) kayma ve yüksek oksijen tüketimi nedeniyle kaçınılmalıdır. | NASA EVA ConOps ve Artemis LTV **`20°`** sınırı; Apollo 15/17 **`15°–20°`** deneyimi. |
| **Kırmızı (Tehlikeli / Yasak)** | **`> 20°`** *(ve **`> 25°`** aşırı kritik)* | Yaya astronot (`20°`) ve Artemis LTV (`20°`) resmi operasyonel sınırını aşar; rota planlayıcı yürüyüş/basınçlı araç rotasını bu hücrelerden uzaklaştırmalıdır. `25°` üzeri insanlı Apollo LRV tasarım sınırını da aşar (`Curiosity` insansız olarak boxwork'te en fazla `22,81°`, Greenheugh rekorunda `31°` görmüştür). | NASA EVA & LTV **`20°`**, Apollo LRV **`25°`**, Curiosity **`22,81°` / `31°`**. |
