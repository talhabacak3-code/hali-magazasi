import Link from "next/link";
import { brand } from "@/lib/brand";
import { collections } from "@/data/categories";
import { whatsappContactLink } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-white font-serif text-xl">{brand.name}</div>
          <p className="mt-2 text-sm text-white/60">{brand.tagline}</p>
          <div className="mt-4 flex gap-3">
            {brand.social.instagram && (
              <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            )}
            <a href={whatsappContactLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.7.7-.9 1.6-.5 2.7a8 8 0 0 0 3.7 4.3c1.6.9 2.6.8 3.4.7.6-.1 1.4-.6 1.6-1.2.2-.5.2-1 .1-1.1l-.6-.1z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <div className="text-white font-medium mb-3">Koleksiyonlar</div>
          <ul className="space-y-2 text-sm">
            {collections.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/urunler?collection=${c.slug}`} className="hover:text-white">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-white font-medium mb-3">Kurumsal</div>
          <ul className="space-y-2 text-sm">
            <li><Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link></li>
            <li><Link href="/iletisim" className="hover:text-white">İletişim</Link></li>
            <li><Link href="/urunler" className="hover:text-white">Tüm Halılar</Link></li>
            <li><Link href="/favorilerim" className="hover:text-white">Favorilerim</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-white font-medium mb-3">İletişim</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li>{brand.phoneDisplay}</li>
            <li>{brand.email}</li>
            {brand.addressLines.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/50 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {year} {brand.name}. Tüm hakları saklıdır.</span>
          <span>Bu bir demo vitrindir — ödeme WhatsApp üzerinden alınır.</span>
        </div>
      </div>
    </footer>
  );
}
