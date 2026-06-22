import { Suspense } from "react";
import { FilterBar } from "@/components/FilterBar";
import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/data/products";
import { labelOf, types, styles, colors, sizes } from "@/data/categories";

export const metadata = { title: "Tüm Halılar" };

type SP = { [key: string]: string | string[] | undefined };

function pick(sp: SP, key: string): string | undefined {
  const v = sp[key];
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const type = pick(sp, "type");
  const style = pick(sp, "style");
  const color = pick(sp, "color");
  const size = pick(sp, "size");

  const filtered = products.filter(
    (p) =>
      (!type || p.type === type) &&
      (!style || p.style === style) &&
      (!color || p.color === color) &&
      (!size || p.sizes.includes(size)),
  );

  // Başlık: aktif filtrelere göre
  const activeLabels = [
    type && labelOf(types, type),
    style && labelOf(styles, style),
    color && labelOf(colors, color),
    size && labelOf(sizes, size),
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-xs text-ink/40 mb-2">Anasayfa / Halılar</nav>
      <h1 className="font-serif text-3xl text-ink mb-1">
        {activeLabels.length ? activeLabels.join(" · ") : "Tüm Halılar"}
      </h1>
      <p className="text-sm text-ink/50 mb-6">{filtered.length} ürün listeleniyor</p>

      <div className="grid lg:grid-cols-[240px_1fr] gap-8">
        <aside className="lg:sticky lg:top-20 self-start bg-sand lg:bg-transparent rounded-xl">
          <Suspense fallback={<div className="text-sm text-ink/40">Filtreler yükleniyor…</div>}>
            <FilterBar />
          </Suspense>
        </aside>
        <div>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
