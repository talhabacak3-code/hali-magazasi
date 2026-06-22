// ============================================================================
// Kategori tanımları — referans sitedeki yapıya benzer.
// Filtre çubuğu ve menü bu listelerden beslenir.
// ============================================================================

export type Option = { slug: string; label: string };

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

// Ölçü (cm)
export const sizes: Option[] = [
  { slug: "80x150", label: "80x150" },
  { slug: "120x180", label: "120x180" },
  { slug: "160x230", label: "160x230" },
  { slug: "200x290", label: "200x290" },
  { slug: "240x340", label: "240x340" },
  { slug: "300x400", label: "300x400" },
  { slug: "q120", label: "Yuvarlak Ø120" },
  { slug: "q160", label: "Yuvarlak Ø160" },
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
