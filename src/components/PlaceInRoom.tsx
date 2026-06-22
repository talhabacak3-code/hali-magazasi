"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "loading" | "ready" | "error";

type Transform = {
  x: number; // merkeze göre yatay kayma (px)
  y: number; // merkeze göre dikey kayma (px)
  scale: number; // boyut çarpanı
  rotZ: number; // düzlem içi dönüş (derece)
  tilt: number; // zemine yatırma / perspektif (derece, rotateX)
  opacity: number; // saydamlık 0..1
};

const INITIAL: Transform = { x: 0, y: 0, scale: 1, rotZ: 0, tilt: 55, opacity: 0.92 };

export function PlaceInRoom({
  imageSrc,
  productName,
  onClose,
}: {
  imageSrc: string;
  productName: string;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [t, setT] = useState<Transform>(INITIAL);
  const [baseSize, setBaseSize] = useState(220);

  // --- Kamerayı başlat ---
  useEffect(() => {
    let cancelled = false;

    async function start() {
      // Güvenli bağlam kontrolü (kamera yalnız https / localhost)
      if (typeof window !== "undefined" && !window.isSecureContext) {
        setStatus("error");
        setErrorMsg(
          "Kamera yalnızca güvenli (https) bağlantıda veya localhost'ta çalışır. Sayfayı https üzerinden açın.",
        );
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
          // Arka kamera yoksa herhangi bir kamerayı dene (örn. masaüstü webcam)
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
        if (name === "NotAllowedError" || name === "SecurityError") {
          setErrorMsg("Kamera izni reddedildi. Tarayıcı ayarlarından izin verip tekrar deneyin.");
        } else if (name === "NotFoundError" || name === "OverconstrainedError") {
          setErrorMsg("Kullanılabilir bir kamera bulunamadı.");
        } else {
          setErrorMsg("Kamera başlatılamadı. Lütfen tekrar deneyin.");
        }
      }
    }

    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((tr) => tr.stop());
    };
  }, []);

  // Başlangıç boyutu: konteyner genişliğinin yarısı
  useEffect(() => {
    if (status !== "ready") return;
    const el = containerRef.current;
    if (el) setBaseSize(Math.round(Math.min(el.clientWidth, el.clientHeight) * 0.5));
  }, [status]);

  // ESC ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // --- Dokunma / fare jestleri ---
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
        scale: Math.min(4, Math.max(0.2, p.scale * scaleFactor)),
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
    } else {
      lastSingle.current = null;
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    const f = e.deltaY < 0 ? 1.06 : 0.94;
    setT((p) => ({ ...p, scale: Math.min(4, Math.max(0.2, p.scale * f)) }));
  };

  // --- Fotoğraf çek ---
  const capture = useCallback(() => {
    const video = videoRef.current;
    const img = imgRef.current;
    const el = containerRef.current;
    if (!video || !img || !el) return;

    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = document.createElement("canvas");
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // 1) Video karesini "cover" olarak çiz
    const vw = video.videoWidth || cw;
    const vh = video.videoHeight || ch;
    const cover = Math.max(cw / vw, ch / vh);
    const dw = vw * cover;
    const dh = vh * cover;
    ctx.drawImage(video, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

    // 2) Halıyı aynı ekran koordinatlarında çiz
    //    (zemin yatırması canvas'ta dikey sıkıştırma ~ cos(tilt) ile yaklaşıklanır)
    const size = baseSize * t.scale;
    ctx.save();
    ctx.translate(cw / 2 + t.x, ch / 2 + t.y);
    ctx.rotate((t.rotZ * Math.PI) / 180);
    ctx.scale(1, Math.cos((t.tilt * Math.PI) / 180));
    ctx.globalAlpha = t.opacity;
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${productName.replace(/\s+/g, "-").toLowerCase()}-yerinde-gor.png`;
    a.click();
  }, [baseSize, t, productName]);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Kamera + overlay alanı */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden touch-none select-none"
        style={{ perspective: "1000px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {status === "ready" && (
          <img
            ref={imgRef}
            src={imageSrc}
            alt={productName}
            draggable={false}
            className="absolute left-1/2 top-1/2 pointer-events-none will-change-transform"
            style={{
              width: baseSize,
              height: baseSize,
              opacity: t.opacity,
              transform: `translate(-50%, -50%) translate(${t.x}px, ${t.y}px) rotateX(${t.tilt}deg) rotateZ(${t.rotZ}deg) scale(${t.scale})`,
              boxShadow: "0 24px 40px rgba(0,0,0,0.45)",
              borderRadius: 6,
            }}
          />
        )}

        {/* Yükleniyor / hata katmanı */}
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

        {/* Üst bilgi şeridi */}
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
              Tek parmak: taşı · İki parmak: büyüt/döndür
            </span>
          </div>
        )}
      </div>

      {/* Alt kontrol paneli */}
      {status === "ready" && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4 px-4">
          <div className="mx-auto max-w-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-white/90 text-xs">
                Zemine yatır
                <input
                  type="range"
                  min={0}
                  max={75}
                  value={t.tilt}
                  onChange={(e) => setT((p) => ({ ...p, tilt: Number(e.target.value) }))}
                  className="w-full accent-[var(--color-brand-light)]"
                />
              </label>
              <label className="text-white/90 text-xs">
                Saydamlık
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={Math.round(t.opacity * 100)}
                  onChange={(e) => setT((p) => ({ ...p, opacity: Number(e.target.value) / 100 }))}
                  className="w-full accent-[var(--color-brand-light)]"
                />
              </label>
            </div>

            <div className="flex items-center justify-center gap-2">
              <CtrlBtn label="Döndür ◄" onClick={() => setT((p) => ({ ...p, rotZ: p.rotZ - 15 }))} />
              <CtrlBtn label="− Küçült" onClick={() => setT((p) => ({ ...p, scale: Math.max(0.2, p.scale * 0.9) }))} />
              <CtrlBtn label="Büyüt +" onClick={() => setT((p) => ({ ...p, scale: Math.min(4, p.scale * 1.1) }))} />
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
