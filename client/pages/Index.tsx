import React, { useEffect, useRef, useState } from "react";
import TechPanel from "@/components/agrisync/TechPanel";
import FarmPanel from "@/components/agrisync/FarmPanel";
import CenterPanel from "@/components/agrisync/CenterPanel";
import VoiceAssistantButton from "@/components/agrisync/VoiceAssistantButton";
import { useSound } from "@/hooks/useSound";
import { useNavigate } from "react-router-dom";
import type { Language } from "@/components/agrisync/LanguageGrid";

export default function Index() {
  const [revealed, setRevealed] = useState(false);
  const [merged, setMerged] = useState(false);
  const [showCenter, setShowCenter] = useState(false);
  const { playWhooshChime } = useSound();
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 10); // start entrance
    const t2 = setTimeout(() => { setMerged(true); playWhooshChime(); setTimeout(() => setShowCenter(true), 600); }, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [playWhooshChime]);

  const onLanguageSelected = (l: Language) => {
    // route to dashboard placeholder
    navigate("/dashboard?lang=" + l.id);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <header className="absolute inset-x-0 top-4 flex justify-center z-20 pointer-events-none">
        <div className="px-4 py-2 rounded-full shadow-lg backdrop-blur-md bg-white/70 pointer-events-auto flex items-center gap-3">
          <span className="text-xl font-extrabold tracking-tight" style={{ background: "linear-gradient(90deg, #00F0FF, #4CAF50)", WebkitBackgroundClip: "text", color: "transparent" }}>AgriSync</span>
          <span className="text-sm opacity-80">Where Tech Meets the Soil</span>
        </div>
      </header>

      <div className="h-screen w-full relative">
        <div
          className={`absolute inset-y-0 left-0 ${merged ? "w-[30%]" : "w-1/2"} transition-[width,transform] duration-700 ease-out ${revealed ? "translate-x-0" : "-translate-x-full"}`}
          onMouseMove={(e) => {
            const el = e.currentTarget; const r = el.getBoundingClientRect();
            const rx = ((e.clientY - r.top) / r.height - 0.5) * -4; // -2..2 deg
            const ry = ((e.clientX - r.left) / r.width - 0.5) * 4;
            el.style.transform = `${revealed ? "translateX(0)" : "translateX(-100%)"} perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
          }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = revealed ? "translateX(0)" : "translateX(-100%)"; }}
        >
          <TechPanel merged={merged} />
        </div>
        <div className={`absolute inset-y-0 right-0 ${merged ? "w-[30%]" : "w-1/2"} transition-[width,transform] duration-700 ease-out ${revealed ? "translate-x-0" : "translate-x-full"}`}>
          <FarmPanel onCursorNear={() => {}} />
        </div>
        {/* Merge gradient */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${merged ? "opacity-100" : "opacity-0"}`} style={{ background: "linear-gradient(90deg, rgba(0,240,255,0.15), rgba(76,175,80,0.15))" }} />
        <CenterPanel visible={showCenter} onLanguageSelected={onLanguageSelected} />
      </div>

      <VoiceAssistantButton />
    </div>
  );
}
