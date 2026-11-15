# Tutarlılık kontrolü

Bu dosya `data/MANIFEST.csv` ile birlikte otomatik üretildi.

## (a) README'lerde adı geçen dosyalar repoda var mı?

README'lerdeki `geri tırnak` içinde ve dosya uzantılı adlar tarandı (sadece ad üzerinden, klasör farkı gözetilmeden; URL satırları atlandı). Adları bu repodaki dosya adlarına benzeyip (`gale_`, `rad_`, `rems_`, `chemcam_`, `apxs_`, `bounds`, `photos`...) repoda **bulunmayanlar**: 0

Yok.

Bunların dışında README'lerde geçen ve **kaynak sunucudaki** dosya adları (PDS/ODE ürünleri, `.IMG`, `.nc`, ham tablolar ve benzeri) repoya **bilerek konmadı**. Bunlar için tek tek repo kontrolü yapılmadı: 

| README | Adet | Örnekler |
|---|---|---|
| data/chemistry/README.md | 10 | `libsindex.tab`, `ds01_2024.xml`, `libsindex.tab`, `CL5_827419445CCS_F1210762CCAM03842P3.CSV` |
| data/climate/README.md | 5 | `LegacyGCM_Ls070_Ls074.nc`, `LegacyGCM_Ls250_Ls254.nc`, `LegacyGCM_Ls247_Ls253.nc`, `LegacyGCM_Ls254_Ls259.nc` |
| data/curiosity-traverse/README.md | 4 | `localized_pos.csv`, `localized_interp.csv.xml`, `msl_orbital_map.xml`, `telemetry.csv` |
| data/hirise/README.md | 28 | `DTMCUMINDEX.TAB`, `DTEEC_001488_1750_001752_1750_U02.IMG`, `DTEEC_006855_1750_007501_1750_A01.IMG`, `DTEEC_008147_1750_007356_1750_H01.IMG` |
| data/mola/README.md | 1 | `Mars_MGS_MOLA_DEM_mosaic_global_463m.tif` |
| data/rems/README.md | 2 | `UV_INDEX.TAB`, `MODRDR6.FMT` |
| data/sharad/README.md | 43 | `s_01050101_rgram.lbl`, `s_01050101_geom.lbl`, `s_02600701_rgram.img`, `s_02600701_geom.tab` |

## (b) bounds.json dosyaları

| Dosya | Durum | Bölge kutusu |
|---|---|---|
| data/ctx/bounds.json | geçerli JSON | proje kutusuyla aynı (±0,01°) |
| data/mola/bounds.json | geçerli JSON | proje kutusuyla aynı (±0,01°) |
| data/sharad/bounds.json | geçerli JSON | proje kutusuyla aynı (±0,01°) |
| data/themis/bounds.json | geçerli JSON | proje kutusuyla aynı (±0,01°) |
| data/boxwork/bounds.json | geçerli JSON | proje kutusuyla aynı (±0,01°) |
| data/photos/bounds.json | geçerli JSON | üst düzey kutu yok (tablo/fotoğraf ya da dosya bazlı sınırlar) |
| data/crism/bounds.json | geçerli JSON | üst düzey kutu yok (tablo/fotoğraf ya da dosya bazlı sınırlar) |
| data/rems/bounds.json | geçerli JSON | üst düzey kutu yok (tablo/fotoğraf ya da dosya bazlı sınırlar) |
| data/hirise/dtm_gale/bounds.json | geçerli JSON | alt kutu (bilerek): region_bounds proje kutusuyla aynı |

Referans kutu: enlem -7,0..-3,5, boylam 136,0..139,5 D (`data/mola/bounds.json`). Alt kutular (örneğin HiRISE kırpması) `bounds` anahtarında kendi kutusunu, `region_bounds` anahtarında proje kutusunu taşır.

## (c) 100 MB'ı geçen tek dosya

Yok.

En büyük 5 dosya: data/hirise/dtm_gale/gale_hirise_dem.tif (15.0 MB), data/hirise/dtm_gale/gale_hirise_dem_int16le.bin (15.0 MB), data/curiosity-traverse/localized_interp.csv (11.8 MB), data/chemistry/chemcam_moc_all.csv (8.9 MB), data/hirise/dtm_gale/gale_hirise_hazard_class_uint8.bin (7.5 MB).

## (d) Toplam repo boyutu

Dosya içerikleri toplamı: **122.1 MB**, bunun 71.8 MB'ı bu çalışmada eklenen/değişen dosyalar. (Git geçmişi bu hesaba dahil değil.)
