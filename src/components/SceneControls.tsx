"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

interface SceneControlsProps {
  isPlaying: boolean;
  targetPosition: [number, number, number] | null;
  onAnimationComplete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default function SceneControls({
  isPlaying,
  targetPosition,
  onAnimationComplete,
  onDragStart,
  onDragEnd,
}: SceneControlsProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    if (targetPosition) {
      targetRef.current = new THREE.Vector3(...targetPosition);
      // Reset orbit target to center so the camera looks at the model
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
      }
    } else {
      targetRef.current = null;
    }
  }, [targetPosition]);

  useFrame(({ camera }, delta) => {
    if (!controlsRef.current || !targetRef.current) return;

    const target = targetRef.current;
    camera.position.lerp(target, Math.min(1, 6 * delta));
    // Do NOT call controls.update() here — drei already calls it at priority -1
    // (before this frame at priority 0). A second call applies damping twice,
    // causing the camera to oscillate visibly.

    if (camera.position.distanceTo(target) < 0.001) {
      camera.position.copy(target);
      targetRef.current = null;
      onAnimationComplete();
    }
  });

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
