import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Tree({ x, z }: { x: number; z: number }) {
  const group = useRef<any>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current)
      group.current.rotation.z = Math.sin(t * 0.6 + x + z) * 0.03;
  });
  return (
    <group ref={group} position={[x, 0, z]}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 1.6, 8]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0, 1.7, 0]}>
        <coneGeometry args={[0.7, 1.2, 8]} />
        <meshStandardMaterial color="#2E7D32" />
      </mesh>
    </group>
  );
}

function Hut({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial color="#d7ccc8" />
      </mesh>
      <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <coneGeometry args={[0.7, 0.6, 4]} />
        <meshStandardMaterial color="#6D4C41" />
      </mesh>
    </group>
  );
}

function Cloud({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  const ref = useRef<any>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.position.x = x + Math.sin(t * 0.05 + z) * 2;
  });
  return (
    <group ref={ref} position={[x, 2.4, z]} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={1} metalness={0} />
      </mesh>
      <mesh position={[0.5, 0.1, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-0.5, 0.05, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function HealthPatch({ x, z, color }: { x: number; z: number; color: string }) {
  return (
    <mesh position={[x, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial color={color} transparent opacity={0.25} />
    </mesh>
  );
}

export default function FarmScene() {
  const trees = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        x: -3 + Math.random() * 6,
        z: -3 + Math.random() * 6,
        key: i,
      })),
    [],
  );
  return (
    <div className="w-full h-[380px] rounded-2xl overflow-hidden border bg-white/60 backdrop-blur">
      <Canvas camera={{ position: [4, 3, 4], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={0.7} />
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[12, 12]} />
          <meshStandardMaterial color="#c8e6c9" />
        </mesh>
        {/* Health zones */}
        <HealthPatch x={-2.5} z={-1.5} color="#4CAF50" />
        <HealthPatch x={1.5} z={-0.5} color="#FBC02D" />
        <HealthPatch x={0} z={2.0} color="#E53935" />
        {/* Props */}
        {trees.map((t) => (
          <Tree key={t.key} x={t.x} z={t.z} />
        ))}
        <Hut x={-1.2} z={1.4} />
        <Hut x={2.2} z={-1.2} />
        {/* Clouds */}
        <Cloud x={-2} z={-3} scale={1.2} />
        <Cloud x={2} z={2} scale={0.9} />
        <OrbitControls
          enablePan={false}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={3}
          maxDistance={7}
        />
      </Canvas>
    </div>
  );
}
