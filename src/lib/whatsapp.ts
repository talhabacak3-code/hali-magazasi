import { brand } from "./brand";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

// Ürün için önceden doldurulmuş WhatsApp sipariş linki üretir.
export function whatsappOrderLink(product: Product, size?: string): string {
  const lines = [
    `Merhaba, ${brand.name} sitesinden bilgi/sipariş almak istiyorum.`,
    "",
    `Ürün: ${product.name}`,
    `Ürün kodu: ${product.code}`,
    size ? `Ölçü: ${size}` : `Ölçü: (seçiniz)`,
    product.price ? `Fiyat: ${formatPrice(product.price)}` : `Fiyat bilgisi rica ederim.`,
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${brand.whatsappNumber}?text=${text}`;
}

// Genel iletişim linki (ürünsüz).
export function whatsappContactLink(message?: string): string {
  const text = encodeURIComponent(
    message ?? `Merhaba, ${brand.name} hakkında bilgi almak istiyorum.`,
  );
  return `https://wa.me/${brand.whatsappNumber}?text=${text}`;
}
