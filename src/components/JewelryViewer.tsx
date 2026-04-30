"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import type { MetalPreset, StonePreset } from "./presets";

function Model({ url, metal, stone }: { url: string; metal: MetalPreset; stone: StonePreset }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    const STONE_KEYWORDS = [
      "diamond", "stone", "gem", "crystal", "jewel",
      "facet", "brilliant", "pave", "melee",
      "glass", "transparent",
    ];

    scene.traverse((node: THREE.Object3D) => {
      if (!(node instanceof THREE.Mesh)) return;

      const nodeName = node.name.toLowerCase();
      const matName = Array.isArray(node.material)
        ? node.material.map((m: THREE.Material) => m.name).join(" ").toLowerCase()
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
          specularIntensity: 1.5,
          clearcoat: 1.0,
          clearcoatRoughness: 0.02,
          attenuationColor: new THREE.Color(stone.attenuationColor),
          attenuationDistance: 0.25,
          flatShading: true,
          envMapIntensity: 4.5,
        });
      } else {
        node.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(metal.color),
          metalness: metal.metalness,
          roughness: metal.roughness,
          envMapIntensity: 1.5,
        });
      }

      node.castShadow = true;
      node.receiveShadow = true;
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
      shadows
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        toneMappingExposure: 1.2,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} color="#d6eaff" />
      <directionalLight position={[5, 5, 5]} intensity={3} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={2} color="#a8cfff" />
      <Suspense fallback={null}>
        <Model url={modelUrl} metal={metal} stone={stone} />
        <Environment preset="apartment" background={false} />
        <ContactShadows opacity={0.4} blur={2} position={[0, -1.5, 0]} />
      </Suspense>
      <OrbitControls autoRotate autoRotateSpeed={1} enableZoom enablePan={false} />
    </Canvas>
  );
}
