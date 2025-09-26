import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Particles({ color = "#4CAF50" }: { color?: string }) {
  const ref = useRef<any>(null);
  const positions = useMemo(() => {
    const p = new Float32Array(1500);
    for (let i = 0; i < p.length; i += 3) {
      p[i] = (Math.random() - 0.5) * 4;
      p[i + 1] = (Math.random() - 0.5) * 4;
      p[i + 2] = (Math.random() - 0.5) * 4;
    }
    return p;
  }, []);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.2;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

export default function SoilParticles({
  color = "#4CAF50",
}: {
  color?: string;
}) {
  return (
    <div className="w-full h-56 rounded-xl overflow-hidden border bg-white/60 backdrop-blur">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <Particles color={color} />
      </Canvas>
    </div>
  );
}
