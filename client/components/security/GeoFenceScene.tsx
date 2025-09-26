import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Fences() {
  const group = useRef<any>(null);
  useEffect(() => {
    if (!group.current) return;
    Array.from(group.current.children).forEach((c: any, i: number) => {
      c.scale.y = 0.01;
      setTimeout(() => {
        c.scale.y = 1;
      }, 80 * i);
    });
  }, []);
  const posts = useMemo(() => {
    const arr: JSX.Element[] = [];
    const size = 8;
    const step = 1;
    for (let x = -size; x <= size; x += step) {
      arr.push(
        <mesh key={`n${x}`} position={[x, 0.5, -size]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial
            color="#00ffc3"
            emissive="#00ffc3"
            emissiveIntensity={0.3}
          />
        </mesh>,
      );
      arr.push(
        <mesh key={`s${x}`} position={[x, 0.5, size]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial
            color="#00ffc3"
            emissive="#00ffc3"
            emissiveIntensity={0.3}
          />
        </mesh>,
      );
    }
    for (let z = -size; z <= size; z += step) {
      arr.push(
        <mesh key={`w${z}`} position={[-size, 0.5, z]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial
            color="#00ffc3"
            emissive="#00ffc3"
            emissiveIntensity={0.3}
          />
        </mesh>,
      );
      arr.push(
        <mesh key={`e${z}`} position={[size, 0.5, z]}>
          <boxGeometry args={[0.1, 1, 0.1]} />
          <meshStandardMaterial
            color="#00ffc3"
            emissive="#00ffc3"
            emissiveIntensity={0.3}
          />
        </mesh>,
      );
    }
    return arr;
  }, []);
  return <group ref={group}>{posts}</group>;
}

function Shield() {
  const mesh = useRef<any>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (mesh.current)
      mesh.current.material.opacity = 0.15 + Math.sin(t * 2) * 0.05;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <circleGeometry args={[8.5, 64]} />
      <meshBasicMaterial color="#00F0FF" transparent opacity={0.2} />
    </mesh>
  );
}

function Scarecrow() {
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.z = Math.sin(t * 2) * 0.05;
  });
  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#6D4C41" />
      </mesh>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#d7ccc8" />
      </mesh>
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#6D4C41" />
      </mesh>
    </group>
  );
}

export default function GeoFenceScene() {
  return (
    <div className="w-full h-[360px] rounded-2xl overflow-hidden border bg-white/60 backdrop-blur">
      <Canvas camera={{ position: [6, 5, 6], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={0.7} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[18, 18]} />
          <meshStandardMaterial color="#c8e6c9" />
        </mesh>
        <Fences />
        <Shield />
        <Scarecrow />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} />
      </Canvas>
    </div>
  );
}
