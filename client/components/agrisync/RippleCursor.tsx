import React, { useEffect } from "react";

export default function RippleCursor() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const dot = document.createElement("div");
      dot.className =
        "pointer-events-none fixed rounded-full bg-emerald-400/30";
      const size = 16;
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - size / 2}px`;
      dot.style.top = `${e.clientY - size / 2}px`;
      dot.style.transform = "scale(1)";
      dot.style.border = "1px solid rgba(46,125,50,0.6)";
      dot.style.borderRadius = "9999px";
      dot.style.transition = "transform .6s ease, opacity .6s ease";
      dot.style.zIndex = "9999";
      document.body.appendChild(dot);
      requestAnimationFrame(() => {
        dot.style.transform = "scale(3)";
        dot.style.opacity = "0";
      });
      setTimeout(() => dot.remove(), 650);
    };
    window.addEventListener("pointerdown", handler);
    return () => window.removeEventListener("pointerdown", handler);
  }, []);
  return null;
}
