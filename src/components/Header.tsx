"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import { collections } from "@/data/categories";
import { useFavorites } from "@/lib/favorites";
import { asset } from "@/lib/asset";

const navLinks = [
  { href: "/urunler", label: "Tüm Halılar" },
  { href: "/urunler?collection=persia", label: "Persia" },
  { href: "/urunler?collection=otantik", label: "Otantik" },
  { href: "/urunler?collection=greyna", label: "Greyna" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { favorites } = useFavorites();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Sol: mobil menü + logo */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 -ml-2 text-ink"
              aria-label="Menüyü aç"
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="flex items-center">
              <Image src={asset(brand.logo)} alt={brand.name} width={150} height={34} priority />
            </Link>
          </div>

          {/* Orta: masaüstü menü */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/80">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-brand transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Sağ: favoriler */}
          <div className="flex items-center gap-1">
            <Link
              href="/favorilerim"
              className="relative p-2 text-ink hover:text-brand transition-colors"
              aria-label="Favorilerim"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {mounted && favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] leading-none rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobil açılır menü */}
      {open && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-2.5 text-ink/80 hover:text-brand border-b border-black/5 last:border-0"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 pb-1 text-xs uppercase tracking-wide text-ink/40">Koleksiyonlar</div>
            <div className="flex flex-wrap gap-2 pb-3">
              {collections.map((c) => (
                <Link
                  key={c.slug}
                  href={`/urunler?collection=${c.slug}`}
                  className="text-xs bg-cream text-brand-dark rounded-full px-3 py-1"
                  onClick={() => setOpen(false)}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
