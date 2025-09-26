import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useNavigate } from "react-router-dom";

export default function TopBar({ summary }: { summary: string }) {
  const { lang, t } = useLanguage();
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const navigate = useNavigate();
  const read = () => {
    if (supports) {
      speak(t("read_dashboard"), { lang: `${lang}-IN` as any });
      speak(summary, { lang: `${lang}-IN` as any });
    }
  };

  return (
    <header className="w-full z-30 backdrop-blur-md bg-white/70 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-lime-500 grid place-items-center shadow-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20c2-5 6-8 8-8s6 3 8 8" />
              <path d="M12 2v4" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
            </svg>
          </div>
          <div className="font-extrabold tracking-tight text-lg">
            AGRI-SCAN AI
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm px-3 py-1.5 rounded-full border bg-white/80">
            {lang.toUpperCase()}
          </div>
          <button
            onClick={read}
            aria-label="Read dashboard"
            className="rounded-full w-9 h-9 grid place-items-center text-white shadow"
            style={{ background: "linear-gradient(90deg,#00F0FF,#4CAF50)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1 C9 1 9 4 9 6 v4 c0 2 0 5 3 5 s3-3 3-5 V6 c0-2 0-5-3-5" />
              <path d="M19 10 v2 a7 7 0 0 1-14 0 v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
            </svg>
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="rounded-full w-9 h-9 grid place-items-center bg-white border shadow hover:shadow-md"
            aria-label={t("settings")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 3.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09c0 .63.37 1.2.95 1.51.58.31 1.28.25 1.82-.15l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.44.44-.56 1.1-.33 1.67.23.57.78.93 1.39.96H22a2 2 0 1 1 0 4h-.09c-.63 0-1.2.37-1.51.95z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
