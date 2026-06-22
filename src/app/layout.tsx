import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/lib/brand";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CampaignBar } from "@/components/CampaignBar";

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: `${brand.name} ile modern halıları evinizde "Yerinde Gör" özelliğiyle deneyin. Kaymaz tabanlı, yıkanabilir ve şık halı modelleri.`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <CampaignBar />
        <Header />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
