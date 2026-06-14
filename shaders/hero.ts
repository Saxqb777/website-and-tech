// Hero shader — a "living blueprint": warped wireframe grid with
// modular cells that wake up, pulse, and fade out of phase with each
// other. Driven by the same domain-warped FBM motion as before so the
// whole field still flows organically.

export const heroVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    // Position is already in clip space (planeGeometry args [2, 2])
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const heroFragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;        // 0..1 viewport coords
  uniform float uVelocity;     // smoothed scroll velocity, 0..~1
  uniform vec2  uResolution;
  uniform vec3  uInk;
  uniform vec3  uAccent;

  // --- structure dials ---
  uniform float uGridDensity;     // grid cells along the shorter axis
  uniform float uLineWidth;       // grid line thickness in cell units
  uniform float uModuleRate;      // 0..1 fraction of cells that can wake up
  uniform float uModuleSpeed;     // cells per second cycling rate
  uniform float uWarpAmount;      // how strongly the FBM field warps the grid

  // --- motion dials ---
  uniform float uVelocityImpact;
  uniform float uMouseRadius;
  uniform float uMouseImpact;
  uniform float uTimeSpeed;
  uniform float uNoiseScale;

  // ---------- Hashes & noise ----------
  float hash11(float n) { return fract(sin(n) * 43758.5453123); }

  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.05;
      a *= 0.5;
    }
    return v * 0.5 + 0.5; // 0..1
  }

  // ---------- Main ----------
  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
    vec2 p = (uv - 0.5) * aspect;

    float t = uTime * uTimeSpeed * (1.0 + uVelocity * uVelocityImpact);

    // Cursor offset in shared coords
    vec2 m = (uMouse - 0.5) * aspect;
    float md = length(p - m);
    float mInfluence = smoothstep(uMouseRadius, 0.0, md);

    // Same domain-warp pipeline that gave the obsidian its flow
    vec2 q = vec2(
      fbm(p * uNoiseScale + t),
      fbm(p * uNoiseScale + t + vec2(5.2, 1.3))
    );
    vec2 r = vec2(
      fbm(p * uNoiseScale * 1.2 + q + vec2(1.7, 9.2)),
      fbm(p * uNoiseScale * 1.2 + q + vec2(8.3, 2.8) + t * 0.7)
    );

    // Apply the warp + cursor pull to the UVs we draw the grid in.
    vec2 wUv = uv + (r - 0.5) * uWarpAmount;
    wUv += (uMouse - 0.5) * mInfluence * uMouseImpact * 0.06;

    // ---------- Wireframe grid ----------
    vec2 g    = wUv * uGridDensity * vec2(aspect.x, 1.0);
    vec2 gf   = abs(fract(g) - 0.5);
    float gd  = min(gf.x, gf.y);
    // anti-aliased line width in cell units
    float lw  = uLineWidth;
    float lineMask = 1.0 - smoothstep(lw, lw + 0.02, gd);

    // Subtle "scanning" highlight that sweeps diagonally across the grid
    float sweep = smoothstep(0.0, 0.6, sin((wUv.x + wUv.y) * 4.0 + t * 0.6) * 0.5 + 0.5);

    // ---------- Modules (cells that wake up and fade out) ----------
    vec2 cell = floor(g);
    float cH  = hash21(cell + 17.13);

    // Each cell has a unique lifecycle phase. Some cells never wake up
    // (those with cH above uModuleRate).
    float active   = step(1.0 - uModuleRate, cH);
    float phase    = cH * 10.0 + t * uModuleSpeed;
    float window   = fract(phase);
    // ramp up, hold, ramp down — soft trapezoidal envelope
    float life     = smoothstep(0.0, 0.18, window)
                   * (1.0 - smoothstep(0.55, 0.85, window));
    float intensity = active * life;

    // Cursor "constructs faster" — boost lifecycle locally
    intensity = min(1.0, intensity + active * mInfluence * 0.5);

    // Inside-cell coords (-0.5..0.5)
    vec2 cuv  = fract(g) - 0.5;
    vec2 acuv = abs(cuv);

    // Module rectangle: thin outline + faint fill
    float outerEdge = max(acuv.x, acuv.y);
    float rectOutline = smoothstep(0.32, 0.30, outerEdge)
                      * (1.0 - smoothstep(0.30, 0.28, outerEdge));
    float rectFill    = smoothstep(0.30, 0.28, outerEdge);

    // A little "node" dot in the corner — adds the schematic feel
    vec2 corner = vec2(0.30, 0.30);
    float cornerDot = 1.0 - smoothstep(0.018, 0.030, length(acuv - corner));

    // Compose module contribution
    float modOutline  = rectOutline * intensity;
    float modFill     = rectFill    * intensity * 0.18;
    float modCorner   = cornerDot   * intensity;

    // ---------- Color ----------
    vec3 col = uInk;
    // Ambient noise breath for depth
    col += (q.x - 0.5) * 0.025;

    // Always-on dim grid
    col = mix(col, uAccent * 0.55, lineMask * 0.22);
    // Sweeping highlight on the grid
    col = mix(col, uAccent, lineMask * sweep * 0.18);

    // Modules
    col = mix(col, uAccent, modFill);
    col = mix(col, uAccent, modOutline * 0.9);
    col += uAccent * modCorner * 0.6;

    // Cursor halo
    col += uAccent * mInfluence * 0.06;

    // Vignette
    float vig = smoothstep(1.4, 0.4, length((uv - 0.5) * vec2(1.0, 0.92)));
    col *= mix(0.55, 1.0, vig);

    // Grain to kill banding
    float grain = (hash22(uv * uResolution.xy * 0.5 + t).x) * 0.012;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;
