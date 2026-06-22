import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata = { title: "Hakkımızda" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-serif text-3xl text-ink">Hakkımızda</h1>
      <div className="mt-6 space-y-4 text-ink/75 leading-relaxed">
        <p>
          {brand.name}, evinize en uygun halıyı kolayca bulmanız için kuruldu. Modern, klasik,
          kilim ve bebek halılarına kadar geniş bir koleksiyon sunuyoruz.
        </p>
        <p>
          En sevdiğimiz özellik: <strong className="text-brand">Yerinde Gör</strong>. Telefonunuzun
          kamerasını açarak beğendiğiniz halıyı satın almadan önce odanızda görebilir, boyutunu ve
          yerleşimini deneyebilirsiniz. Böylece “acaba uyar mı?” sorusu ortadan kalkar.
        </p>
        <p>
          Tüm ürünlerimiz kaliteli iplikten üretilir; birçoğu yıkanabilir, kaymaz tabanlı ve pati
          dostudur. Sipariş ve sorularınız için WhatsApp hattımız her zaman açıktır.
        </p>
      </div>

      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        {[
          ["Yerinde Gör", "Kamerayla halıyı odanızda deneyin"],
          ["Hızlı İletişim", "WhatsApp ile anında sipariş"],
          ["Güvenli Alışveriş", "Kolay iade ve şeffaf fiyat"],
        ].map(([t, d]) => (
          <div key={t} className="bg-cream rounded-xl p-4">
            <div className="font-medium text-brand-dark">{t}</div>
            <div className="text-sm text-ink/60 mt-1">{d}</div>
          </div>
        ))}
      </div>

      <Link href="/urunler" className="inline-block mt-8 bg-brand text-white rounded-lg px-5 py-3 font-medium hover:bg-brand-dark transition-colors">
        Koleksiyonu Keşfet
      </Link>
    </div>
  );
}
