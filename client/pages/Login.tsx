import React, { useState } from "react";
import RippleCursor from "@/components/agrisync/RippleCursor";
import { useLanguage } from "@/context/LanguageContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";

export default function Login() {
  const { t, lang } = useLanguage();
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault(); setLoading(true);
    if (supports) speak("Logging in, please wait", { lang: `${lang}-IN` as any });
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <RippleCursor />
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg,#e8f5e9 0%,#f1f8e9 50%,#e3f2fd 100%)" }} />
      <div className="absolute inset-0 -z-10" style={{ backgroundImage: "radial-gradient(ellipse at bottom, rgba(255,200,0,.15), transparent 60%)" }} />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border bg-white/30 backdrop-blur-xl shadow-[0_10px_40px_rgba(46,125,50,.25)] animate-pop-in">
          <div className="p-6 pb-2 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-lime-400 grid place-items-center shadow-lg">
              <svg width="40" height="40" viewBox="0 0 120 120" aria-hidden>
                <circle cx="60" cy="60" r="56" fill="#e9f5ec" stroke="#bfe5c7" />
                <rect x="40" y="50" width="40" height="35" rx="8" fill="#66bb6a" />
                <rect x="36" y="40" width="48" height="16" rx="8" fill="#a5d6a7" />
                <path d="M30,45 L90,45 L78,28 L42,28 Z" fill="#ffe082" />
              </svg>
            </div>
            <h1 className="mt-4 text-xl font-extrabold">{t("welcome_back")} 🌾</h1>
            <button onClick={() => supports && speak("Enter your phone and password", { lang: `${lang}-IN` as any })} className="mt-2 inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1 C9 1 9 4 9 6 v4 c0 2 0 5 3 5 s3-3 3-5 V6 c0-2 0-5-3-5"/><path d="M19 10 v2 a7 7 0 0 1-14 0 v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
              Voice help
            </button>
          </div>
          <form onSubmit={onSubmit} className="p-6 pt-2">
            <label className="block text-sm font-medium text-gray-700">{t("username")}</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2 shadow-inner focus-within:shadow-emerald-200">
              <span className="text-emerald-600">👤</span>
              <input required className="flex-1 bg-transparent outline-none" placeholder={t("username")} />
            </div>
            <label className="block mt-4 text-sm font-medium text-gray-700">{t("password")}</label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border bg-white/70 px-3 py-2 shadow-inner">
              <span className="text-emerald-600">🔒</span>
              <input required type={show ? "text" : "password"} className="flex-1 bg-transparent outline-none" placeholder={t("password")} />
              <button type="button" onClick={() => setShow((s) => !s)} className="text-sm text-emerald-700 focus:outline-none">{show ? "Hide" : "Show"}</button>
            </div>
            <button disabled={loading} className="mt-6 w-full rounded-2xl py-3 text-white font-semibold shadow-lg hover:shadow-xl transition-all" style={{ background: "linear-gradient(90deg,#2E7D32,#66BB6A)" }}>
              {t("login_btn")} 🌱
            </button>
            <div className="mt-4 flex items-center justify-between text-sm">
              <button type="button" className="px-3 py-2 rounded-xl border bg-white/70 hover:shadow">🔓 OTP</button>
              <button type="button" className="px-3 py-2 rounded-xl border bg-white/70 hover:shadow">🎙️ Voice</button>
              <div className="text-gray-600">
                {t("no_account")} <a href="/login?signup=1" className="text-emerald-700 underline">{t("sign_up")}</a>
              </div>
            </div>
            {loading && (
              <div className="mt-4 h-2 rounded-full bg-emerald-100 overflow-hidden">
                <div className="h-full bg-emerald-500 animate-grow" />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
