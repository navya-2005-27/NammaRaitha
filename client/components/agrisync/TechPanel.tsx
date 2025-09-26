import React from "react";
import ParticleCanvas from "./ParticleCanvas";
import Lottie from "lottie-react";
import drone from "@/assets/animations/drone-scan.json";

export default function TechPanel({ merged }: { merged: boolean }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[hsl(var(--agri-navy))] ${merged ? "shadow-2xl" : ""}`}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(0,240,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.08) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0">
        <ParticleCanvas className="w-full h-full" color="#00F0FF" />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top-1/3 w-40 opacity-80">
        <Lottie animationData={drone as any} loop autoplay />
      </div>
      <div className="absolute inset-x-0 top-6 text-center text-[hsl(var(--glow-white))] tracking-widest font-semibold">
        TECH
      </div>
      <div className="absolute left-6 top-6 w-2 h-2 bg-cyan-300 rounded-full shadow-[0_0_12px_6px_rgba(0,240,255,0.6)]" />
      <div className="absolute right-10 bottom-10 w-32 h-1 bg-cyan-400/50 blur-sm animate-pulse" />
    </div>
  );
}
