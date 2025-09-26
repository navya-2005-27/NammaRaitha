import React from "react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export type Language = {
  id: string;
  name: string; // display text
  speak: string; // what to speak on hover
  greet: string; // avatar speak
  lang?: string; // bcp47
  accentColor: string; // hex
  flagSVG: React.ReactNode;
};

const Pill: React.FC<{ l: Language; onSelect: (l: Language) => void }> = ({
  l,
  onSelect,
}) => {
  const { supports, speak } = useSpeechSynthesis();
  return (
    <button
      className="group relative focus:outline-none rounded-full shadow-xl transition-transform duration-300 focus:ring-4 focus:ring-[hsl(var(--agri-neon))]/40 hover:scale-105"
      style={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.9))",
      }}
      aria-label={`Select language ${l.name}`}
      onMouseEnter={() => supports && speak(l.speak, { lang: l.lang })}
      onFocus={() => supports && speak(l.speak, { lang: l.lang })}
      onClick={() => onSelect(l)}
    >
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{
          boxShadow: `0 0 20px ${l.accentColor}`,
          borderColor: l.accentColor,
        }}
      />
      <div className="relative z-10 px-5 py-4 min-w-[150px] flex items-center gap-3 rounded-full">
        <span className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-black/5">
          {l.flagSVG}
        </span>
        <span className="font-semibold text-lg text-gray-800">{l.name}</span>
      </div>
    </button>
  );
};

export default function LanguageGrid({
  onSelect,
}: {
  onSelect: (l: Language) => void;
}) {
  const FlagIndia = (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" fill="#FF9933" />
      <rect y="21.33" width="64" height="21.33" fill="#fff" />
      <rect y="42.66" width="64" height="21.33" fill="#138808" />
      <circle cx="32" cy="32" r="6" fill="#000080" />
    </svg>
  );
  const FlagGlobe = (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="30" fill="#4FC3F7" />
      <path
        d="M2 32h60M32 2v60M10 16h44M10 48h44"
        stroke="#fff"
        strokeWidth="3"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="14"
        ry="28"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
      />
    </svg>
  );

  const languages: Language[] = [
    {
      id: "hi",
      name: "हिंदी",
      speak: "Hindi",
      greet: "नमस्ते!",
      lang: "hi-IN",
      accentColor: "#FF9933",
      flagSVG: FlagIndia,
    },
    {
      id: "kn",
      name: "ಕನ್ನಡ",
      speak: "Kannada",
      greet: "ನಮಸ್ಕಾರ!",
      lang: "kn-IN",
      accentColor: "#FF9933",
      flagSVG: FlagIndia,
    },
    {
      id: "ta",
      name: "தமிழ்",
      speak: "Tamil",
      greet: "வணக்கம்!",
      lang: "ta-IN",
      accentColor: "#FF9933",
      flagSVG: FlagIndia,
    },
    {
      id: "en",
      name: "English",
      speak: "English",
      greet: "Hello!",
      lang: "en-IN",
      accentColor: "#00F0FF",
      flagSVG: FlagGlobe,
    },
    {
      id: "te",
      name: "తెలుగు",
      speak: "Telugu",
      greet: "నమస్తే!",
      lang: "te-IN",
      accentColor: "#FF9933",
      flagSVG: FlagIndia,
    },
    {
      id: "mr",
      name: "मराठी",
      speak: "Marathi",
      greet: "नमस्कार!",
      lang: "mr-IN",
      accentColor: "#FF9933",
      flagSVG: FlagIndia,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-[600px] mx-auto">
      {languages.map((l) => (
        <Pill key={l.id} l={l} onSelect={onSelect} />
      ))}
    </div>
  );
}
