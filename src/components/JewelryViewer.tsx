"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom, SMAA, SSAO, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { MetalPreset, StonePreset } from "./presets";
import SceneControls from "./SceneControls";
import ViewerToolbar from "./ViewerToolbar";

const STONE_KEYWORDS = [
  "diamond", "stone", "crystal", "brilliant",
  "sapphire", "ruby", "emerald", "melee",
];

const HDRI_URL = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/photo_studio_01_1k.hdr";

// Constant to avoid re-creating a Vector2 on every render
const ABERRATION_OFFSET = new THREE.Vector2(0.0008, 0.0008);

const DEFAULT_POSITION: [number, number, number] = [0, 0, 2.4];

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
          attenuationDistance: 0.5,
          iridescence: 0.3,
          iridescenceIOR: 1.5,
          flatShading: true,
          envMapIntensity: 3.0,
          // @ts-ignore — dispersion added in Three.js r163
          dispersion: stone.dispersion,
        });
      } else {
        node.material = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(metal.color),
          metalness: metal.metalness,
          roughness: metal.roughness * 0.4,
          envMapIntensity: 2.0,
          // Clearcoat simulates the lacquer/polish on real jewelry
          clearcoat: 0.12,
          clearcoatRoughness: 0.08,
          // Iridescence: subtle rainbow on white gold / platinum only
          iridescence: metal.iridescence,
          iridescenceIOR: 2.0,
          iridescenceThicknessRange: [100, 400],
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

export default function JewelryViewer({ modelUrl, metal, stone }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const wasPlayingRef = useRef(true);

  useEffect(() => {
    const fn = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  const handleDragStart = useCallback(() => {
    wasPlayingRef.current = isPlaying;
    setIsPlaying(false);
  }, [isPlaying]);

  const handleDragEnd = useCallback(() => {
    if (wasPlayingRef.current) setIsPlaying(true);
  }, []);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((p) => {
      wasPlayingRef.current = !p;
      return !p;
    });
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setTargetPosition(null);
  }, []);

  const handleReset = useCallback(() => {
    setTargetPosition(DEFAULT_POSITION);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: DEFAULT_POSITION, fov: 35 }}
        shadows
        resize={{ debounce: 50 }}
        gl={{
          toneMapping: THREE.NeutralToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMappingExposure: 1.1,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.3} color="#e8f0ff" />
        <directionalLight position={[5, 5, 5]} intensity={4} castShadow color="#fff8f0" />
        <directionalLight position={[-4, 2, 3]} intensity={1.5} color="#b0ccff" />
        <directionalLight position={[0, 3, -5]} intensity={1.5} color="#ffffff" />
        {/* Soft overhead accent — adds specular catch-lights without harsh hotspot */}
        <pointLight position={[0, 2.5, 0.5]} intensity={2} distance={6} decay={2} color="#fff8f0" />
        <Suspense fallback={null}>
          <Model url={modelUrl} metal={metal} stone={stone} />
          <Environment files={HDRI_URL} background={false} />
          <ContactShadows opacity={0.4} blur={2} position={[0, -1.5, 0]} />
        </Suspense>
        <SceneControls
          isPlaying={isPlaying}
          targetPosition={targetPosition}
          onAnimationComplete={handleAnimationComplete}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        />
        <EffectComposer enableNormalPass>
          <SMAA />
          <SSAO radius={0.04} intensity={1.2} luminanceInfluence={0.6} />
          <Vignette eskil={false} offset={0.5} darkness={0.5} />
          <Bloom intensity={0.2} luminanceThreshold={0.85} luminanceSmoothing={0.9} mipmapBlur />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={ABERRATION_OFFSET} />
        </EffectComposer>
      </Canvas>
      <ViewerToolbar
        isPlaying={isPlaying}
        isFullscreen={isFullscreen}
        onTogglePlay={handleTogglePlay}
        onPreset={setTargetPosition}
        onReset={handleReset}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
}
