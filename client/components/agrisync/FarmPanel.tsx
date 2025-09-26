import React, { useRef } from "react";
import { useSound } from "@/hooks/useSound";

export default function FarmPanel({
  onCursorNear,
}: {
  onCursorNear?: () => void;
}) {
  const { playRustle } = useSound();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = containerRef.current!;
    const rect = el.getBoundingClientRect();
    const nearCrops = e.clientY > rect.bottom - 140; // near bottom crops
    if (nearCrops) {
      onCursorNear?.();
      playRustle();
      el.style.setProperty("--sway", "1.6");
    } else {
      el.style.setProperty("--sway", "1");
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #F5F0E6 0%, #F5F0E6 60%, #B3E5FC 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-orange-200/40 via-transparent to-sky-200/30" />
      {/* Birds */}
      <div className="absolute top-10 left-0 right-0 h-10 pointer-events-none animate-birds">
        <div className="absolute left-[-10%] top-0 w-6 h-6 bg-black/30 rounded-full" />
        <div className="absolute left-[10%] top-4 w-4 h-4 bg-black/30 rounded-full" />
        <div className="absolute left-[40%] top-2 w-5 h-5 bg-black/30 rounded-full" />
      </div>
      {/* Cattle */}
      <div className="absolute bottom-24 left-10 w-20 h-12 bg-[#8D6E63] rounded-[10px] before:content-[''] before:absolute before:-left-2 before:bottom-0 before:w-6 before:h-3 before:bg-[#8D6E63] before:rounded-full after:content-[''] after:absolute after:left-4 after:bottom-[-6px] after:w-2 after:h-6 after:bg-[#8D6E63]" />
      {/* Crops */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#8D6E63] via-[#A98274] to-transparent" />
      <div
        className="absolute bottom-0 left-0 right-0 h-36 flex items-end justify-around px-4"
        style={{ transformOrigin: "bottom" }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <svg key={i} className="w-10 h-28" viewBox="0 0 40 120">
            <g
              className="origin-bottom"
              style={{
                transform: `rotate(${(i % 2 ? -1 : 1) * 2}deg)`,
                animation: `sway calc(3s + ${i % 5}s) ease-in-out infinite`,
                animationPlayState: "running",
              }}
            >
              <path
                d="M20 120 C 18 80, 22 40, 20 0"
                stroke="#4CAF50"
                strokeWidth="3"
                fill="none"
              />
              {Array.from({ length: 6 }).map((_, j) => (
                <circle
                  key={j}
                  cx={20 + (j % 2 ? 6 : -6)}
                  cy={90 - j * 14}
                  r={4}
                  fill="#4CAF50"
                />
              ))}
            </g>
          </svg>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-2 text-center text-[#6d4c41] font-semibold tracking-widest">
        FARM
      </div>
    </div>
  );
}
