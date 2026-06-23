"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import { labelOf, sizes as allSizes } from "@/data/categories";

type Status = "loading" | "ready" | "error";

// Halı, zemine yatık bir yamuk (perspektif) olarak ÇİZİLİR; hem canlı önizleme
// hem de "Fotoğraf çek" aynı çizim fonksiyonunu kullandığından birebir eşleşir.
type Transform = {
  x: number; // yakın kenar merkezinin yatay kayması (px)
  y: number; // yakın kenar merkezinin dikey kayması (px)
  scale: number; // kullanıcı yakınlaştırma çarpanı
  rotZ: number; // düzlemde dönüş (derece)
  tilt: number; // zemine yatırma 0..1 (0 = dik, 1 = tam zemin)
  opacity: number;
};

const INITIAL: Transform = { x: 0, y: 0, scale: 1, rotZ: 0, tilt: 0.72, opacity: 0.97 };

// "200x290" -> { w:200, h:290 }
function parseSize(size?: string): { w: number; h: number } {
  if (!size) return { w: 200, h: 290 };
  const m = size.match(/(\d+)\s*x\s*(\d+)/i);
  if (!m) return { w: 200, h: 290 };
  return { w: Number(m[1]), h: Number(m[2]) };
}

export function PlaceInRoom({
  imageSrc,
  productName,
  sizes = [],
  initialSize,
  onClose,
}: {
  imageSrc: string;
  productName: string;
  sizes?: string[];
  initialSize?: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [t, setT] = useState<Transform>(INITIAL);
  const [size, setSize] = useState<string | undefined>(initialSize ?? sizes[0]);
  const [imgReady, setImgReady] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });

  // --- Kamera ---
  useEffect(() => {
    let cancelled = false;
    async function start() {
      if (typeof window !== "undefined" && !window.isSecureContext) {
        setStatus("error");
        setErrorMsg("Kamera yalnızca güvenli (https) bağlantıda veya localhost'ta çalışır. Sayfayı https üzerinden açın.");
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setErrorMsg("Tarayıcınız kamera erişimini desteklemiyor.");
        return;
      }
      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: "environment" } },
            audio: false,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStatus("ready");
      } catch (err: unknown) {
        setStatus("error");
        const name = (err as DOMException)?.name;
        if (name === "NotAllowedError" || name === "SecurityError")
          setErrorMsg("Kamera izni reddedildi. Tarayıcı ayarlarından izin verip tekrar deneyin.");
        else if (name === "NotFoundError" || name === "OverconstrainedError")
          setErrorMsg("Kullanılabilir bir kamera bulunamadı.");
        else setErrorMsg("Kamera başlatılamadı. Lütfen tekrar deneyin.");
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  // Kaynak görseli yükle
  useEffect(() => {
    const im = new Image();
    im.onload = () => {
      imgRef.current = im;
      setImgReady(true);
    };
    im.src = asset(imageSrc);
  }, [imageSrc]);

  // Konteyner ölçüsü
  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (el) setBox({ w: el.clientWidth, h: el.clientHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [status]);

  // ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Gerçek ölçüden taban genişlik (px): ölçü büyüdükçe halı büyür
  const real = parseSize(size);
  const aspect = real.h / real.w; // uzunluk / genişlik
  const baseNearW = box.w
    ? Math.max(box.w * 0.16, Math.min(box.w * 0.98, (real.w / 200) * box.w * 0.62))
    : 0;

  // --- Halıyı yamuk (perspektif) olarak çiz ---
  const drawRug = useCallback(
    (ctx: CanvasRenderingContext2D, cw: number, ch: number) => {
      const img = imgRef.current;
      if (!img || !baseNearW) return;
      const nearW = baseNearW * t.scale;
      const f = t.tilt; // 0..1
      const conv = 0.5 * f; // uzak kenar daralması
      const vScale = 1 - 0.55 * f; // uzunluk kısalması (perspektif)
      const farW = nearW * (1 - conv);
      const screenH = nearW * aspect * vScale;

      const ax = cw / 2 + t.x;
      const ay = ch * 0.62 + t.y; // yakın kenar zemine yakın

      ctx.save();
      ctx.translate(ax, ay);
      ctx.rotate((t.rotZ * Math.PI) / 180);

      // Zemine oturma gölgesi
      ctx.save();
      ctx.scale(1, 0.26);
      const sh = ctx.createRadialGradient(0, 0, nearW * 0.08, 0, 0, nearW * 0.66);
      sh.addColorStop(0, "rgba(0,0,0,0.40)");
      sh.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(0, 0, nearW * 0.66, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Yakın (alt, y=0) -> uzak (üst, y=-screenH) yatay şeritlerle dokuyu yatır
      const N = 56;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      ctx.globalAlpha = t.opacity;
      for (let i = 0; i < N; i++) {
        const t0 = i / N;
        const t1 = (i + 1) / N;
        const wMid = nearW + (farW - nearW) * ((t0 + t1) / 2);
        const yTop = -screenH * t1;
        const hStrip = screenH * (t1 - t0) + 1;
        const srcY = ih * (1 - t1);
        const srcH = ih * (t1 - t0);
        ctx.drawImage(img, 0, srcY, iw, srcH, -wMid / 2, yTop, wMid, hStrip);
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    },
    [baseNearW, aspect, t],
  );

  // Önizleme katmanını yeniden çiz
  useEffect(() => {
    if (status !== "ready" || !imgReady || !box.w) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = box.w * dpr;
    canvas.height = box.h * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, box.w, box.h);
    drawRug(ctx, box.w, box.h);
  }, [status, imgReady, box, drawRug]);

  // --- Jestler ---
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastSingle = useRef<{ x: number; y: number } | null>(null);
  const lastPinch = useRef<{ dist: number; angle: number } | null>(null);

  const pinchMetrics = () => {
    const pts = [...pointers.current.values()];
    const dx = pts[1].x - pts[0].x;
    const dy = pts[1].y - pts[0].y;
    return { dist: Math.hypot(dx, dy), angle: (Math.atan2(dy, dx) * 180) / Math.PI };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) lastSingle.current = { x: e.clientX, y: e.clientY };
    if (pointers.current.size === 2) lastPinch.current = pinchMetrics();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1 && lastSingle.current) {
      const dx = e.clientX - lastSingle.current.x;
      const dy = e.clientY - lastSingle.current.y;
      lastSingle.current = { x: e.clientX, y: e.clientY };
      setT((p) => ({ ...p, x: p.x + dx, y: p.y + dy }));
    } else if (pointers.current.size === 2 && lastPinch.current) {
      const m = pinchMetrics();
      const scaleFactor = m.dist / lastPinch.current.dist;
      const angleDelta = m.angle - lastPinch.current.angle;
      lastPinch.current = m;
      setT((p) => ({
        ...p,
        scale: Math.min(5, Math.max(0.2, p.scale * scaleFactor)),
        rotZ: p.rotZ + angleDelta,
      }));
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    lastPinch.current = null;
    if (pointers.current.size === 1) {
      const only = [...pointers.current.values()][0];
      lastSingle.current = { ...only };
    } else lastSingle.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    const f = e.deltaY < 0 ? 1.06 : 0.94;
    setT((p) => ({ ...p, scale: Math.min(5, Math.max(0.2, p.scale * f)) }));
  };

  // --- Fotoğraf çek (önizlemeyle birebir) ---
  const capture = useCallback(() => {
    const video = videoRef.current;
    const el = containerRef.current;
    if (!video || !el) return;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement("canvas");
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const vw = video.videoWidth || cw;
    const vh = video.videoHeight || ch;
    const cover = Math.max(cw / vw, ch / vh);
    const dw = vw * cover;
    const dh = vh * cover;
    ctx.drawImage(video, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

    drawRug(ctx, cw, ch);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName.replace(/\s+/g, "-").toLowerCase()}-yerinde-gor.png`;
    a.click();
  }, [drawRug, productName]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" />
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {status !== "ready" && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center text-white">
            {status === "loading" ? (
              <div>
                <div className="mx-auto mb-4 w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="text-white/80">Kamera başlatılıyor… İzin isteğine “İzin Ver” deyin.</p>
              </div>
            ) : (
              <div className="max-w-sm">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-white/10 grid place-items-center">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 9v4M12 17h.01" />
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <p className="text-white/85">{errorMsg}</p>
                <p className="mt-3 text-white/50 text-sm">
                  İpucu: Telefonda gerçek kamera testi için site https üzerinden yayında olmalıdır.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Üst şerit */}
        <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-white text-sm font-medium drop-shadow">{productName}</span>
          <button
            onClick={onClose}
            aria-label="Kapat"
            className="text-white bg-white/15 hover:bg-white/25 rounded-full w-9 h-9 grid place-items-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {status === "ready" && (
          <div className="absolute top-14 inset-x-0 text-center pointer-events-none">
            <span className="text-white/80 text-xs bg-black/30 rounded-full px-3 py-1">
              Tek parmak: taşı · İki parmak: büyüt/döndür · Ölçü seç: gerçek boyut
            </span>
          </div>
        )}
      </div>

      {/* Alt kontroller */}
      {status === "ready" && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 to-transparent pt-8 pb-4 px-4">
          <div className="mx-auto max-w-lg space-y-3">
            {/* Ölçü seçimi — büyük ölçü = büyük halı */}
            {sizes.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-white/70 text-xs shrink-0">Ölçü:</span>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`shrink-0 text-xs rounded-lg px-2.5 py-1.5 border ${
                      size === s ? "bg-brand text-white border-brand" : "bg-white/10 text-white border-white/20"
                    }`}
                  >
                    {labelOf(allSizes, s)}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <label className="text-white/90 text-xs">
                Zemine yatır
                <input
                  type="range" min={0} max={100} value={Math.round(t.tilt * 100)}
                  onChange={(e) => setT((p) => ({ ...p, tilt: Number(e.target.value) / 100 }))}
                  className="w-full accent-[var(--color-brand-light)]"
                />
              </label>
              <label className="text-white/90 text-xs">
                Saydamlık
                <input
                  type="range" min={30} max={100} value={Math.round(t.opacity * 100)}
                  onChange={(e) => setT((p) => ({ ...p, opacity: Number(e.target.value) / 100 }))}
                  className="w-full accent-[var(--color-brand-light)]"
                />
              </label>
            </div>

            <div className="flex items-center justify-center gap-2">
              <CtrlBtn label="Döndür ◄" onClick={() => setT((p) => ({ ...p, rotZ: p.rotZ - 15 }))} />
              <CtrlBtn label="− Küçült" onClick={() => setT((p) => ({ ...p, scale: Math.max(0.2, p.scale * 0.9) }))} />
              <CtrlBtn label="Büyüt +" onClick={() => setT((p) => ({ ...p, scale: Math.min(5, p.scale * 1.1) }))} />
              <CtrlBtn label="► Döndür" onClick={() => setT((p) => ({ ...p, rotZ: p.rotZ + 15 }))} />
              <CtrlBtn label="Sıfırla" onClick={() => setT(INITIAL)} />
            </div>

            <button
              onClick={capture}
              className="w-full bg-brand hover:bg-brand-light text-white font-medium rounded-xl py-3 flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Fotoğrafı Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CtrlBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-white text-xs bg-white/15 hover:bg-white/25 rounded-lg px-2.5 py-2 whitespace-nowrap"
    >
      {label}
    </button>
  );
}
