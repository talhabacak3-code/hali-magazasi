// ============================================================================
// Demo ürün verisi — gerçek ürünler geldiğinde bu listeyi değiştirin.
// Görseller public/products/ içindeki SVG yer tutuculardır.
// ============================================================================

export type Product = {
  slug: string;
  name: string;
  brand: string;
  type: string; // categories.ts -> types
  style: string; // categories.ts -> styles
  color: string; // categories.ts -> colors
  sizes: string[]; // categories.ts -> sizes
  features: string[]; // categories.ts -> features
  price: number; // güncel (indirimli) fiyat, ₺
  oldPrice?: number; // indirim öncesi fiyat, ₺
  image: string; // ürün kartı / detay görseli
  bestseller?: boolean;
  newArrival?: boolean;
  description: string;
};

export const products: Product[] = [
  {
    slug: "nomad-modern-bej",
    name: "Nomad Modern Halı",
    brand: "Halı Evi",
    type: "modern",
    style: "modern",
    color: "bej",
    sizes: ["80x150", "120x180", "160x230", "200x290", "240x340"],
    features: ["kaymaz-taban", "yikanabilir", "pati-dostu"],
    price: 1899,
    oldPrice: 2499,
    image: "/products/rug-bej.svg",
    bestseller: true,
    newArrival: true,
    description:
      "Yumuşak dokulu, sıcak bej tonlarıyla her oturma odasına uyum sağlayan modern bir halı. Kaymaz tabanı sayesinde güvenle kullanılır.",
  },
  {
    slug: "zen-geometrik-gri",
    name: "Zen Geometrik Halı",
    brand: "Halı Evi",
    type: "modern",
    style: "geometrik",
    color: "gri",
    sizes: ["120x180", "160x230", "200x290", "300x400"],
    features: ["hav-vermez", "yikanabilir"],
    price: 2150,
    oldPrice: 2890,
    image: "/products/rug-gri.svg",
    bestseller: true,
    description:
      "Modern geometrik desenleri ve dengeli gri tonuyla minimalist evlerin favorisi. Hav vermez yapısıyla uzun ömürlüdür.",
  },
  {
    slug: "shiraz-otantik-toprak",
    name: "Shiraz Otantik Halı",
    brand: "Halı Evi",
    type: "modern",
    style: "otantik",
    color: "toprak",
    sizes: ["160x230", "200x290", "240x340"],
    features: ["cift-tarafli", "kaymaz-taban"],
    price: 2790,
    oldPrice: 3490,
    image: "/products/rug-toprak.svg",
    bestseller: true,
    description:
      "Sıcak toprak tonları ve otantik motiflerle geleneksel dokunuş. Çift taraflı kullanım imkânı sunar.",
  },
  {
    slug: "jade-eskitme-mavi",
    name: "Jade Eskitme Halı",
    brand: "Halı Evi",
    type: "modern",
    style: "eskitme",
    color: "mavi",
    sizes: ["80x150", "120x180", "160x230", "200x290"],
    features: ["yikanabilir", "antibakteriyel"],
    price: 1990,
    oldPrice: 2590,
    image: "/products/rug-mavi.svg",
    newArrival: true,
    description:
      "Eskitme efektli, derin mavi tonlarıyla karakter sahibi bir halı. Antibakteriyel iplikten üretilmiştir.",
  },
  {
    slug: "cotton-kilim-krem",
    name: "Cotton Kilim",
    brand: "Halı Evi",
    type: "kilim",
    style: "modern",
    color: "krem",
    sizes: ["80x150", "120x180", "160x230"],
    features: ["yikanabilir", "cift-tarafli", "pati-dostu"],
    price: 1290,
    oldPrice: 1690,
    image: "/products/rug-krem.svg",
    bestseller: true,
    description:
      "İnce dokulu pamuk kilim; yıkanabilir ve çift taraflıdır. Mutfak ve antre için ideal.",
  },
  {
    slug: "utopia-art-deco-yesil",
    name: "Utopia Art Deco Halı",
    brand: "Halı Evi",
    type: "modern",
    style: "art-deco",
    color: "yesil",
    sizes: ["160x230", "200x290", "240x340", "300x400"],
    features: ["hav-vermez", "kaymaz-taban"],
    price: 3290,
    oldPrice: 3990,
    image: "/products/rug-yesil.svg",
    newArrival: true,
    description:
      "Art deco çizgileri ve canlı yeşil tonuyla iddialı bir tasarım. Geniş yaşam alanları için.",
  },
  {
    slug: "grace-klasik-antrasit",
    name: "Grace Klasik Halı",
    brand: "Halı Evi",
    type: "modern",
    style: "klasik",
    color: "antrasit",
    sizes: ["120x180", "160x230", "200x290"],
    features: ["hav-vermez"],
    price: 2390,
    oldPrice: 2990,
    image: "/products/rug-antrasit.svg",
    description:
      "Zarif klasik motifler ve antrasit zeminle şık bir duruş. Salon ve çalışma odası için uygundur.",
  },
  {
    slug: "petit-bebek-pembe",
    name: "Petit Bebek Halısı",
    brand: "Halı Evi",
    type: "bebek-cocuk",
    style: "modern",
    color: "pembe",
    sizes: ["80x150", "120x180"],
    features: ["yikanabilir", "antibakteriyel", "kaymaz-taban"],
    price: 1190,
    oldPrice: 1490,
    image: "/products/rug-pembe.svg",
    newArrival: true,
    description:
      "Bebek ve çocuk odaları için yumuşak, yıkanabilir ve antibakteriyel halı. Pastel pembe tonunda.",
  },
  {
    slug: "round-modern-cokrenkli",
    name: "Round Modern Yuvarlak Halı",
    brand: "Halı Evi",
    type: "yuvarlak",
    style: "modern",
    color: "cok-renkli",
    sizes: ["q120", "q160"],
    features: ["yikanabilir", "pati-dostu"],
    price: 1590,
    oldPrice: 1990,
    image: "/products/rug-cokrenkli.svg",
    description:
      "Renkli desenleriyle neşeli bir yuvarlak halı. Çocuk odası ve oturma köşeleri için ideal.",
  },
  {
    slug: "jut-orgu-naturel",
    name: "Jüt Örgü Halı",
    brand: "Halı Evi",
    type: "jut-orgu",
    style: "otantik",
    color: "bej",
    sizes: ["120x180", "160x230", "200x290"],
    features: ["cift-tarafli", "pati-dostu"],
    price: 1750,
    oldPrice: 2150,
    image: "/products/rug-jut.svg",
    description:
      "Doğal jüt elyaftan örgü halı. Naturel görünümü ve dayanıklı dokusuyla öne çıkar.",
  },
  {
    slug: "seccade-klasik-yesil",
    name: "Klasik Seccade",
    brand: "Halı Evi",
    type: "seccade",
    style: "klasik",
    color: "yesil",
    sizes: ["80x150"],
    features: ["kaymaz-taban", "hav-vermez"],
    price: 690,
    oldPrice: 890,
    image: "/products/rug-seccade.svg",
    description:
      "Kaymaz tabanlı, yumuşak dokulu klasik seccade. Hediyelik olarak da tercih edilir.",
  },
  {
    slug: "yolluk-geometrik-gri",
    name: "Geometrik Yolluk",
    brand: "Halı Evi",
    type: "yolluk",
    style: "geometrik",
    color: "gri",
    sizes: ["80x150", "80x300"] as string[],
    features: ["kaymaz-taban", "yikanabilir"],
    price: 980,
    oldPrice: 1290,
    image: "/products/rug-yolluk.svg",
    description:
      "Koridor ve mutfak için ince, kaymaz tabanlı yolluk. Geometrik deseniyle modern bir görünüm sunar.",
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function discountPercent(p: Product): number | null {
  if (!p.oldPrice || p.oldPrice <= p.price) return null;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}
