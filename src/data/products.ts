// ============================================================================
// Ürün verisi. Liste, scripts/gen-catalog.mjs tarafından üretilen
// catalog.json'dan gelir (Pierre Cardin 2023 kataloğu).
// Gerçek fiyat/fotoğraf geldiğinde: katalog tanımını güncelleyip betiği
// yeniden çalıştırın ya da catalog.json'ı düzenleyin.
// ============================================================================
import catalog from "./catalog.json";

export type Product = {
  slug: string;
  name: string;
  brand: string;
  code: string; // katalog tasarım kodu (örn. YZ05A)
  collection: string; // collections.json -> slug
  type: string; // categories.ts -> types
  style: string; // categories.ts -> styles
  color: string; // categories.ts -> colors
  sizes: string[]; // categories.ts -> sizes
  features: string[]; // categories.ts -> features
  price?: number; // opsiyonel — yoksa "Fiyat için WhatsApp" gösterilir
  oldPrice?: number;
  image: string;
  bestseller?: boolean;
  newArrival?: boolean;
  description: string;
};

export const products = catalog as Product[];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function discountPercent(p: Product): number | null {
  if (!p.price || !p.oldPrice || p.oldPrice <= p.price) return null;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}
