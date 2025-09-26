import { useCallback, useEffect, useRef } from "react";

function createCtx() {
  if (typeof window === "undefined") return null as AudioContext | null;
  const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
  return AC ? new AC() : null;
}

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  useEffect(() => {
    ctxRef.current = createCtx();
    return () => ctxRef.current?.close();
  }, []);

  const playWhooshChime = useCallback(async () => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const t0 = ctx.currentTime;
    // Whoosh: noise through LPF sweeping
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 1.0, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    noise.buffer = buffer;
    const lpf = ctx.createBiquadFilter();
    lpf.type = "lowpass";
    lpf.frequency.setValueAtTime(400, t0);
    lpf.frequency.exponentialRampToValueAtTime(6000, t0 + 0.7);
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.0001, t0);
    g1.gain.exponentialRampToValueAtTime(0.4, t0 + 0.2);
    g1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
    noise.connect(lpf).connect(g1).connect(ctx.destination);
    noise.start();
    noise.stop(t0 + 1.0);

    // Chime: two sine tones
    const tone = (freq: number, delay: number) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, t0 + delay);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0 + delay);
      g.gain.exponentialRampToValueAtTime(0.25, t0 + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + delay + 0.6);
      o.connect(g).connect(ctx.destination);
      o.start(t0 + delay);
      o.stop(t0 + delay + 0.7);
    };
    tone(880, 0.6);
    tone(1320, 0.65);
  }, []);

  const playRustle = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const t0 = ctx.currentTime;
    const noise = ctx.createBufferSource();
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++)
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
    noise.buffer = buffer;
    const hpf = ctx.createBiquadFilter();
    hpf.type = "highpass";
    hpf.frequency.setValueAtTime(1200, t0);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);
    noise.connect(hpf).connect(g).connect(ctx.destination);
    noise.start();
    noise.stop(t0 + 0.3);
  }, []);

  return { playWhooshChime, playRustle };
}
