import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { Newsletter } from "@/components/Newsletter";
import { products } from "@/data/products";
import { collections } from "@/data/categories";

function SectionHeading({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      {href && (
        <Link href={href} className="text-sm text-brand hover:underline">
          Tümünü gör →
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 8);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 8);

  return (
    <>
      <Hero />

      {/* Koleksiyon kısayolları */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <SectionHeading title="Koleksiyonlar" href="/urunler" />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/urunler?collection=${c.slug}`}
              className="group flex flex-col items-center gap-2 text-center"
            >
              <div className="w-full aspect-square rounded-xl bg-cream grid place-items-center group-hover:bg-brand/10 transition-colors">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3f2d" strokeWidth="1.6">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M3 9h18M8 4v16" />
                </svg>
              </div>
              <span className="text-xs text-ink/70 group-hover:text-brand">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* En çok satanlar */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionHeading title="En Çok Satanlar" href="/urunler" />
        <ProductGrid products={bestsellers} />
      </section>

      {/* Yerinde Gör tanıtım bandı */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl bg-ink text-white overflow-hidden grid lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <h2 className="font-serif text-2xl sm:text-3xl">Kararsız mısınız? Önce yerinde görün.</h2>
            <p className="mt-3 text-white/70 max-w-md">
              Her ürün sayfasındaki <strong className="text-cream">“Yerinde Gör”</strong> butonuna
              dokunun. Kameranız açılır, halıyı odanıza yerleştirir, parmaklarınızla taşır,
              büyütür ve döndürürsünüz. Beğendiğiniz görüntüyü kaydedip paylaşabilirsiniz.
            </p>
            <Link
              href="/urunler"
              className="inline-block mt-6 bg-brand text-white rounded-lg px-5 py-3 font-medium hover:bg-brand-light transition-colors"
            >
              Hemen Dene
            </Link>
          </div>
          <div className="relative bg-gradient-to-br from-brand to-brand-dark p-8 sm:p-12 grid place-items-center">
            <ol className="space-y-4 text-white/90">
              <li className="flex gap-3"><span className="shrink-0 w-7 h-7 rounded-full bg-white/20 grid place-items-center text-sm">1</span> Ürün sayfasında “Yerinde Gör”e dokun</li>
              <li className="flex gap-3"><span className="shrink-0 w-7 h-7 rounded-full bg-white/20 grid place-items-center text-sm">2</span> Kamera iznini ver</li>
              <li className="flex gap-3"><span className="shrink-0 w-7 h-7 rounded-full bg-white/20 grid place-items-center text-sm">3</span> Halıyı taşı, boyutlandır, döndür</li>
              <li className="flex gap-3"><span className="shrink-0 w-7 h-7 rounded-full bg-white/20 grid place-items-center text-sm">4</span> Fotoğrafı kaydet ve paylaş</li>
            </ol>
          </div>
        </div>
      </section>

      {/* Yeni gelenler */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        <SectionHeading title="Yeni Gelenler" href="/urunler" />
        <ProductGrid products={newArrivals} />
      </section>

      <Newsletter />
    </>
  );
}
