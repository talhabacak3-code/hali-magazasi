"use client";

import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { products } from "@/data/products";
import { useFavorites } from "@/lib/favorites";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const list = products.filter((p) => favorites.includes(p.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink mb-1">Favorilerim</h1>
      <p className="text-sm text-ink/50 mb-6">{list.length} ürün</p>

      {list.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-cream grid place-items-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7c3f2d" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <p className="text-ink/60">Henüz favori eklemediniz.</p>
          <Link href="/urunler" className="inline-block mt-4 bg-brand text-white rounded-lg px-5 py-3 font-medium hover:bg-brand-dark transition-colors">
            Halıları Keşfet
          </Link>
        </div>
      ) : (
        <ProductGrid products={list} />
      )}
    </div>
  );
}
