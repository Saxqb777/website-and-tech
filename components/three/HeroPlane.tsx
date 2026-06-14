"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroFragmentShader, heroVertexShader } from "@/shaders/hero";
import { HERO_PARAMS } from "@/lib/hero.config";
import { siteConfig } from "@/lib/site.config";

/**
 * Full-viewport plane carrying the hero shader.
 * - Time advances every frame.
 * - Cursor is tracked from the window (works even when the canvas is behind text).
 * - Scroll velocity is computed from window.scrollY deltas and smoothed.
 */
export function HeroPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null!);
  const { size } = useThree();

  const mouse = useRef<[number, number]>([0.5, 0.5]);
  const mouseSmoothed = useRef<[number, number]>([0.5, 0.5]);
  const lastScrollY = useRef(0);
  const velocity = useRef(0);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uInk: { value: new THREE.Color(siteConfig.colors.ink) },
      uAccent: { value: new THREE.Color(siteConfig.colors.accent) },
      uGridDensity: { value: HERO_PARAMS.gridDensity },
      uLineWidth: { value: HERO_PARAMS.lineWidth },
      uModuleRate: { value: HERO_PARAMS.moduleRate },
      uModuleSpeed: { value: HERO_PARAMS.moduleSpeed },
      uWarpAmount: { value: HERO_PARAMS.warpAmount },
      uNoiseScale: { value: HERO_PARAMS.noiseScale },
      uTimeSpeed: { value: HERO_PARAMS.timeSpeed },
      uVelocityImpact: { value: HERO_PARAMS.velocityImpact },
      uMouseRadius: { value: HERO_PARAMS.mouseRadius },
      uMouseImpact: { value: HERO_PARAMS.mouseImpact },
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current = [
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      ];
    };
    lastScrollY.current = window.scrollY;
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    // Smooth mouse toward target (avoids jitter on fast moves)
    const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
    mouseSmoothed.current = [
      lerp(mouseSmoothed.current[0], mouse.current[0], 0.08),
      lerp(mouseSmoothed.current[1], mouse.current[1], 0.08),
    ];

    // Scroll velocity, normalized + smoothed
    const dy = Math.abs(window.scrollY - lastScrollY.current);
    lastScrollY.current = window.scrollY;
    const px_per_sec = dy / Math.max(delta, 1 / 60);
    const target = Math.min(px_per_sec / 2200, 1);
    velocity.current = lerp(velocity.current, target, 0.12);

    const m = matRef.current;
    if (!m) return;
    m.uniforms.uTime.value = state.clock.elapsedTime;
    m.uniforms.uMouse.value.set(
      mouseSmoothed.current[0],
      mouseSmoothed.current[1],
    );
    m.uniforms.uVelocity.value = velocity.current;
    m.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={heroVertexShader}
        fragmentShader={heroFragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
