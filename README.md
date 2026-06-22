# Halı Mağazası — Vitrin + "Yerinde Gör"

Ekohali tarzı bir halı vitrin sitesi. Ayırt edici özellik: **Yerinde Gör** — telefon kamerasıyla
halıyı odanızda canlı görüntü üstünde görüntüleme (taşı / boyutlandır / döndür / fotoğraf kaydet).

İlk sürüm kapsamı: **katalog + WhatsApp ile sipariş** (çevrimiçi ödeme yok).

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # üretim derlemesi
```

> Kamera (Yerinde Gör) yalnızca **https** veya **localhost** üzerinde çalışır. Gerçek telefonda
> test için siteyi yayınlayın (örn. Vercel — otomatik HTTPS).

## Nasıl özelleştirilir?

| Ne | Dosya |
|----|-------|
| **Marka adı, logo, renk, WhatsApp no, sosyal, kampanya yazıları** | `src/lib/brand.ts` |
| **Logo görseli** | `public/brand/logo.svg` (değiştirin) |
| **Ürünler** (isim, fiyat, indirim, renk, ölçü, görsel) | `src/data/products.ts` |
| **Ürün görselleri** | `public/products/` (gerçek fotoğraflarla değiştirin) |
| **Kategori / tarz / renk / ölçü listeleri** | `src/data/categories.ts` |

### WhatsApp numarası
`src/lib/brand.ts` içindeki `whatsappNumber` alanına ülke kodu + numarayı **boşluksuz/sembolsüz**
girin. Örn. `0532 000 00 00` → `"905320000000"`.

### İsim/logo
Henüz belli değil; `brand.name` ve `public/brand/logo.svg` geçici yer tutucudur. Karar verilince
bu iki yeri güncellemeniz yeterli — site genelinde otomatik yansır.

## Yapı

- `src/app/` — sayfalar (ana sayfa, `urunler`, `urun/[slug]`, `favorilerim`, `hakkimizda`, `iletisim`)
- `src/components/` — Header, Footer, ProductCard, FilterBar, **PlaceInRoom** (AR), WhatsApp butonu vb.
- `src/lib/` — `brand.ts`, `favorites.ts` (localStorage), `whatsapp.ts`
- `src/data/` — `products.ts`, `categories.ts`

## Notlar
- Favoriler tarayıcıda (localStorage) saklanır; sunucu/veritabanı yoktur.
- "Yerinde Gör" saf web API'leri (`getUserMedia` + Canvas) ile yapılmıştır; ek AR kütüphanesi yoktur.
  İndirilen fotoğrafta "zemine yatır" efekti yaklaşık olarak uygulanır.
