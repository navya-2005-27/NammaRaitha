import React from "react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useLanguage } from "@/context/LanguageContext";

export default function FeatureTile({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick?: () => void; }) {
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const { lang } = useLanguage();
  return (
    <button
      onMouseEnter={() => supports && speak(String(label), { lang: `${lang}-IN` as any })}
      onClick={() => { onClick?.(); if (supports) speak(String(label), { lang: `${lang}-IN` as any }); }}
      className="group relative rounded-2xl p-5 bg-white/85 backdrop-blur border shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 focus:outline-none"
      style={{ boxShadow: `0 10px 24px ${color}22` }}
    >
      <div className="text-3xl group-hover:scale-110 transition-transform" aria-hidden>{icon}</div>
      <div className="mt-2 font-semibold" style={{ color }}>{label}</div>
      <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle, ${color}33, transparent 70%)` }} />
    </button>
  );
}
