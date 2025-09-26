import React, { useRef, useState } from "react";
import { useSound } from "@/hooks/useSound";

export default function HoloCard({
  icon,
  title,
  reason,
  onAccept,
  onReject,
}: {
  icon: React.ReactNode;
  title: string;
  reason: string;
  onAccept?: () => void;
  onReject?: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [gone, setGone] = useState(false);
  const startX = useRef<number | null>(null);
  const { playWhooshChime } = useSound();

  if (gone) return null;

  const onDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    startX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    const dx = startX.current != null ? e.clientX - startX.current : 0;
    startX.current = null;
    if (dx > 60) {
      setGone(true);
      playWhooshChime();
      onAccept?.();
    } else if (dx < -60) {
      setGone(true);
      playWhooshChime();
      onReject?.();
    }
  };

  return (
    <div
      className={`relative h-44 rounded-2xl cursor-pointer [perspective:1000px] select-none`}
      onClick={() => {
        setFlipped((f) => !f);
        playWhooshChime();
      }}
      onPointerDown={onDown}
      onPointerUp={onUp}
    >
      <div
        className={`absolute inset-0 rounded-2xl transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        <div className="absolute inset-0 rounded-2xl p-4 border bg-white/20 backdrop-blur shadow-[0_10px_40px_rgba(0,240,255,.15)] [backface-visibility:hidden]">
          <div className="text-3xl" aria-hidden>
            {icon}
          </div>
          <div className="mt-2 font-semibold">{title}</div>
          <div className="mt-1 text-xs opacity-80">Tap to flip for reason</div>
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow:
                "0 0 40px rgba(0,240,255,0.2) inset, 0 0 30px rgba(76,175,80,0.12) inset",
            }}
          />
        </div>
        <div className="absolute inset-0 rounded-2xl p-4 border bg-white/20 backdrop-blur [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="text-sm font-semibold mb-1">Why?</div>
          <div className="text-sm opacity-90">{reason}</div>
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGone(true);
                playWhooshChime();
                onReject?.();
              }}
              className="px-3 py-1 rounded-full border bg-white/60 hover:bg-white"
            >
              ✖
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setGone(true);
                playWhooshChime();
                onAccept?.();
              }}
              className="px-3 py-1 rounded-full text-white"
              style={{ background: "linear-gradient(90deg,#2E7D32,#66BB6A)" }}
            >
              ✔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
