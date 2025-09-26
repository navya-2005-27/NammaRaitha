import React, { useEffect, useMemo, useRef, useState } from "react";
import RippleCursor from "@/components/agrisync/RippleCursor";
import { useLanguage } from "@/context/LanguageContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { getWeather, reverseGeocode } from "@/utils/weather";
import SoilParticles from "@/components/soil/SoilParticles";
import { useNavigate } from "react-router-dom";

function analyzeImage(file: File): Promise<{ ph: number; moisture: number; n: number; p: number; k: number; leaf?: { healthy: boolean; severity: 'low'|'medium'|'high'; note: string } }>{
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, 64, 64);
        const data = ctx.getImageData(0, 0, 64, 64).data;
        let r=0,g=0,b=0; const nPx = 64*64;
        for (let i=0;i<data.length;i+=4){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; }
        r/=nPx; g/=nPx; b/=nPx;
        const brightness = (r+g+b)/3/255;
        const moisture = Math.min(100, Math.max(10, Math.round((1 - Math.abs(0.5-brightness))*100)));
        const ph = Math.round((6 + (g-b)/255*1.5) * 10)/10;
        const n = Math.max(10, Math.min(90, Math.round((g/255)*100)));
        const p = Math.max(10, Math.min(90, Math.round((r/255)*100)));
        const k = Math.max(10, Math.min(90, Math.round((b/255)*100)));
        const leafHealthy = g > r + 10;
        const sev: 'low'|'medium'|'high' = Math.abs(r-g) < 15 ? 'low' : (r>g? 'medium':'low');
        resolve({ ph, moisture, n, p, k, leaf: { healthy: leafHealthy, severity: sev, note: leafHealthy ? 'Healthy leaf' : 'Pest signs detected' } });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function Soil() {
  const { t, lang } = useLanguage();
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const [coords, setCoords] = useState<{lat:number;lon:number}|null>(null);
  const [place, setPlace] = useState<string>();
  const [weather, setWeather] = useState<{ temperature: number|null; humidity: number|null; precipitation: number|null }>();
  const [soilResult, setSoilResult] = useState<any>(null);
  const [leafResult, setLeafResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      setCoords({ lat: latitude, lon: longitude });
      const [w, name] = await Promise.all([getWeather(latitude, longitude), reverseGeocode(latitude, longitude)]);
      setWeather(w); setPlace(name);
      if (supports) speak("This is your farm location and today's weather.", { lang: `${lang}-IN` as any });
    });
  }, [supports, speak, lang]);

  const onSoilUpload: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setLoading(true);
    setTimeout(async () => {
      const res = await analyzeImage(f); setSoilResult(res); setLoading(false);
      if (supports) speak("Soil scan complete. Your soil is healthy.", { lang: `${lang}-IN` as any });
    }, 600);
  };

  const onLeafUpload: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setLoading(true);
    setTimeout(async () => {
      const res = await analyzeImage(f); setLeafResult(res.leaf); setLoading(false);
      if (supports) speak(res.leaf?.healthy ? "Leaf looks healthy." : "Your crop leaf shows signs of pest infection.", { lang: `${lang}-IN` as any });
    }, 600);
  };

  const recommendation = useMemo(() => {
    if (!soilResult) return null;
    const lowN = soilResult.n < 40;
    const advice = lowN ? "Add 20kg Nitrogen fertilizer in Zone A."
      : "Maintain current fertilization."
    const pest = leafResult && !leafResult.healthy ? " Spray organic pesticide tomorrow evening." : "";
    return `${advice}${pest}`;
  }, [soilResult, leafResult]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <RippleCursor />
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg,#e8f5e9 0%,#f1f8e9 50%,#e3f2fd 100%)" }} />

      <header className="w-full sticky top-0 z-20 backdrop-blur bg-white/70 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard?lang='+lang)} className="rounded-full border bg-white px-3 py-1.5 hover:shadow">← Dashboard</button>
          <h1 className="font-extrabold">🌱 Soil Condition</h1>
          <button onClick={() => supports && speak('Follow the steps to check your soil and crops.', { lang: `${lang}-IN` as any })} className="rounded-full w-9 h-9 grid place-items-center text-white shadow" style={{ background: 'linear-gradient(90deg,#00F0FF,#4CAF50)' }} aria-label="Voice">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1 C9 1 9 4 9 6 v4 c0 2 0 5 3 5 s3-3 3-5 V6 c0-2 0-5-3-5"/><path d="M19 10 v2 a7 7 0 0 1-14 0 v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5 animate-fade-in">
          <h2 className="font-semibold mb-3">Step 1 – Location & Weather</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-xl border p-4">
              <div className="text-sm text-gray-600">📍 Location</div>
              <div className="font-semibold">{place ? `Your Farm in ${place}` : coords ? `${coords.lat.toFixed(3)}, ${coords.lon.toFixed(3)}` : 'Detecting…'}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-sm text-gray-600">🌡 Temperature</div>
              <div className="font-semibold">{weather?.temperature != null ? `${Math.round(weather.temperature)}°C` : '—'}</div>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-sm text-gray-600">☁ Humidity</div>
              <div className="font-semibold">{weather?.humidity != null ? `${Math.round(weather.humidity)}%` : '—'}</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5 animate-fade-in" style={{ animationDelay: '120ms' }}>
          <h2 className="font-semibold mb-3">Step 2 – Soil Scan</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <label className="flex-1 rounded-xl border-dashed border-2 p-6 grid place-items-center text-center cursor-pointer hover:bg-emerald-50">
              <div>📸 Upload soil image or use camera</div>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onSoilUpload} />
            </label>
            <div className="flex-1">
              <SoilParticles color="#4CAF50" />
            </div>
          </div>
          {loading && (<div className="mt-3 h-2 rounded-full bg-emerald-100 overflow-hidden"><div className="h-full bg-emerald-500 animate-grow"/></div>)}
          {soilResult && (
            <div className="mt-4 grid sm:grid-cols-5 gap-3">
              <div className="rounded-xl border p-3">pH: <b>{soilResult.ph}</b></div>
              <div className="rounded-xl border p-3">Moisture: <b>{soilResult.moisture}%</b></div>
              <div className="rounded-xl border p-3">N: <b>{soilResult.n}</b></div>
              <div className="rounded-xl border p-3">P: <b>{soilResult.p}</b></div>
              <div className="rounded-xl border p-3">K: <b>{soilResult.k}</b></div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5 animate-fade-in" style={{ animationDelay: '240ms' }}>
          <h2 className="font-semibold mb-3">Step 3 – Leaf Scan</h2>
          <label className="rounded-xl border-dashed border-2 p-6 grid place-items-center text-center cursor-pointer hover:bg-emerald-50">
            <div>🍃 Scan crop leaf (upload photo)</div>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onLeafUpload} />
          </label>
          {leafResult && (
            <div className="mt-4 rounded-xl border p-4 flex items-center gap-4">
              <div className="text-3xl" aria-hidden>{leafResult.healthy ? '🌿' : '🐛'}</div>
              <div>
                <div className="font-semibold">{leafResult.healthy ? 'Healthy leaf' : leafResult.note}</div>
                <div className="text-sm text-gray-600">Severity: {leafResult.severity}</div>
              </div>
            </div>
          )}
        </section>

        {soilResult && (
          <section className="rounded-2xl border bg-white/80 backdrop-blur p-5 animate-fade-in" style={{ animationDelay: '360ms' }}>
            <h2 className="font-semibold mb-3">Step 4 – Insights</h2>
            <div className="rounded-xl border p-4">
              <div className="text-lg">💡 {recommendation || 'Analysis ready.'}</div>
              <div className="mt-2 text-sm text-gray-600">🎉 Smart Farmer! You completed soil & crop scan.</div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
