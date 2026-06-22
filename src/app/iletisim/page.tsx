import { brand } from "@/lib/brand";
import { whatsappContactLink } from "@/lib/whatsapp";

export const metadata = { title: "İletişim" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl text-ink">İletişim</h1>
      <p className="mt-3 text-ink/70">
        Sorularınız ve siparişleriniz için bize ulaşın. En hızlı yanıt için WhatsApp'ı tercih edin.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 gap-4">
        <a
          href={whatsappContactLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25D366] text-white rounded-xl p-5 flex items-center gap-3 hover:bg-[#1ebe5b] transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20z" />
          </svg>
          <div>
            <div className="font-medium">WhatsApp</div>
            <div className="text-sm text-white/80">Hemen yazın</div>
          </div>
        </a>

        <div className="bg-white border border-black/5 rounded-xl p-5">
          <div className="font-medium text-ink">Telefon & E-posta</div>
          <div className="text-sm text-ink/70 mt-2">{brand.phoneDisplay}</div>
          <div className="text-sm text-ink/70">{brand.email}</div>
        </div>

        <div className="bg-white border border-black/5 rounded-xl p-5 sm:col-span-2">
          <div className="font-medium text-ink">Adres</div>
          {brand.addressLines.map((a) => (
            <div key={a} className="text-sm text-ink/70 mt-1">{a}</div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-ink/40">
        Not: Bu bir demo vitrindir; çevrimiçi ödeme yerine sipariş WhatsApp üzerinden alınır.
      </p>
    </div>
  );
}
