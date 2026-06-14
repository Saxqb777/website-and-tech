// Hero shader — domain-warped FBM field, dark obsidian base with
// thin cyan veins that bloom on cursor proximity and scroll velocity.

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
  uniform float uNoiseScale;
  uniform float uWarp;
  uniform float uVeinThreshold;
  uniform float uVeinWidth;
  uniform float uVelocityImpact;
  uniform float uMouseRadius;
  uniform float uMouseImpact;
  uniform float uTimeSpeed;

  // ---------- Noise ----------
  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)),
             dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
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
    for (int i = 0; i < 5; i++) {
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
    float mInfluence = smoothstep(uMouseRadius, 0.0, md) * uMouseImpact;

    // Domain warp — two passes of FBM stacked
    vec2 q = vec2(
      fbm(p * uNoiseScale + t),
      fbm(p * uNoiseScale + t + vec2(5.2, 1.3))
    );

    vec2 r = vec2(
      fbm(p * uNoiseScale + uWarp * q + vec2(1.7, 9.2)),
      fbm(p * uNoiseScale + uWarp * q + vec2(8.3, 2.8) + t * 0.6)
    );

    // Pull the warp field gently toward the cursor
    vec2 toMouse = (m - p) * mInfluence;
    r += toMouse * 0.6;

    float f = fbm(p * uNoiseScale + uWarp * r);

    // Veins — narrow band around threshold
    float band = uVeinWidth;
    float vein  = smoothstep(uVeinThreshold - band, uVeinThreshold, f)
                - smoothstep(uVeinThreshold,        uVeinThreshold + band, f);

    // A faint secondary vein for richness
    float vein2 = smoothstep(uVeinThreshold - 0.20, uVeinThreshold - 0.18, f)
                - smoothstep(uVeinThreshold - 0.18, uVeinThreshold - 0.16, f);
    vein = max(vein, vein2 * 0.45);

    // Glow halo around the vein for the "wet metal" feel
    float glow = smoothstep(uVeinThreshold - band * 3.0, uVeinThreshold, f)
               - smoothstep(uVeinThreshold,              uVeinThreshold + band * 3.0, f);
    glow = pow(glow, 2.2) * 0.45;

    // Velocity brightens veins slightly
    vein *= (1.0 + uVelocity * 1.2);
    glow *= (1.0 + uVelocity * 0.8);

    // Compose
    vec3 col = uInk;
    col += (f - 0.5) * 0.04;                           // subtle depth
    col = mix(col, uAccent, clamp(vein, 0.0, 1.0));    // hard vein
    col += uAccent * glow * 0.6;                       // soft bloom
    col += uAccent * mInfluence * 0.08;                // cursor halo

    // Vignette — keep corners quiet
    float vig = smoothstep(1.4, 0.4, length((uv - 0.5) * vec2(1.0, 0.92)));
    col *= mix(0.55, 1.0, vig);

    // Film grain to kill banding
    float grain = (hash22(uv * uResolution.xy * 0.5 + t).x) * 0.012;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;
