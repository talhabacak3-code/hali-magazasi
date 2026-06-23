// ============================================================================
// Pierre Cardin 2023 kataloğundan ürün verisi + yer tutucu görseller üretir.
// TEK KAYNAK: aşağıdaki `collections` tanımı.
// Çıktılar:
//   - src/data/catalog.json       (ürünler — Product[])
//   - src/data/collections.json   (koleksiyon meta)
//   - public/products/<slug>.svg  (her ürün için temalı yer tutucu)
// Gerçek fotoğraflar geldiğinde aynı isimli dosyaları değiştirmeniz yeterli.
// ============================================================================
import { mkdirSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const productsDir = join(root, "public", "products");
const dataDir = join(root, "src", "data");
mkdirSync(productsDir, { recursive: true });

// Ölçü setleri
const FULL = ["80x150", "80x300", "100x200", "100x300", "120x180", "160x230", "200x290", "240x340"];
const NO_BIG = ["80x150", "80x300", "100x200", "100x300", "120x180", "160x230", "200x290"];
const PERSIA = ["160x230", "200x290", "240x340"];

// Renk slug -> hex (categories.ts ile uyumlu)
const HEX = {
  bej: "#d8c4a8", gri: "#9aa0a6", antrasit: "#3c3f44", krem: "#efe6d4",
  mavi: "#3b6ea5", yesil: "#4b7a52", pembe: "#d79bb0", toprak: "#9c5a3c",
  "cok-renkli": "#b07cc6",
};

// Koleksiyon tanımları (kataloğtan)
const collections = [
  { slug: "persia", name: "Persia", style: "klasik", color: "bej", material: "Viskon", hav: "5mm",
    sizes: PERSIA, yeni: false,
    desc: "Sanatsal estetik dokunuşlar, ihtişamlı çizgiler ve klasik desenlerle zarafeti evlerinize taşıyan klasik koleksiyon.",
    codes: ["YZ05A","YZ06A","YZ06B","YZ01A","YZ02A","YZ07A","YZ07B","YZ08B","YZ08D"] },
  { slug: "prime", name: "Prime", style: "modern", color: "gri", material: "Akrilik & Polyester", hav: "12mm",
    sizes: NO_BIG, yeni: true,
    desc: "Benzersiz tarzı ve modern görünümüyle öne çıkan, dokulu yüzey etkisiyle yüksek konfor sunan koleksiyon.",
    codes: ["JA00B","JA01B","JA02B","JA06C","JA07B"] },
  { slug: "marcel", name: "Marcel", style: "modern", color: "cok-renkli", material: "Akrilik & Viskon", hav: "7mm",
    sizes: NO_BIG, yeni: true,
    desc: "Modern tasarımlar ve canlı renklerle harmanlanan, dayanıklı ve yumuşak dokulu koleksiyon.",
    codes: ["JC00A","JC00B","JC00C","JC00D","JC01A","JC01B","JC01C","JC01E","JC06A","JC06B"] },
  { slug: "jardin", name: "Jardin", style: "modern", color: "bej", material: "Akrilik", hav: "10mm",
    sizes: NO_BIG, yeni: true,
    desc: "Nötr tonlar ve minimal desenlerle sade şıklık sunan koleksiyon.",
    codes: ["JN00A","JN00C","JN00D","JN03A","JN03C","JN03E","JN05A","JN05B","JN05C","JN10B","JN06B","JN06F","JN09A","JN09B"] },
  { slug: "voila", name: "Voila", style: "modern", color: "toprak", material: "Akrilik & Viskon", hav: "6mm",
    sizes: FULL, yeni: false,
    desc: "Gün batımının renklerinde tasarım ve desenlerle evlerinize doğal bir dokunuş katan koleksiyon.",
    codes: ["ZQ00A","ZQ00B","ZQ00C","ZQ00D","ZQ01A","ZQ01B","ZQ01C","ZQ01D","ZQ03A","ZQ03C","ZQ03D","ZQ05A","ZQ05B","ZQ06A"] },
  { slug: "la-vita", name: "La-Vita", style: "modern", color: "gri", material: "Akrilik", hav: "7mm",
    sizes: FULL, yeni: false,
    desc: "Işıltı ve sadeliğin uyumu; renk ve desenleriyle bir sanat eseri gibi yaşam alanlarınızı tamamlayan koleksiyon.",
    codes: ["QT07C","QT07D","QT07E","QT08A","QT05A","QT05B","QT09A","QT09B"] },
  { slug: "monet", name: "Monet", style: "modern", color: "mavi", material: "Akrilik & Viskon", hav: "6mm",
    sizes: FULL, yeni: false,
    desc: "Şık çerçeve detaylarıyla fark yaratan, modern tasarımlı klasikleşmiş koleksiyon.",
    codes: ["MT40A","MT40B","MT40C","MT40D","MT20B","MT20A","MT22B","MT18L","MT18C","MT18D","MT18K","MT18B"] },
  { slug: "magnifique", name: "Magnifique", style: "modern", color: "pembe", material: "Akrilik, Modal & Tencel", hav: "6mm",
    sizes: NO_BIG, yeni: false,
    desc: "Botanik kökenli Tencel elyaflarla üretilen; renkleri ve yumuşaklığıyla konfor sunan koleksiyon.",
    codes: ["BQ00E","BQ00J","BQ00K","BQ00L","BQ03J","BQ03K","BQ02E","BQ02J","BQ02K","BQ02L","BQ02N","MQ48E","MQ48J","MQ48K","MQ48L","MQ48M"] },
  { slug: "otantik", name: "Otantik", style: "otantik", color: "toprak", material: "Akrilik", hav: "11mm",
    sizes: FULL, yeni: false,
    desc: "Anadolu'nun eşsiz izlerini taşıyan, göz alıcı desenleriyle öne çıkan otantik koleksiyon.",
    codes: ["E010A","E010B","E010D","E010E","E012D","E014A","E014B","E014D","E015A","E015C"] },
  { slug: "maxwell", name: "Maxwell", style: "modern", color: "toprak", material: "Mikro Polyester", hav: "5mm",
    sizes: NO_BIG, yeni: true,
    desc: "Terra, mavi, gri ve bej tonlarını bir araya getiren; konfor ve estetiği buluşturan koleksiyon.",
    codes: ["MK01A","MK01B","MK01C","MK01D","MK04A","MK04B","MK04C","MK04D","MK02A","MK02B","MK02C","MK02D","MK03A","MK03B","MK00A"] },
  { slug: "quenta", name: "Quenta", style: "modern", color: "krem", material: "Mikro Polyester", hav: "Kesik Hav 9mm",
    sizes: NO_BIG, yeni: true,
    desc: "Yalın renk kullanımı ve şık dokumasıyla dolgun, yumuşak yapılı modern koleksiyon.",
    codes: ["QZ00A","QZ00B","QZ00C","QZ01A","QZ01B","QZ02A","QZ02B","QZ08A","QZ08B","QZ09A","QZ09B","QZ11A","QZ11B","QZ14A","QZ17A"] },
  { slug: "greyna", name: "Greyna", style: "modern", color: "antrasit", material: "Mikro Polyester", hav: "Kesik Hav 9mm",
    sizes: NO_BIG, yeni: true,
    desc: "Antrasit, gri ve beyaz tonlarının uyumuyla sade şıklık ve konfor sunan koleksiyon.",
    codes: ["GN01B","GN03A","GN05A","GN06A","GN07A","GN08A","GN09A","GN10A","GN10B","GN11A","GN11B"] },
];

// ============================================================================
// GERÇEK FOTOĞRAFLI ÜRÜNLER (extras)
// Yer tutucu yerine elle eklenen, gerçek görselli ürünler. SVG üretilmez;
// `image` alanındaki dosya public/products/ içinde bulunmalıdır.
// Yeni gerçek fotoğraf eklemek için: görseli public/products/ içine koyun ve
// buraya bir satır ekleyip `node scripts/gen-catalog.mjs` çalıştırın.
// ============================================================================
const extras = [
  {
    slug: "persia-yz10a",
    name: "Persia YZ10A",
    brand: "Pierre Cardin",
    code: "YZ10A",
    collection: "persia",
    type: "modern",
    style: "klasik",
    color: "gri",
    sizes: PERSIA,
    features: [],
    image: "/products/persia-yz10a.jpg",
    bestseller: false,
    newArrival: true,
    description:
      "Gri zemin üzerine balıksırtı dokulu, ince bordürlü klasik Persia halısı. Viskon ipliğinden üretilmiştir. Hav yüksekliği: 5mm.",
  },
  {
    slug: "persia-yz11a",
    name: "Persia YZ11A",
    brand: "Pierre Cardin",
    code: "YZ11A",
    collection: "persia",
    type: "modern",
    style: "klasik",
    color: "krem",
    sizes: PERSIA,
    features: [],
    image: "/products/persia-yz11a.jpg",
    bestseller: false,
    newArrival: true,
    description:
      "Krem zemin üzerine eskitme efektli bordürüyle zarif, modern-klasik bir Persia halısı. Viskon ipliğinden üretilmiştir. Hav yüksekliği: 5mm.",
  },
];

// ---- renk yardımcıları ----
function hexToRgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
}
function mix(hex, target, amt) {
  const a = hexToRgb(hex), b = hexToRgb(target);
  return rgbToHex(a.map((v, i) => v + (b[i] - v) * amt));
}
const lighten = (h, a) => mix(h, "#ffffff", a);
const darken = (h, a) => mix(h, "#000000", a);

