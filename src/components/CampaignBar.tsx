import { brand } from "@/lib/brand";

// Üstte dönen kampanya/avantaj şeridi.
export function CampaignBar() {
  return (
    <div className="bg-brand text-white text-xs sm:text-sm">
      <div className="mx-auto max-w-7xl px-4 py-2 flex items-center gap-x-6 gap-y-1 overflow-x-auto no-scrollbar whitespace-nowrap justify-center">
        {brand.campaigns.map((c, i) => (
          <span key={i} className="shrink-0">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
