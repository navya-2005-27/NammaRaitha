import React, { useMemo, useState } from "react";
import RippleCursor from "@/components/agrisync/RippleCursor";
import { useLanguage } from "@/context/LanguageContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import HoloCard from "@/components/recommendations/HoloCard";

export default function Recommendations() {
  const { t, lang } = useLanguage();
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const [sprinkler, setSprinkler] = useState(false);
  const recs = useMemo(() => ([
    { icon: "💧", title: "Switch to drip irrigation in 2 days.", reason: "Low rainfall trend and better water efficiency." },
    { icon: "🌱", title: "Apply 20kg Nitrogen in Zone 3.", reason: "Soil nitrogen low, improves growth." },
    { icon: "🐛", title: "Use eco-friendly pesticide spray next week.", reason: "Leaf scan found pest signs; neem works well." },
    { icon: "🌾", title: "Plant maize instead of wheat this season.", reason: "Moisture profile favors maize; yield +30% expected." },
  ]), []);

  const readAll = () => { if (!supports) return; for (const r of recs) speak(r.title, { lang: `${lang}-IN` as any }); };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "linear-gradient(120deg,#e6fff5,#e8f5ff)" }}>
      <RippleCursor />
      <div className="absolute inset-0 -z-10 animate-wave" />

      <header className="w-full sticky top-0 z-20 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-extrabold">🤖 {t("smart_plan_title")}</h1>
            <div className="text-sm text-gray-600">{t("smart_plan_sub")}</div>
          </div>
          <button onClick={readAll} className="rounded-full w-9 h-9 grid place-items-center text-white shadow" style={{ background: "linear-gradient(90deg,#00F0FF,#4CAF50)" }}>🎙</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recs.map((r, i) => (
              <HoloCard key={i} icon={<span>{r.icon}</span>} title={r.title} reason={r.reason} onAccept={() => supports && speak(r.title + " accepted", { lang: `${lang}-IN` as any })} onReject={() => supports && speak(r.title + " rejected", { lang: `${lang}-IN` as any })} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5">
          <h2 className="font-semibold mb-2">🌾 {t("alt_crops")}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 flex items-start gap-3"><div className="text-3xl">🌽</div><div><div className="font-semibold">Maize</div><div className="text-sm text-gray-600">Yield can be +30% higher in current moisture.</div></div></div>
            <div className="rounded-xl border p-4 flex items-start gap-3"><div className="text-3xl">🫘</div><div><div className="font-semibold">Pulses</div><div className="text-sm text-gray-600">Require less water → good for dry season.</div></div></div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5">
          <h2 className="font-semibold mb-2">🐞 {t("pesticide_recs")}</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-3 rounded-2xl border bg-white/70 hover:bg-white transition">Spray neem-based solution this week.</button>
            <button className="px-4 py-3 rounded-2xl border bg-white/70 hover:bg-white transition">Trap-based pest control for locusts in Zone 2.</button>
          </div>
        </section>

        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5">
          <h2 className="font-semibold mb-2">💧 IoT Smart Sprinklers</h2>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" className="peer sr-only" checked={sprinkler} onChange={(e) => { setSprinkler(e.target.checked); if (supports) speak(e.target.checked ? t("sprinkler_on") : "Sprinklers off", { lang: `${lang}-IN` as any }); }} />
              <div className="w-14 h-8 rounded-full bg-gray-300 peer-checked:bg-emerald-500 relative transition">
                <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition peer-checked:translate-x-6" />
              </div>
              <span className="ml-2">{t("sprinkler_toggle")}</span>
            </label>
          </div>
          {sprinkler && (
            <div className="mt-4 h-32 rounded-xl border relative overflow-hidden bg-emerald-50">
              <div className="absolute inset-0 animate-water" />
              <div className="absolute inset-x-0 bottom-3 text-center text-emerald-700">Sprinklers active for 10 min.</div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
