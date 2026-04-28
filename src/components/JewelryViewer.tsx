"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import type { MetalPreset, StonePreset } from "./presets";

function Model({ url, metal, stone }: { url: string; metal: MetalPreset; stone: StonePreset }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    const STONE_KEYWORDS = ["diamond", "stone", "gem", "crystal", "jewel"];

    scene.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;

      const nodeName = node.name.toLowerCase();
      const matName = Array.isArray(node.material)
        ? node.material.map((m) => m.name).join(" ").toLowerCase()
        : (node.material as THREE.Material)?.name?.toLowerCase() ?? "";

      const isStone = STONE_KEYWORDS.some(
        (kw) => nodeName.includes(kw) || matName.includes(kw)
      );

      if (isStone) {
        node.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(stone.color),
          transmission: stone.transmission,
          ior: stone.ior,
          thickness: stone.thickness,
          roughness: stone.roughness,
          metalness: 0,
          reflectivity: 1,
          envMapIntensity: 2,
        });
      } else {
        node.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(metal.color),
          metalness: metal.metalness,
          roughness: metal.roughness,
          envMapIntensity: 1.5,
        });
      }
    });
  }, [scene, metal, stone]);

  return <primitive object={scene} />;
}

interface Props {
  modelUrl: string;
  metal: MetalPreset;
  stone: StonePreset;
}

export default function JewelryViewer({ modelUrl, metal, stone }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <Model url={modelUrl} metal={metal} stone={stone} />
        <Environment preset="studio" />
        <ContactShadows opacity={0.4} blur={2} position={[0, -1.5, 0]} />
      </Suspense>
      <OrbitControls autoRotate autoRotateSpeed={1} enableZoom enablePan={false} />
    </Canvas>
  );
}
