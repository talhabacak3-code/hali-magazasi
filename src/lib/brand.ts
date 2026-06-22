// ============================================================================
// MARKA AYARI — İsim/logo belli olunca SADECE bu dosyayı düzenleyin.
// Header, Footer, meta başlıkları ve WhatsApp butonu buradan okur.
// ============================================================================

export const brand = {
  // Marka adı (geçici yer tutucu — gerçek isim gelince değiştirin)
  name: "Halı Evi",
  // Logonun altındaki kısa slogan
  tagline: "Eviniz için modern halılar",
  // Logo dosyası (public/brand/ içinde). SVG veya PNG olabilir.
  logo: "/brand/logo.svg",

  // Tema rengi (Tailwind ile birlikte CSS değişkeni olarak da kullanılır)
  themeColor: "#7c3f2d",

  // WhatsApp sipariş hattı — ülke kodu + numara, BOŞLUK/SEMBOL OLMADAN.
  // Örn. Türkiye: 90 532 000 00 00 -> "905320000000"
  whatsappNumber: "905555555555",

  // İletişim
  email: "iletisim@halievi.example",
  phoneDisplay: "+90 555 555 55 55",
  addressLines: ["Örnek Mah. Halı Cad. No: 1", "İstanbul, Türkiye"],

  // Sosyal medya (boş bırakılırsa footer'da gösterilmez)
  social: {
    instagram: "https://instagram.com/",
    facebook: "",
    tiktok: "",
  },

  // Kampanya barı mesajları
  campaigns: [
    "🚚 1500₺ ve üzeri ücretsiz kargo",
    "💳 Peşin fiyatına 6 taksit",
    "🔒 Güvenli alışveriş",
    "↩️ 14 gün içinde kolay iade",
  ],
} as const;

export type Brand = typeof brand;
