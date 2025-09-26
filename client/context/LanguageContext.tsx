import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type LangCode = "en" | "hi" | "kn" | "ta";

type Dict = Record<string, Partial<Record<LangCode, string>>>;

const dictionary: Dict = {
  app_name: { en: "AGRI-SCAN AI", hi: "एग्री-स्कैन एआई", kn: "ಅಗ್ರಿ-ಸ್ಕ್ಯಾನ್ AI", ta: "அக்ரி-ஸ்கேன் AI" },
  welcome_title: { en: "What's New for Farmers Today?", hi: "आज किसानों के लिए क्या नया है?", kn: "ಇಂದು ರೈತರಿಗೆ ಏನು ಹೊಸದು?", ta: "இன்று விவசாயிகளுக்கு என்ன புதியது?" },
  login: { en: "Login", hi: "लॉगिन", kn: "ಲಾಗಿನ್", ta: "உள்நுழை" },
  signup: { en: "Sign Up", hi: "साइन अप", kn: "ಸೈನ್ ಅಪ್", ta: "பதிவு" },
  voice_updates: { en: "Reading latest updates", hi: "नवीनतम अपडेट पढ़ रहा हूँ", kn: "ಇತ್ತೀಚಿನ ಅಪ್ಡೇಟ್‌ಗಳನ್ನು ಓ��ುತ್ತಿದೆ", ta: "சமீபத்திய புதுப்பிப்புகளை வாசிக்கிறது" },
  welcome_back: { en: "Welcome Back to Agri-Scan AI", hi: "एग्री-स्कैन एआई में आपका स्वागत है", kn: "ಅಗ್ರಿ-ಸ್ಕ್ಯಾನ್ AIಗೆ ಮತ್ತೆ ಸುಸ್ವಾಗತ", ta: "அக்ரி-ஸ்கேன் AIக்கு மீண்டும் வரவேற்கிறோம்" },
  username: { en: "Username or Phone", hi: "यूज़रनेम या फ़ोन", kn: "ಬಳಕೆದಾರ ಅಥವಾ ಫೋನ್", ta: "பயனர் பெயர் அல்லது கைபேசி" },
  password: { en: "Password", hi: "पासवर्ड", kn: "ಪಾಸ್ವರ್ಡ್", ta: "கடவுச்சொல்" },
  login_btn: { en: "Enter Farm", hi: "फार्म में जाएं", kn: "ಫಾರ್ಮ್‌ಗೆ ಪ್ರವೇಶಿಸಿ", ta: "பண்ணைக்கு செல்" },
  no_account: { en: "Don't have an account?", hi: "खाता नहीं है?", kn: "ಖಾತೆ ಇಲ್ಲವೇ?", ta: "கணக்கு இல்லையா?" },
  sign_up: { en: "Sign Up", hi: "साइन अप", kn: "ಸೈನ್ ಅಪ್", ta: "பதிவு" },
};

function pick(dictKey: string, lang: LangCode): string {
  const entry = dictionary[dictKey];
  return entry?.[lang] || entry?.en || dictKey;
}

type Ctx = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (k: keyof typeof dictionary) => string;
};

const LanguageContext = createContext<Ctx | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const searchLang = useMemo(() => {
    if (typeof window === "undefined") return null;
    const p = new URLSearchParams(window.location.search);
    const l = p.get("lang");
    return (l as LangCode) || null;
  }, []);
  const [lang, setLangState] = useState<LangCode>(searchLang || (localStorage.getItem("lang") as LangCode) || "en");

  const setLang = useCallback((l: LangCode) => {
    setLangState(l); localStorage.setItem("lang", l);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", l);
    window.history.replaceState({}, "", url.toString());
  }, []);

  useEffect(() => { if (searchLang) setLang(searchLang); }, [searchLang, setLang]);

  const t = useCallback((k: keyof typeof dictionary) => pick(k, lang), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
