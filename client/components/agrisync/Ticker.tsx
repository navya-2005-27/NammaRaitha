import React, { useRef } from "react";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useLanguage } from "@/context/LanguageContext";

const updates = [
  {
    icon: "🌾",
    en: "Wheat MSP up 5% this season",
    hi: "इस सीज़न में गेहूं MSP 5% बढ़ा",
    kn: "ಈ ಋತುವಿನಲ್ಲಿ ಗೋಧಿ MSP 5% ಏರಿಕೆ",
    ta: "இந்த பருவத்தில் கோதுமை MSP 5% உயர்வு",
  },
  {
    icon: "💧",
    en: "Irrigation alert: Save water, drip recommended",
    hi: "सिंचाई अलर्ट: पानी बचाएँ, ड्रिप सुझाई जाती है",
    kn: "ನೀರಾವರಿ ಎಚ್ಚರಿಕೆ: ನೀರನ್ನು ಉಳಿಸಿ, ಡ್ರಿಪ್ ಶಿಫಾರಸು",
    ta: "நீர்ப்பாசனம் எச்சரிக்கை: தண்ணீர் சேமிக்கவும், டிரிப் பரிந்துரை",
  },
  {
    icon: "☁",
    en: "Weather: Light rain expected tomorrow",
    hi: "मौसम: कल हल्की बारिश",
    kn: "ಹವಾಮಾನ: ನಾ���ೆ ಸ್ವಲ್ಪ ಮಳೆ ಸಾಧ್ಯತೆ",
    ta: "வானிலை: நாளை லேசான மழை",
  },
  {
    icon: "🐛",
    en: "Pest alert: Watch for fall armyworm",
    hi: "कीट अलर्ट: फॉल आर्मीवर्म से सावधान",
    kn: "ಹುಳು ಎಚ್ಚರಿಕೆ: ಫಾಲ್ ಆರ್ಮಿವೋರ್ಮ್ ಜಾಗ್ರತೆ",
    ta: "பூச்சி எச்சரிக்கை: ஃபால் ஆர்மிவோர்மை கவனிக்கவும்",
  },
];

export default function Ticker() {
  const { speak, supports } = useSpeechSynthesis({ rate: 0.95 });
  const { lang, t } = useLanguage();
  const trackRef = useRef<HTMLDivElement | null>(null);

  const readAll = () => {
    if (!supports) return;
    speak(t("voice_updates"));
    for (const u of updates)
      speak(`${u.icon} ${u[lang] || u.en}`, { lang: `${lang}-IN` as any });
  };

  return (
    <div className="w-full bg-white/80 border-b">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
        <button
          onClick={readAll}
          aria-label="Read updates"
          className="rounded-full w-9 h-9 grid place-items-center text-white shadow"
          style={{ background: "linear-gradient(90deg,#00F0FF,#4CAF50)" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 1 C9 1 9 4 9 6 v4 c0 2 0 5 3 5 s3-3 3-5 V6 c0-2 0-5-3-5" />
            <path d="M19 10 v2 a7 7 0 0 1-14 0 v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
          </svg>
        </button>
        <div
          className="relative overflow-hidden flex-1 group"
          onMouseEnter={() => {
            if (trackRef.current)
              trackRef.current.style.animationPlayState = "paused";
          }}
          onMouseLeave={() => {
            if (trackRef.current)
              trackRef.current.style.animationPlayState = "running";
          }}
        >
          <div
            ref={trackRef}
            className="whitespace-nowrap animate-ticker will-change-transform"
          >
            {updates.concat(updates).map((u, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 mr-8 text-sm text-gray-800"
              >
                <span>{u.icon}</span>
                <span>{(u as any)[lang] || u.en}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
