"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { types, styles, colors, sizes } from "@/data/categories";

const groups = [
  { key: "type", label: "Halı Tipi", options: types },
  { key: "style", label: "Tarz", options: styles },
  { key: "size", label: "Ölçü", options: sizes },
] as const;

export function FilterBar() {
  const router = useRouter();
  const params = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (next.get(key) === value || value === "") next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.push(qs ? `/urunler?${qs}` : "/urunler", { scroll: false });
    },
    [params, router],
  );

  const activeCount = ["type", "style", "color", "size"].filter((k) => params.get(k)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-ink">Filtrele</h2>
        {activeCount > 0 && (
          <button
            onClick={() => router.push("/urunler", { scroll: false })}
            className="text-xs text-brand hover:underline"
          >
            Temizle ({activeCount})
          </button>
        )}
      </div>

      {groups.map((g) => (
        <div key={g.key}>
          <div className="text-xs uppercase tracking-wide text-ink/40 mb-2">{g.label}</div>
          <div className="flex flex-wrap gap-2">
            {g.options.map((o) => {
              const active = params.get(g.key) === o.slug;
              return (
                <button
                  key={o.slug}
                  onClick={() => setParam(g.key, o.slug)}
                  className={`text-xs rounded-full px-3 py-1.5 border transition-colors ${
                    active
                      ? "bg-brand text-white border-brand"
                      : "bg-white text-ink/70 border-black/10 hover:border-brand"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Renk filtresi — renk yuvarlakları */}
      <div>
        <div className="text-xs uppercase tracking-wide text-ink/40 mb-2">Renk</div>
        <div className="flex flex-wrap gap-2">
          {colors.map((c) => {
            const active = params.get("color") === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setParam("color", c.slug)}
                title={c.label}
                aria-label={c.label}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${
                  active ? "border-brand scale-110" : "border-black/10"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
