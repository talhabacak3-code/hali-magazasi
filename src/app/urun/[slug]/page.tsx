import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductGrid } from "@/components/ProductGrid";
import { getProduct, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Ürün bulunamadı" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.type === product.type && p.slug !== product.slug).slice(0, 4);

  return (
    <>
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8">
          <h2 className="font-serif text-2xl text-ink mb-4">Benzer Ürünler</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
