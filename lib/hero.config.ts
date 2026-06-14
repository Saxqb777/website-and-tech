/**
 * All the dials for the WebGL hero in one place.
 * Tweak numbers here and the shader updates without touching GLSL.
 *
 * The hero is a "living blueprint": a warped wireframe grid where
 * modular cells wake up and fade out of phase with each other.
 */
export const HERO_PARAMS = {
  // -- Structure --
  // Number of grid cells along the shorter axis.
  gridDensity: 14,
  // Grid line thickness (fraction of a cell).
  lineWidth: 0.012,
  // Fraction of cells that ever wake up.
  moduleRate: 0.22,
  // How fast cells cycle through their lifecycle.
  moduleSpeed: 0.45,
  // How strongly the FBM warp distorts the grid coordinates.
  warpAmount: 0.04,

  // -- Motion --
  // Underlying noise frequency (drives the warp field).
  noiseScale: 1.0,
  // Base time multiplier.
  timeSpeed: 0.45,
  // Extra construction activity scroll-velocity adds.
  velocityImpact: 1.4,
  // Cursor influence radius.
  mouseRadius: 0.55,
  // Cursor pull strength on the warp UV.
  mouseImpact: 1.0,
} as const;
