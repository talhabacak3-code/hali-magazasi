// ============================================================================
// Kategori tanımları — referans sitedeki yapıya benzer.
// Filtre çubuğu ve menü bu listelerden beslenir.
// ============================================================================

import collectionsJson from "./collections.json";

export type Option = { slug: string; label: string };

// Koleksiyonlar (collections.json'dan — Pierre Cardin)
export const collections: Option[] = (collectionsJson as { slug: string; name: string }[]).map(
  (c) => ({ slug: c.slug, label: c.name }),
);

export type CollectionMeta = {
  slug: string;
  name: string;
  style: string;
  color: string;
  material: string;
  hav: string;
  sizes: string[];
  yeni: boolean;
  desc: string;
};

export const collectionMeta = collectionsJson as CollectionMeta[];

export function getCollection(slug: string): CollectionMeta | undefined {
  return collectionMeta.find((c) => c.slug === slug);
}

// Halı tipi
export const types: Option[] = [
  { slug: "modern", label: "Modern Halı" },
  { slug: "kilim", label: "Kilim" },
  { slug: "jut-orgu", label: "Jüt & Örgü" },
  { slug: "yuvarlak", label: "Yuvarlak Halı" },
  { slug: "bebek-cocuk", label: "Bebek & Çocuk" },
  { slug: "yolluk", label: "Yolluk" },
  { slug: "seccade", label: "Seccade" },
  { slug: "kurk-pelus", label: "Kürk & Peluş" },
];

// Tarz
export const styles: Option[] = [
  { slug: "modern", label: "Modern" },
  { slug: "geometrik", label: "Geometrik" },
  { slug: "eskitme", label: "Eskitme" },
  { slug: "klasik", label: "Klasik" },
  { slug: "art-deco", label: "Art Deco" },
  { slug: "otantik", label: "Otantik" },
];

// Renk (görsel için hex de tutuyoruz)
export const colors: { slug: string; label: string; hex: string }[] = [
  { slug: "bej", label: "Bej", hex: "#d8c4a8" },
  { slug: "gri", label: "Gri", hex: "#9aa0a6" },
  { slug: "antrasit", label: "Antrasit", hex: "#3c3f44" },
  { slug: "krem", label: "Krem", hex: "#efe6d4" },
  { slug: "mavi", label: "Mavi", hex: "#3b6ea5" },
  { slug: "yesil", label: "Yeşil", hex: "#4b7a52" },
  { slug: "pembe", label: "Pembe", hex: "#d79bb0" },
  { slug: "toprak", label: "Toprak", hex: "#9c5a3c" },
  { slug: "cok-renkli", label: "Çok Renkli", hex: "#b07cc6" },
];

// Ölçü (cm) — Pierre Cardin kataloğundaki standart ölçüler
export const sizes: Option[] = [
  { slug: "80x150", label: "80x150" },
  { slug: "80x300", label: "80x300" },
  { slug: "100x200", label: "100x200" },
  { slug: "100x300", label: "100x300" },
  { slug: "120x180", label: "120x180" },
  { slug: "160x230", label: "160x230" },
  { slug: "200x290", label: "200x290" },
  { slug: "240x340", label: "240x340" },
];

// Ürün özellikleri (ikon etiketleri)
export const features: Option[] = [
  { slug: "kaymaz-taban", label: "Kaymaz Taban" },
  { slug: "yikanabilir", label: "Yıkanabilir" },
  { slug: "hav-vermez", label: "Hav Vermez" },
  { slug: "cift-tarafli", label: "Çift Taraflı" },
  { slug: "antibakteriyel", label: "Antibakteriyel" },
  { slug: "pati-dostu", label: "Pati Dostu" },
];

export function labelOf(list: Option[], slug: string): string {
  return list.find((o) => o.slug === slug)?.label ?? slug;
}
