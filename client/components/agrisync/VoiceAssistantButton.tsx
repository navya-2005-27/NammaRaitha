import React, { useEffect, useRef, useState } from "react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useNavigate } from "react-router-dom";

export default function VoiceAssistantButton() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const navigate = useNavigate();
  const recRef = useRef<any>(null);

  const startListening = async () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR(); rec.lang = "en-IN"; rec.interimResults = true; rec.continuous = false;
      rec.onresult = (e: any) => { const t = Array.from(e.results).map((r: any) => r[0].transcript).join(" "); setTranscript(t); };
      rec.onend = () => { setListening(false); handleCommand(transcript); };
      recRef.current = rec; setListening(true); rec.start();
      if (supports) speak("How can I help your farm today?", { lang: "en-IN" });
    } else {
      setListening(true);
      if (supports) speak("How can I help your farm today? You can type your command.", { lang: "en-IN" });
    }
  };

  const handleCommand = (t: string) => {
    const text = t.toLowerCase();
    if (text.includes("soil") || text.includes("moisture")) navigate("/dashboard?tab=soil");
    else if (text.includes("weather")) navigate("/dashboard?tab=weather");
    else if (text.trim()) navigate("/dashboard");
  };

  useEffect(() => { if (!listening) setTranscript(""); }, [listening]);

  return (
    <>
      <button
        onClick={startListening}
        aria-label="Voice assistant"
        className={`fixed bottom-5 right-5 w-16 h-16 rounded-full text-white shadow-2xl flex items-center justify-center transition-all ${listening ? "animate-pulse-fast" : "animate-pulse-slow"}`}
        style={{ background: "linear-gradient(90deg, #00F0FF, #4CAF50)" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1 C9 1 9 4 9 6 v4 c0 2 0 5 3 5 s3-3 3-5 V6 c0-2 0-5-3-5"/><path d="M19 10 v2 a7 7 0 0 1-14 0 v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
      </button>
      {listening && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50" onClick={() => setListening(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-ping" />
              <div className="font-semibold">Listening…</div>
            </div>
            <div className="min-h-[60px] p-3 rounded-lg bg-gray-50 border text-gray-700">{transcript || "Say: Check soil moisture"}</div>
            {!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) && (
              <form
                className="mt-4 flex gap-2"
                onSubmit={(e) => { e.preventDefault(); const data = new FormData(e.currentTarget as HTMLFormElement); const t = String(data.get("cmd") || ""); setListening(false); handleCommand(t); }}
              >
                <input name="cmd" className="flex-1 rounded-lg border px-3 py-2" placeholder="Type a command" />
                <button className="px-4 py-2 rounded-lg text-white" style={{ background: "linear-gradient(90deg, #00F0FF, #4CAF50)" }}>Go</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