// ---- SVG desenleri (kod indeksine göre 3 varyant) ----
function svg(main, second, accent, variant) {
  const motif =
    variant === 0
      ? `<g fill="none" stroke="${accent}" stroke-width="6"><path d="M400 150 L520 280 L400 410 L280 280 Z"/><path d="M400 220 L470 290 L400 360 L330 290 Z" stroke="${second}"/><circle cx="400" cy="290" r="16" fill="${accent}" stroke="none"/></g>`
      : variant === 1
      ? `<g fill="none" stroke="${accent}" stroke-width="6"><circle cx="400" cy="290" r="120"/><circle cx="400" cy="290" r="70" stroke="${second}"/><circle cx="400" cy="290" r="22" fill="${accent}" stroke="none"/></g>`
      : `<g fill="none" stroke="${accent}" stroke-width="6"><rect x="300" y="190" width="200" height="200"/><rect x="340" y="230" width="120" height="120" stroke="${second}"/><line x1="300" y1="190" x2="500" y2="390"/><line x1="500" y1="190" x2="300" y2="390"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs><pattern id="w" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${main}"/><path d="M0 0 L16 16 M16 0 L0 16" stroke="${second}" stroke-width="1.5" opacity="0.3"/></pattern></defs>
  <rect width="800" height="800" fill="url(#w)"/>
  <rect x="36" y="36" width="728" height="728" fill="none" stroke="${accent}" stroke-width="10"/>
  <rect x="70" y="70" width="660" height="660" fill="none" stroke="${second}" stroke-width="4"/>
  ${motif}
  <g stroke="${second}" stroke-width="5" opacity="0.6" fill="none"><path d="M120 560 H680"/><path d="M120 700 H680"/></g>
</svg>`;
}

