"use client";

import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useRef } from "react";

interface SceneControlsProps {
  isPlaying: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default function SceneControls({ isPlaying, onDragStart, onDragEnd }: SceneControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
      autoRotate={isPlaying}
      autoRotateSpeed={1.5}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={(Math.PI * 5) / 6}
      minDistance={1.5}
      maxDistance={6}
      onStart={onDragStart}
      onEnd={onDragEnd}
    />
  );
}
