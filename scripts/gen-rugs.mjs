// Yer tutucu halı görselleri üretir (public/products/*.svg).
// Gerçek ürün görselleri geldiğinde bu dosyalar değiştirilir.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "products");
mkdirSync(outDir, { recursive: true });

// [dosya, ana renk, ikincil renk, vurgu]
const rugs = [
  ["rug-bej", "#d8c4a8", "#bfa985", "#8a6f4e"],
  ["rug-gri", "#9aa0a6", "#7d838a", "#4b4f54"],
  ["rug-toprak", "#9c5a3c", "#7d4630", "#d99a6c"],
  ["rug-mavi", "#3b6ea5", "#2c537c", "#9fc0e0"],
  ["rug-krem", "#efe6d4", "#ddd0b6", "#b9a988"],
  ["rug-yesil", "#4b7a52", "#3a5f40", "#a9c9ad"],
  ["rug-antrasit", "#3c3f44", "#2a2c30", "#7d818a"],
  ["rug-pembe", "#d79bb0", "#c47e96", "#f3d6e0"],
  ["rug-cokrenkli", "#b07cc6", "#e0884f", "#4b9ec4"],
  ["rug-jut", "#cbb48a", "#b09a6f", "#8a734b"],
  ["rug-seccade", "#4b7a52", "#2f5036", "#d8c4a8"],
  ["rug-yolluk", "#9aa0a6", "#787e85", "#cfd3d8"],
];

function svg(main, second, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
  <defs>
    <pattern id="weave" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(0)">
      <rect width="16" height="16" fill="${main}"/>
      <path d="M0 0 L16 16 M16 0 L0 16" stroke="${second}" stroke-width="1.5" opacity="0.35"/>
    </pattern>
  </defs>
  <rect width="800" height="800" fill="url(#weave)"/>
  <rect x="36" y="36" width="728" height="728" fill="none" stroke="${accent}" stroke-width="10"/>
  <rect x="70" y="70" width="660" height="660" fill="none" stroke="${second}" stroke-width="4"/>
  <g fill="none" stroke="${accent}" stroke-width="6" opacity="0.9">
    <path d="M400 150 L520 280 L400 410 L280 280 Z"/>
    <path d="M400 220 L470 290 L400 360 L330 290 Z" stroke="${second}"/>
    <circle cx="400" cy="290" r="18" fill="${accent}" stroke="none"/>
  </g>
  <g fill="${accent}" opacity="0.85">
    <circle cx="160" cy="640" r="10"/>
    <circle cx="240" cy="640" r="10"/>
    <circle cx="640" cy="640" r="10"/>
    <circle cx="560" cy="640" r="10"/>
  </g>
  <g stroke="${second}" stroke-width="5" opacity="0.7" fill="none">
    <path d="M120 560 H680"/>
    <path d="M120 700 H680"/>
  </g>
</svg>`;
}

for (const [name, main, second, accent] of rugs) {
  writeFileSync(join(outDir, `${name}.svg`), svg(main, second, accent), "utf8");
}
console.log(`Üretildi: ${rugs.length} görsel -> ${outDir}`);
