"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { type Product, discountPercent, formatPrice } from "@/data/products";
import { useFavorites } from "@/lib/favorites";

export function ProductCard({ product }: { product: Product }) {
  const { isFavorite, toggle } = useFavorites();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const off = discountPercent(product);
  const fav = mounted && isFavorite(product.slug);

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-black/5 hover:shadow-lg transition-shadow">
      {/* Rozetler */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {off && (
          <span className="bg-brand text-white text-xs font-semibold rounded-full px-2 py-0.5">
            %{off} İndirim
          </span>
        )}
        {product.newArrival && (
          <span className="bg-ink text-white text-xs rounded-full px-2 py-0.5">Yeni</span>
        )}
      </div>

      {/* Favori */}
      <button
        onClick={() => toggle(product.slug)}
        aria-label={fav ? "Favorilerden çıkar" : "Favorilere ekle"}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 shadow-sm hover:scale-105 transition-transform"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill={fav ? "#7c3f2d" : "none"} stroke={fav ? "#7c3f2d" : "#2a2c30"} strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      <Link href={`/urun/${product.slug}`} className="block">
        <div className="aspect-square bg-cream relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </div>
        <div className="p-3">
          <div className="text-xs text-ink/50">{product.brand}</div>
          <div className="text-sm font-medium text-ink line-clamp-1">{product.name}</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-brand font-bold">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-ink/40 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <Link
          href={`/urun/${product.slug}`}
          className="block text-center text-sm font-medium border border-brand text-brand rounded-lg py-2 hover:bg-brand hover:text-white transition-colors"
        >
          İncele &amp; Yerinde Gör
        </Link>
      </div>
    </div>
  );
}
