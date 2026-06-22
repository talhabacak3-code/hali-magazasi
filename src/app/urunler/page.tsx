import { Suspense } from "react";
import { ProductsBrowser } from "@/components/ProductsBrowser";

export const metadata = { title: "Tüm Halılar" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8 text-ink/40">Yükleniyor…</div>}>
      <ProductsBrowser />
    </Suspense>
  );
}
