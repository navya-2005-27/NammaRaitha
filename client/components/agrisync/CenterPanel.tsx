import React, { useState } from "react";
import Avatar from "./Avatar";
import LanguageGrid, { Language } from "@/components/agrisync/LanguageGrid";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export default function CenterPanel({
  visible,
  onLanguageSelected,
}: {
  visible: boolean;
  onLanguageSelected: (lang: Language) => void;
}) {
  const [selected, setSelected] = useState<Language | null>(null);
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });

  const handleSelect = (l: Language) => {
    setSelected(l);
    if (supports) speak(l.greet, { lang: l.lang });
    onLanguageSelected(l);
  };

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="flex flex-col items-center gap-6">
        <Avatar onSpeak={() => {}} />
        <LanguageGrid onSelect={handleSelect} />
        {selected && (
          <button
            className="mt-2 px-6 py-3 rounded-full font-semibold text-white shadow-xl hover:translate-y-[-1px] transition-transform"
            style={{
              background: "linear-gradient(90deg, #00F0FF, #4CAF50)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
            onClick={() => onLanguageSelected(selected)}
          >
            🚜 Tap to Enter Your Farm
          </button>
        )}
      </div>
    </div>
  );
}
