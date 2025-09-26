import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useNavigate } from "react-router-dom";

export default function HeaderBar() {
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <header className="w-full sticky top-0 z-30 backdrop-blur-md bg-white/70 border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between animate-slide-down">
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
            {t("app_name")}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            aria-label="Language"
            className="rounded-full border px-3 py-1.5 bg-white/90 hover:shadow focus:outline-none"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="ta">தமிழ்</option>
          </select>
          <button
            onClick={() => navigate("/login")}
            className="rounded-full px-4 py-1.5 text-white shadow-md hover:shadow-lg focus:outline-none"
            style={{ background: "linear-gradient(90deg,#2E7D32,#43A047)" }}
          >
            {t("login")}
          </button>
          <button
            onClick={() => navigate("/login?signup=1")}
            className="rounded-full px-4 py-1.5 text-white shadow-md hover:shadow-lg focus:outline-none"
            style={{ background: "linear-gradient(90deg,#43A047,#66BB6A)" }}
          >
            {t("signup")}
          </button>
        </div>
      </div>
    </header>
  );
}
