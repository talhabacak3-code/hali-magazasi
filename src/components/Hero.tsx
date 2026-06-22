import Link from "next/link";

// Ana banner — "Yerinde Gör" özelliğini öne çıkarır.
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20 grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-block bg-white/15 rounded-full px-3 py-1 text-xs font-medium mb-4">
            ✨ Yeni: Kamerayla “Yerinde Gör”
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl leading-tight">
            Halıyı satın almadan önce <span className="text-cream">odanızda görün</span>
          </h1>
          <p className="mt-4 text-white/80 max-w-md">
            Telefonunuzun kamerasını açın, beğendiğiniz halıyı gerçek zamanlı olarak zemininize
            yerleştirin; boyutlandırın, döndürün ve kararınızı verin.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/urunler"
              className="bg-white text-brand font-medium rounded-lg px-5 py-3 hover:bg-cream transition-colors"
            >
              Halıları Keşfet
            </Link>
            <Link
              href="/urunler"
              className="border border-white/40 rounded-lg px-5 py-3 hover:bg-white/10 transition-colors"
            >
              Nasıl Çalışır?
            </Link>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="aspect-[4/3] rounded-2xl bg-white/10 border border-white/20 backdrop-blur grid place-items-center">
            <div className="text-center px-6">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-white/15 grid place-items-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p className="text-white/80 text-sm max-w-xs">
                Kamerayı aç → halıyı yerleştir → odanda nasıl durduğunu gör
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
