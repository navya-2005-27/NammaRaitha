import React, { useEffect } from "react";
import HeaderBar from "@/components/agrisync/HeaderBar";
import Ticker from "@/components/agrisync/Ticker";
import RippleCursor from "@/components/agrisync/RippleCursor";
import { useLanguage } from "@/context/LanguageContext";

const cards = [
  { icon: "🏛️", key: "Govt subsidies / crop prices", color: "#2E7D32" },
  { icon: "🤖", key: "AI crop health tips", color: "#43A047" },
  { icon: "🧮", key: "Market demand insights", color: "#66BB6A" },
  { icon: "🐛", key: "Pest/disease alerts", color: "#F9A825" },
];

export default function Welcome() {
  const { t } = useLanguage();
  useEffect(() => {
    document.body.style.background = "#f3faf4";
    return () => {
      document.body.style.background = "";
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <RippleCursor />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg,#d7f1df 0%,#f0fff4 40%,#e3f2fd 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: `radial-gradient(ellipse at bottom, rgba(46,125,50,0.25), transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.7))",
        }}
      />

      <HeaderBar />
      <Ticker />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6">
          🌱 {t("welcome_title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div
              key={c.key}
              className="group relative rounded-2xl p-5 bg-white/80 backdrop-blur border shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 120}ms` as any }}
            >
              <div
                className="text-4xl"
                aria-hidden
                style={{
                  filter: "drop-shadow(0 6px 12px rgba(46,125,50,.25))",
                }}
              >
                {c.icon}
              </div>
              <div
                className="mt-3 font-semibold text-gray-800"
                style={{ color: c.color }}
              >
                {c.key}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Farmer-friendly tips and insights tailored to your region.
              </div>
              <div
                className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `radial-gradient(circle, ${c.color}33, transparent 70%)`,
                }}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
