/**
 * All the dials for the WebGL hero in one place.
 * Tweak numbers here and the shader updates without touching GLSL.
 */
export const HERO_PARAMS = {
  // How dense the underlying noise is. Higher = finer veins.
  noiseScale: 1.35,
  // How violently the field folds back on itself.
  warp: 2.1,
  // Where the bright accent veins appear (0..1).
  veinThreshold: 0.55,
  // Width of the vein band — narrow = sharper streaks.
  veinWidth: 0.035,
  // How much extra turbulence scroll velocity adds.
  velocityImpact: 1.5,
  // Cursor pull strength.
  mouseRadius: 0.55,
  mouseImpact: 0.18,
  // Base time multiplier — slower = more "obsidian", faster = more "metal".
  timeSpeed: 0.06,
} as const;
