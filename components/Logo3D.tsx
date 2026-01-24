"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { Center, Float, Environment } from "@react-three/drei";

const SvgShape = ({ shape, color }: { shape: THREE.Shape; color: THREE.Color }) => {
  return (
    <mesh rotation={[Math.PI, 0, 0]} position={[0, 0, 0]}>
      <extrudeGeometry
        args={[
          shape,
          { depth: 2, bevelEnabled: true, bevelThickness: 0.5, bevelSize: 0.5 }
        ]}
      />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
    </mesh>
  );
};

const Svg3D = ({ url }: { url: string }) => {
  const svgData = useLoader(SVGLoader, url);
  const groupRef = useRef<THREE.Group>(null);

  const shapes = useMemo(() => {
    return svgData.paths.flatMap((path) =>
      path.toShapes(true).map((shape) => ({
        shape,
        color: new THREE.Color(path.color || "#ffffff"),
      }))
    );
  }, [svgData]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t / 2) * 0.2;
  });

  return (
    <Center top>
      <group ref={groupRef} scale={0.01}>
        {shapes.map((item, idx) => (
          <SvgShape key={idx} shape={item.shape} color={item.color} />
        ))}
      </group>
    </Center>
  );
};

export default function Logo3D() {
  return (
    <div className="w-full h-[60vh] bg-slate-900">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
        <Environment preset="city" />
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <Svg3D url="/Lakadel.svg" />
        </Float>
      </Canvas>
    </div>
  );
}
