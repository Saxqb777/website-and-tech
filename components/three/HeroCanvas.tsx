"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { HeroPlane } from "@/components/three/HeroPlane";

/**
 * The R3F canvas wrapper for the hero. Sits behind the headline.
 * DPR is capped per-device so phones still render the shader at
 * a sensible cost without falling back to a static gradient.
 */
export function HeroCanvas() {
  const [maxDpr, setMaxDpr] = useState(2);

  useEffect(() => {
    // Phones (< 768px) → cap at 1.25 so even high-end devices don't
    // upscale a 4x pixel buffer. Tablets/laptops/desktops → 2.
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setMaxDpr(isMobile ? 1.25 : 2);
  }, []);

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, maxDpr]}
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