// ---- eski demo görsellerini temizle ----
for (const f of readdirSync(productsDir)) {
  if (f.startsWith("rug-") && f.endsWith(".svg")) rmSync(join(productsDir, f));
}

// ---- üret ----
const products = [];
const collectionMeta = [];

for (const c of collections) {
  collectionMeta.push({
    slug: c.slug, name: c.name, style: c.style, color: c.color,
    material: c.material, hav: c.hav, sizes: c.sizes, yeni: c.yeni, desc: c.desc,
  });

  c.codes.forEach((code, j) => {
    const slug = `${c.slug}-${code.toLowerCase()}`;
    const base = HEX[c.color];
    // kod indeksine göre hafif ton değişimi (görsel çeşitlilik)
    const shade = (j % 4) * 0.06;
    const main = lighten(base, 0.18 - shade);
    const second = darken(base, 0.15 + shade);
    const accent = darken(base, 0.4);
    writeFileSync(join(productsDir, `${slug}.svg`), svg(main, second, accent, j % 3), "utf8");

    products.push({
      slug,
      name: `${c.name} ${code}`,
      brand: "Pierre Cardin",
      code,
      collection: c.slug,
      type: "modern",
      style: c.style,
      color: c.color,
      sizes: c.sizes,
      features: [],
      image: `/products/${slug}.svg`,
      bestseller: j === 0,
      newArrival: c.yeni && j < 3,
      description: `${c.desc} ${c.material} ipliğinden üretilmiştir. Hav yüksekliği: ${c.hav}.`,
    });
  });
}

// Gerçek fotoğraflı ürünleri ekle (ilgili koleksiyonun başına yerleştir)
for (const ex of extras) {
  const idx = products.findIndex((p) => p.collection === ex.collection);
  if (idx >= 0) products.splice(idx, 0, ex);
  else products.push(ex);
}

writeFileSync(join(dataDir, "catalog.json"), JSON.stringify(products, null, 2), "utf8");
writeFileSync(join(dataDir, "collections.json"), JSON.stringify(collectionMeta, null, 2), "utf8");
console.log(`Üretildi: ${products.length} ürün (${extras.length} gerçek fotoğraflı), ${collectionMeta.length} koleksiyon.`);
