import React, { useEffect, useMemo, useState } from "react";
import RippleCursor from "@/components/agrisync/RippleCursor";
import { useLanguage } from "@/context/LanguageContext";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { toast } from "@/hooks/use-toast";

type SensorState = {
  soilMoisture: boolean;
  ph: boolean;
  weatherStation: boolean;
  fieldCameras: boolean;
  npk: boolean; // pending setup
  autoIrrigation: boolean;
};

export default function Settings() {
  const { t, lang, setLang } = useLanguage();
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });

  const [name, setName] = useState("Ramesh Kumar");
  const [email, setEmail] = useState("ramesh.kumar@farm.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [farmName, setFarmName] = useState("Kumar Agricultural Farm");
  const [area, setArea] = useState("35.6");
  const [location, setLocation] = useState("Karnataka, India");

  const [voiceLang, setVoiceLang] = useState<"en" | "hi" | "kn" | "ta">("kn");
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => localStorage.getItem("voiceEnabled") === "1");

  const [sensors, setSensors] = useState<SensorState>({
    soilMoisture: true,
    ph: true,
    weatherStation: false,
    fieldCameras: true,
    npk: false,
    autoIrrigation: false,
  });

  const [notifCritical, setNotifCritical] = useState(true);
  const [notifWeather, setNotifWeather] = useState(true);
  const [notifDrone, setNotifDrone] = useState(false);

  useEffect(() => { localStorage.setItem("voiceEnabled", voiceEnabled ? "1" : "0"); }, [voiceEnabled]);

  const announce = (msg: string) => { if (voiceEnabled && supports) speak(msg, { lang: `${voiceLang}-IN` as any }); };

  const onSave = () => {
    localStorage.setItem("settings", JSON.stringify({ name, email, phone, farmName, area, location, lang, voiceLang, voiceEnabled, sensors, notifCritical, notifWeather, notifDrone }));
    toast({ title: "Saved", description: "Settings updated successfully." });
    announce("Settings saved successfully");
  };

  const onReset = () => {
    setSensors({ soilMoisture: true, ph: true, weatherStation: false, fieldCameras: true, npk: false, autoIrrigation: false });
    setNotifCritical(true); setNotifWeather(true); setNotifDrone(false);
    setVoiceEnabled(false); setVoiceLang("kn"); setLang("en");
    toast({ title: "Reverted", description: "Defaults restored." });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <RippleCursor />
      <div className="absolute inset-0 -z-10" style={{ background: "linear-gradient(180deg,#e8f5e9 0%,#f1f8e9 50%,#e3f2fd 100%)" }} />

      <div className="border-b bg-gradient-to-r from-emerald-700 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-white/20 grid place-items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20c2-5 6-8 8-8s6 3 8 8"/><path d="M12 2v4"/><path d="M2 12h4"/><path d="M18 12h4"/></svg>
            </div>
            <div className="font-bold">AGRI-SCAN AI</div>
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm opacity-90">
            <a href="/dashboard?lang=" className="hover:underline">Dashboard</a>
            <a href="/reports?lang=" className="hover:underline">Reports</a>
            <a href="/settings" className="font-semibold underline">Settings</a>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Personal & Farm Settings */}
        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5">
          <h2 className="font-semibold mb-4">Personal & Farm Settings</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <input value={name} onChange={(e)=>setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Phone Number</label>
              <input value={phone} onChange={(e)=>setPhone(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Farm Name</label>
              <input value={farmName} onChange={(e)=>setFarmName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Total Area (Acres)</label>
              <input value={area} onChange={(e)=>setArea(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Location</label>
              <input value={location} onChange={(e)=>setLocation(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 bg-white" />
            </div>
          </div>
        </section>

        {/* Language Preferences */}
        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5">
          <h2 className="font-semibold mb-4">Language Preferences</h2>
          <div className="grid md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm text-gray-600">Primary Language</label>
              <select value={lang} onChange={(e)=>setLang(e.target.value as any)} className="mt-1 w-full rounded-xl border px-3 py-2 bg-white">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Voice Assistant Language</label>
              <select value={voiceLang} onChange={(e)=>setVoiceLang(e.target.value as any)} className="mt-1 w-full rounded-xl border px-3 py-2 bg-white">
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="sr-only peer" checked={voiceEnabled} onChange={(e)=>{ setVoiceEnabled(e.target.checked); announce(e.target.checked ? 'Voice assistant enabled' : 'Voice assistant disabled'); }} />
              <div className="w-14 h-8 rounded-full bg-gray-300 peer-checked:bg-emerald-500 relative transition">
                <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition peer-checked:translate-x-6" />
              </div>
              <span>Enable Voice Assistant</span>
            </label>
          </div>
        </section>

        {/* Sensor & Device Management */}
        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5">
          <h2 className="font-semibold mb-4">Sensor & Device Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "soilMoisture", label: "Soil Moisture Sensors", sub: "4 devices connected" },
              { key: "ph", label: "pH Sensors", sub: "2 devices connected" },
              { key: "weatherStation", label: "Weather Station", sub: "Disconnected" },
              { key: "fieldCameras", label: "Field Cameras", sub: "6 devices connected" },
              { key: "npk", label: "NPK Nutrient Sensors", sub: "Pending setup" },
              { key: "autoIrrigation", label: "Auto Irrigation System", sub: "Smart sprinkler control" },
            ].map((it) => (
              <div key={it.key} className="rounded-xl border p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.label}</div>
                  <div className="text-sm text-gray-600">{it.sub}</div>
                </div>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={(sensors as any)[it.key]} onChange={(e)=>{ const v = e.target.checked; setSensors((s)=>({ ...s, [it.key]: v } as any)); announce(`${it.label} ${v ? 'enabled' : 'disabled'}`); }} />
                  <div className="w-12 h-7 rounded-full bg-gray-300 peer-checked:bg-emerald-500 relative transition">
                    <span className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-5" />
                  </div>
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="rounded-2xl border bg-white/80 backdrop-blur p-5">
          <h2 className="font-semibold mb-4">Notification Preferences</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="rounded-xl border p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Critical Alerts</div>
                <div className="text-sm text-gray-600">Disease detection, pest outbreaks</div>
              </div>
              <input type="checkbox" className="w-5 h-5" checked={notifCritical} onChange={(e)=>{ setNotifCritical(e.target.checked); announce('Critical alerts '+(e.target.checked?'on':'off')); }} />
            </label>
            <label className="rounded-xl border p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Weather Alerts</div>
                <div className="text-sm text-gray-600">Rain, frost, extreme temperature</div>
              </div>
              <input type="checkbox" className="w-5 h-5" checked={notifWeather} onChange={(e)=>{ setNotifWeather(e.target.checked); announce('Weather alerts '+(e.target.checked?'on':'off')); }} />
            </label>
            <label className="rounded-xl border p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">Drone Monitoring Updates</div>
                <div className="text-sm text-gray-600">Flight status, image capture progress</div>
              </div>
              <input type="checkbox" className="w-5 h-5" checked={notifDrone} onChange={(e)=>{ setNotifDrone(e.target.checked); announce('Drone updates '+(e.target.checked?'on':'off')); }} />
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button onClick={onReset} className="px-4 py-2 rounded-lg border bg-white hover:shadow">Revert to Defaults</button>
          <button onClick={onSave} className="px-5 py-2 rounded-lg text-white shadow" style={{ background: "linear-gradient(90deg,#2E7D32,#66BB6A)" }}>Save Changes</button>
        </div>
      </main>
    </div>
  );
}
