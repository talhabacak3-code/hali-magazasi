"use client";

import type { Product } from "@/data/products";
import { whatsappOrderLink } from "@/lib/whatsapp";

export function WhatsAppOrderButton({
  product,
  size,
}: {
  product: Product;
  size?: string;
}) {
  return (
    <a
      href={whatsappOrderLink(product, size)}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full bg-[#25D366] hover:bg-[#1ebe5b] text-white font-medium rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.7.7-.9 1.6-.5 2.7a8 8 0 0 0 3.7 4.3c1.6.9 2.6.8 3.4.7.6-.1 1.4-.6 1.6-1.2.2-.5.2-1 .1-1.1l-.6-.1z" />
      </svg>
      WhatsApp ile Sipariş Ver
    </a>
  );
}
