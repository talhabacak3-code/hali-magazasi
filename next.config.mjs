/** @type {import('next').NextConfig} */
// GitHub Pages için statik export. basePath build sırasında
// NEXT_PUBLIC_BASE_PATH ile verilir (örn. "/hali-magazasi").
// Yerel geliştirmede bu değişken boştur, site kökten (/) çalışır.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
