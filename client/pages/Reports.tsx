import React, { useMemo, useState } from "react";
import RippleCursor from "@/components/agrisync/RippleCursor";
import { useLanguage } from "@/context/LanguageContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sample = Array.from({ length: 12 }).map((_, i) => ({
  m: `M${i + 1}`,
  ai: Math.round(60 + Math.sin(i / 2) * 15 + i * 1.2),
  actual: Math.round(55 + Math.cos(i / 3) * 10 + i),
}));

export default function Reports() {
  const { t, lang } = useLanguage();
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const [mode, setMode] = useState("ndvi");

  const summary = useMemo(
    () => "This year, yield may be 15 percent higher due to better rainfall.",
    [],
  );

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#0A1A2F" }}
    >
      <RippleCursor />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% -10%, rgba(0,240,255,0.15), transparent 40%), radial-gradient(circle at 80% 20%, rgba(76,175,80,0.15), transparent 40%)",
        }}
      />

      <header className="w-full sticky top-0 z-20 backdrop-blur bg-white/10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-white">
          <h1 className="font-extrabold">📊 {t("reports_title")}</h1>
          <div className="flex items-center gap-2">
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="rounded-full bg-white/10 border-white/20 text-white px-3 py-1.5"
            >
              <option value="ndvi">NDVI</option>
              <option value="moisture">Moisture Index</option>
              <option value="pest">Pest Heatmap</option>
            </select>
            <button
              onClick={() =>
                supports && speak(summary, { lang: `${lang}-IN` as any })
              }
              className="rounded-full w-9 h-9 grid place-items-center text-white/90 bg-white/10 border border-white/20"
            >
              🎙
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-full px-3 py-1.5 bg-emerald-500 text-white font-semibold"
            >
              {t("download_report")}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 text-white">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold mb-3">Your Farm Health Summary</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={sample}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="ai" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="actual" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff22" />
                <XAxis dataKey="m" stroke="#b3e5fc" />
                <YAxis stroke="#e0f7fa" />
                <Tooltip
                  contentStyle={{
                    background: "#0A1A2F",
                    border: "1px solid #0ff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ai"
                  stroke="#00F0FF"
                  fillOpacity={1}
                  fill="url(#ai)"
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#4CAF50"
                  fillOpacity={1}
                  fill="url(#actual)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-[#E0F7FA]">📈 {summary}</div>
        </section>

        <section className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold mb-2">Before vs After Satellite</h3>
            <div className="relative h-56 rounded-xl overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg,#0a3d0a,#0a7f0a)",
                }}
              />
              <input
                type="range"
                min={0}
                max={100}
                defaultValue={50}
                onInput={(e) => {
                  const v = Number((e.target as HTMLInputElement).value);
                  (
                    e.currentTarget.parentElement!.querySelector(
                      ".clip",
                    ) as HTMLElement
                  ).style.clipPath = `inset(0 ${100 - v}% 0 0)`;
                }}
                className="absolute bottom-2 left-2 right-2"
              />
              <div
                className="absolute inset-0 clip"
                style={{
                  background: "linear-gradient(180deg,#1a5d1a,#2abf2a)",
                }}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold mb-2">Historical Trends</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[140px] rounded-xl border border-white/10 bg-white/10 p-3"
                >
                  <div className="text-sm opacity-80">Year {2020 + i}</div>
                  <div className="mt-2 text-2xl">{60 + i * 5}%</div>
                  <div className="mt-1">🌾 🌦 🐛</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold mb-2">🌟 {"Your Achievements"}</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-600/30 text-emerald-100">
              💧 You saved 20% water this season!
            </span>
            <span className="px-3 py-1 rounded-full bg-cyan-600/30 text-cyan-100">
              🐝 Reduced pesticide use by 10% – crops healthier!
            </span>
            <span className="px-3 py-1 rounded-full bg-lime-600/30 text-lime-100">
              ⚡ Improved soil health score to 85%.
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
