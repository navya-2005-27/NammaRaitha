import React, { useEffect, useRef, useState } from "react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export default function Avatar({
  onSpeak,
}: {
  onSpeak?: (phrase: string) => void;
}) {
  const [hover, setHover] = useState(false);
  const { supports, speak } = useSpeechSynthesis({
    rate: 0.95,
    voiceNamePrefer: ["Google", "Microsoft"],
  });
  const cycleRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "wave" | "tip">("idle");

  useEffect(() => {
    if (!hover) return;
    const seq = ["wave", "tip", "idle"] as const;
    let i = 0;
    const loop = () => {
      setPhase(seq[i % seq.length]);
      i++;
      cycleRef.current = window.setTimeout(loop, 900);
    };
    loop();
    return () => {
      if (cycleRef.current) clearTimeout(cycleRef.current);
      setPhase("idle");
    };
  }, [hover]);

  const say = (text: string) => {
    if (supports) speak(text, { pitch: 1 });
    onSpeak?.(text);
  };

  return (
    <div
      className="relative mx-auto w-36 h-36 cursor-pointer select-none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => say("Hello! How can I help your farm today?")}
      aria-label="Farmer guide avatar"
      role="img"
    >
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--agri-neon))] to-[hsl(var(--agri-green))] opacity-70 blur-2xl animate-pulse-slow`}
      />
      <div
        className={`absolute inset-0 rounded-full bg-[hsl(var(--background))] shadow-xl flex items-center justify-center transition-transform duration-500 ${phase === "idle" ? "animate-breathe" : ""}`}
        style={{
          transform:
            phase === "wave"
              ? "rotate(-3deg)"
              : phase === "tip"
                ? "rotate(3deg)"
                : undefined,
        }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
          <defs>
            <linearGradient id="skin" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#c68642" />
              <stop offset="100%" stopColor="#8d5524" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="56" fill="#e9e4d9" stroke="#ccc" />
          <circle cx="60" cy="62" r="28" fill="url(#skin)" />
          <rect x="40" y="50" width="40" height="35" rx="8" fill="#1e88e5" />
          <rect x="36" y="40" width="48" height="16" rx="8" fill="#90caf9" />
          <path d="M30,45 L90,45 L78,28 L42,28 Z" fill="#d8b35f" />
          <circle cx="50" cy="60" r="3" fill="#000" />
          <circle cx="70" cy="60" r="3" fill="#000" />
          <path
            d="M50,72 Q60,78 70,72"
            stroke="#000"
            strokeWidth="3"
            fill="none"
          />
          {phase !== "tip" ? (
            <g transform="translate(90,55)">
              <rect
                x="-6"
                y="-20"
                width="12"
                height="30"
                rx="6"
                fill="#c68642"
              />
              <circle cx="0" cy="-24" r="6" fill="#c68642" />
            </g>
          ) : (
            <g transform="translate(90,45) rotate(-20)">
              <rect
                x="-6"
                y="-20"
                width="12"
                height="30"
                rx="6"
                fill="#c68642"
              />
              <circle cx="0" cy="-24" r="6" fill="#c68642" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
