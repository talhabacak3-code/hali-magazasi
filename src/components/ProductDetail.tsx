"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { type Product, discountPercent, formatPrice } from "@/data/products";
import { labelOf, sizes as allSizes, features as allFeatures, colors } from "@/data/categories";
import { useFavorites } from "@/lib/favorites";
import { asset } from "@/lib/asset";
import { WhatsAppOrderButton } from "./WhatsAppOrderButton";
import { PlaceInRoom } from "./PlaceInRoom";

export function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState<string | undefined>(product.sizes[0]);
  const [arOpen, setArOpen] = useState(false);
  const { isFavorite, toggle } = useFavorites();
  const off = discountPercent(product);
  const colorHex = colors.find((c) => c.slug === product.color)?.hex;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-xs text-ink/40 mb-4">
        <Link href="/" className="hover:text-brand">Anasayfa</Link> /{" "}
        <Link href="/urunler" className="hover:text-brand">Halılar</Link> /{" "}
        <span className="text-ink/60">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Görsel */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-cream relative">
            <Image src={asset(product.image)} alt={product.name} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" priority />
            {off && (
              <span className="absolute top-3 left-3 bg-brand text-white text-sm font-semibold rounded-full px-3 py-1">
                %{off} İndirim
              </span>
            )}
          </div>
          {/* Yerinde Gör — görsel altında belirgin buton */}
          <button
            onClick={() => setArOpen(true)}
            className="mt-3 w-full border-2 border-brand text-brand font-medium rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-brand hover:text-white transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Yerinde Gör (Kamerayı Aç)
          </button>
        </div>

        {/* Bilgiler */}
        <div>
          <div className="text-sm text-ink/50">{product.brand}</div>
          <h1 className="font-serif text-3xl text-ink mt-1">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-lg text-ink/40 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <p className="text-xs text-ink/50 mt-1">Peşin fiyatına 6 taksit imkânı</p>

          <p className="mt-5 text-ink/70 leading-relaxed">{product.description}</p>

          {/* Renk */}
          <div className="mt-6 flex items-center gap-2">
            <span className="text-sm text-ink/60">Renk:</span>
            <span className="inline-flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: colorHex }} />
              <span className="text-sm font-medium">{labelOf(colors, product.color)}</span>
            </span>
          </div>

          {/* Ölçü seçimi */}
          <div className="mt-5">
            <div className="text-sm text-ink/60 mb-2">Ölçü seçin (cm):</div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`text-sm rounded-lg px-3 py-2 border transition-colors ${
                    size === s ? "bg-brand text-white border-brand" : "bg-white border-black/10 hover:border-brand"
                  }`}
                >
                  {labelOf(allSizes, s)}
                </button>
              ))}
            </div>
          </div>

          {/* Özellikler */}
          {product.features.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5 text-xs bg-cream text-brand-dark rounded-full px-3 py-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {labelOf(allFeatures, f)}
                </span>
              ))}
            </div>
          )}

          {/* Aksiyonlar */}
          <div className="mt-8 space-y-3">
            <WhatsAppOrderButton product={product} size={size} />
            <button
              onClick={() => toggle(product.slug)}
              className="w-full border border-black/10 rounded-xl py-3 flex items-center justify-center gap-2 hover:border-brand transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite(product.slug) ? "#7c3f2d" : "none"} stroke="#7c3f2d" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {isFavorite(product.slug) ? "Favorilerde" : "Favorilere Ekle"}
            </button>
          </div>

          <div className="mt-6 text-xs text-ink/50 space-y-1">
            <p>🚚 1500₺ üzeri ücretsiz kargo · ↩️ 14 gün iade</p>
            <p>Sipariş ve sorularınız için WhatsApp hattımız açıktır.</p>
          </div>
        </div>
      </div>

      {arOpen && (
        <PlaceInRoom imageSrc={product.image} productName={product.name} onClose={() => setArOpen(false)} />
      )}
    </div>
  );
}
