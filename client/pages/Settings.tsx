import React from "react";
import RippleCursor from "@/components/agrisync/RippleCursor";
import { useLanguage } from "@/context/LanguageContext";

export default function Settings() {
  const { t, lang, setLang } = useLanguage();
  return (
    <div className="min-h-screen relative overflow-hidden">
      <RippleCursor />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg,#e8f5e9 0%,#f1f8e9 50%,#e3f2fd 100%)",
        }}
      />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-extrabold mb-4">{t("settings")}</h1>
        <div className="rounded-2xl border bg-white/80 backdrop-blur p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              className="rounded-xl border px-3 py-2 bg-white"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            More settings coming soon.
          </div>
        </div>
      </div>
    </div>
  );
}
