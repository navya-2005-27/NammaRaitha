import React from "react";
import TopBar from "@/components/dashboard/TopBar";
import FarmScene from "@/components/dashboard/FarmScene";
import FeatureTile from "@/components/dashboard/FeatureTile";
import RippleCursor from "@/components/agrisync/RippleCursor";
import { useLanguage } from "@/context/LanguageContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const navigate = useNavigate();
  const name = "Raju";
  const greeting = `${t("greeting")} ${name}!`;
  const summary = `${greeting}. Healthy zones 60 percent, attention 25 percent, critical 15 percent.`;

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
      <div
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: `radial-gradient(ellipse at bottom, rgba(46,125,50,0.25), transparent 60%)`,
        }}
      />

      <TopBar summary={summary} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-extrabold">{greeting} 👋</h1>
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800">
              🟢 Healthy
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
              🟡 Needs Attention
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-800">
              🔴 Critical
            </span>
          </div>
        </div>

        <FarmScene />

        <section className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <FeatureTile
            icon={<span>💧</span>}
            label={t("soil_health")}
            color="#2E7D32"
            onClick={() => {
              if (supports)
                speak("Soil moisture moderate", { lang: `${lang}-IN` as any });
              navigate("/soil?lang=" + lang);
            }}
          />
          <FeatureTile
            icon={<span>🌍</span>}
            label={t("farm_view")}
            color="#43A047"
          />
          <FeatureTile
            icon={<span>🚜</span>}
            label={t("farm_safety")}
            color="#66BB6A"
            onClick={() => navigate("/security?lang=" + lang)}
          />
          <FeatureTile
            icon={<span>💡</span>}
            label={t("next_step")}
            color="#F9A825"
            onClick={() => navigate("/recommendations?lang=" + lang)}
          />
          <FeatureTile
            icon={<span>📊</span>}
            label={t("report_analysis")}
            color="#2E7D32"
            onClick={() => navigate("/reports?lang=" + lang)}
          />
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 shadow">
              🌿 Eco-friendly
            </span>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 shadow">
              💧 Water-saving
            </span>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 shadow">
              🛡️ Pest-free
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
