import React, { useState } from "react";
import RippleCursor from "@/components/agrisync/RippleCursor";
import { useLanguage } from "@/context/LanguageContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import GeoFenceScene from "@/components/security/GeoFenceScene";

export default function Security() {
  const { t, lang } = useLanguage();
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const [alerts, setAlerts] = useState<string[]>([
    "⚠ Cattle detected at North Fence!",
    "⚠ Bird swarm near East!",
  ]);

  const readAlerts = () => {
    if (!supports) return;
    alerts.forEach((a) => speak(a, { lang: `${lang}-IN` as any }));
  };

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

      <header className="w-full sticky top-0 z-20 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-extrabold">🛡 {t("farm_security_title")}</h1>
            <div className="text-sm text-gray-600">
              {t("farm_security_sub")}
            </div>
          </div>
          <button
            onClick={readAlerts}
            className="rounded-full w-9 h-9 grid place-items-center text-white shadow"
            style={{ background: "linear-gradient(90deg,#00F0FF,#4CAF50)" }}
          >
            🎙
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <GeoFenceScene />

        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5">
          <h2 className="font-semibold mb-2">Intruder Alerts</h2>
          <div className="flex flex-wrap gap-2">
            {alerts.map((a, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-red-100 text-red-800 animate-bounce-slow"
              >
                {a}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5">
          <h2 className="font-semibold mb-2">Pest Outbreak Heatmap</h2>
          <div className="relative h-56 rounded-xl overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, rgba(255,0,0,.25), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255,255,0,.25), transparent 40%), radial-gradient(circle at 20% 70%, rgba(0,255,0,.2), transparent 40%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-2 text-center text-sm">
              🦗 Locust spread in nearby 5km zone.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
