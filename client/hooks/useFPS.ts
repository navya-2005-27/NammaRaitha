import { useEffect, useRef, useState } from "react";

export function useFPS(sampleMs: number = 1000) {
  const [fps, setFps] = useState(60);
  const frames = useRef(0);
  const last = useRef<number | null>(null);
  useEffect(() => {
    let raf = 0; let timer = 0;
    const loop = (t: number) => { frames.current++; raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    timer = window.setInterval(() => { setFps(frames.current * (1000 / sampleMs)); frames.current = 0; }, sampleMs);
    return () => { cancelAnimationFrame(raf); clearInterval(timer); };
  }, [sampleMs]);
  return fps;
}
