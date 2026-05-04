"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, SMAA, SSAO, Vignette } from "@react-three/postprocessing";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type { MetalPreset, StonePreset } from "./presets";

const STONE_KEYWORDS = [
  "diamond", "stone", "crystal", "brilliant",
  "sapphire", "ruby", "emerald", "melee",
];

// Photo Studio 01 — clean diffuse product photography lighting (Poly Haven)
const HDRI_URL = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/photo_studio_01_1k.hdr";

function Model({ url, metal, stone }: { url: string; metal: MetalPreset; stone: StonePreset }) {
  const { scene } = useGLTF(url);
  const ref = useRef<THREE.Group>(null);

  useEffect(() => {
    const root = scene.clone();

    root.traverse((node) => {
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
          attenuationDistance: 0.15,
          iridescence: 0.3,
          iridescenceIOR: 1.5,
          flatShading: true,
          envMapIntensity: 2.5,
          // @ts-ignore — dispersion added in Three.js r163
          dispersion: stone.dispersion,
        });
      } else {
        node.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(metal.color),
          metalness: metal.metalness,
          roughness: metal.roughness * 0.3,
          envMapIntensity: 2.5,
        });
      }

      node.castShadow = true;
      node.receiveShadow = true;
    });

    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const scale = 1.5 / Math.max(size.x, size.y, size.z);
    root.scale.setScalar(scale);
    const center = new THREE.Vector3();
    box.getCenter(center);
    root.position.sub(center.multiplyScalar(scale));

    if (ref.current) {
      ref.current.clear();
      ref.current.add(root);
    }
  }, [scene, metal, stone]);

  return <group ref={ref} />;
}

interface Props {
  modelUrl: string;
  metal: MetalPreset;
  stone: StonePreset;
}

export default function EnhancedViewer({ modelUrl, metal, stone }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 1, 2.8], fov: 45 }}
      shadows
      gl={{
        toneMapping: THREE.NeutralToneMapping,
        outputColorSpace: THREE.SRGBColorSpace,
        toneMappingExposure: 1.1,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Three-point studio lighting */}
      <ambientLight intensity={0.2} color="#e8f0ff" />
      <directionalLight position={[3, 5, 4]} intensity={4} castShadow color="#fff8f0" />
      <directionalLight position={[-4, 2, 3]} intensity={1.5} color="#b0ccff" />
      <directionalLight position={[0, 3, -5]} intensity={2} color="#ffffff" />

      <Suspense fallback={null}>
        <Model url={modelUrl} metal={metal} stone={stone} />
        <Environment files={HDRI_URL} background={false} />

        {/* Reflective studio ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <MeshReflectorMaterial
            mirror={0.5}
            blur={[300, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={0.6}
            roughness={1}
            color="#111111"
          />
        </mesh>
      </Suspense>

      <OrbitControls enableZoom enablePan={false} />

      <EffectComposer enableNormalPass>
        <SMAA />
        <SSAO radius={0.05} intensity={1.5} luminanceInfluence={0.5} />
        <Vignette eskil={false} offset={0.5} darkness={0.6} />
        <Bloom intensity={0.15} luminanceThreshold={0.92} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
