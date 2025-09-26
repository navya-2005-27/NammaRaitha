import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type VoiceOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voiceNamePrefer?: string[];
};

export function useSpeechSynthesis(defaults: VoiceOptions = {}) {
  const supports = typeof window !== "undefined" && "speechSynthesis" in window;
  const utterQueue = useRef<SpeechSynthesisUtterance[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    if (!supports) return;
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [supports]);

  const pickVoice = useCallback(
    (lang?: string, prefer?: string[]) => {
      if (!voices.length) return undefined;
      const preferred = prefer?.map((n) => n.toLowerCase()) ?? [];
      const byPref = voices.find((v) =>
        preferred.some((p) => v.name.toLowerCase().includes(p)),
      );
      if (byPref) return byPref;
      const byLang = voices.find((v) =>
        lang ? v.lang?.toLowerCase().startsWith(lang.toLowerCase()) : false,
      );
      return byLang ?? voices[0];
    },
    [voices],
  );

  const speak = useCallback(
    (text: string, opts: VoiceOptions = {}) => {
      if (!supports || !text) return;
      const u = new SpeechSynthesisUtterance(text);
      const {
        rate = defaults.rate ?? 0.95,
        pitch = defaults.pitch ?? 1,
        volume = defaults.volume ?? 1,
        lang = defaults.lang,
        voiceNamePrefer = defaults.voiceNamePrefer,
      } = opts;
      u.rate = rate;
      u.pitch = pitch;
      u.volume = volume;
      if (lang) u.lang = lang;
      const v = pickVoice(lang, voiceNamePrefer);
      if (v) u.voice = v;
      u.onend = () => {
        setSpeaking(false);
        utterQueue.current.shift();
        if (utterQueue.current.length)
          window.speechSynthesis.speak(utterQueue.current[0]);
      };
      u.onstart = () => setSpeaking(true);
      utterQueue.current.push(u);
      if (utterQueue.current.length === 1) window.speechSynthesis.speak(u);
    },
    [
      supports,
      defaults.rate,
      defaults.pitch,
      defaults.volume,
      defaults.lang,
      defaults.voiceNamePrefer,
      pickVoice,
    ],
  );

  const cancel = useCallback(() => {
    if (!supports) return;
    utterQueue.current = [];
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supports]);

  return useMemo(
    () => ({ speak, cancel, speaking, voices, supports }),
    [speak, cancel, speaking, voices, supports],
  );
}
