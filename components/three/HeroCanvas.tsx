"use client";

import { Canvas } from "@react-three/fiber";
import { HeroPlane } from "@/components/three/HeroPlane";

/**
 * The R3F canvas wrapper for the hero. Sits behind the headline.
 * dpr capped at 2 to keep mid-tier laptops smooth; antialias off
 * because the shader has its own grain.
 */
export function HeroCanvas() {
  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 0, 1] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <HeroPlane />
    </Canvas>
  );
}

export default HeroCanvas;
