// GitHub Pages alt yolu (basePath) için yardımcı.
// next/image ve next/link basePath'i otomatik uygular; ancak düz <img>
// ve elle oluşturulan URL'ler için bu yardımcıyı kullanın.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
