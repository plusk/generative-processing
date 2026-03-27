import p5 from "p5";
import { palettes } from "../palettes";

const { bg, colors } = palettes["genesis"];
const C = colors.length;

new p5((p: p5) => {
  const STRAND_COUNT = 100;
  const TRAIL_LEN = 20;
  const ORBIT_SPEED = 10;
  const SOFTENING = 10;
  const SPHERE_R = 200;
  const LIFE = 1000;
  const STROKE_WEIGHT = 5;

  // Pre-computed constant — r is conserved by the cross-product velocity
  const OMEGA = ORBIT_SPEED / (SPHERE_R + SOFTENING);

  interface TrailPoint {
    x: number;
    y: number;
    z: number;
  }

  interface Strand {
    x: number;
    y: number;
    z: number;
    nx: number;
    ny: number;
    nz: number;
    trail: TrailPoint[];
    trailHead: number;
    trailSize: number;
    age: number;
    ci: number;
  }

  // Pre-computed RGB palette — avoids p5 Color allocations in the hot loop
  let rgbColors: [number, number, number][] = [];

  const strands: Strand[] = [];

  function velocity(
    x: number,
    y: number,
    z: number,
    nx: number,
    ny: number,
    nz: number,
  ): [number, number, number] {
    return [(ny * z - nz * y) * OMEGA, (nz * x - nx * z) * OMEGA, (nx * y - ny * x) * OMEGA];
  }

  function randomOnSphere(scale: number): [number, number, number] {
    const theta = p.random(0, Math.PI * 2);
    const phi = Math.acos(p.random(-1, 1));
    return [
      scale * Math.sin(phi) * Math.cos(theta),
      scale * Math.sin(phi) * Math.sin(theta),
      scale * Math.cos(phi),
    ];
  }

  function makeStrand(aged = false): Strand {
    const [x, y, z] = randomOnSphere(p.random(SPHERE_R / 2, SPHERE_R));
    const [nx, ny, nz] = randomOnSphere(1);

    // Pre-allocate all trail slots as reusable objects — no per-frame allocation
    const trail: TrailPoint[] = Array.from({ length: TRAIL_LEN }, () => ({ x: 0, y: 0, z: 0 }));
    trail[0].x = x;
    trail[0].y = y;
    trail[0].z = z;

    return {
      x,
      y,
      z,
      nx,
      ny,
      nz,
      trail,
      trailHead: 1,
      trailSize: 1,
      age: aged ? p.random(LIFE) : 0,
      ci: p.random(C),
    };
  }

  function resetStrand(s: Strand): void {
    const [x, y, z] = randomOnSphere(p.random(SPHERE_R / 2, SPHERE_R));
    const [nx, ny, nz] = randomOnSphere(1);
    s.x = x;
    s.y = y;
    s.z = z;
    s.nx = nx;
    s.ny = ny;
    s.nz = nz;
    s.trail[0].x = x;
    s.trail[0].y = y;
    s.trail[0].z = z;
    s.trailHead = 1;
    s.trailSize = 1;
    s.age = 0;
    s.ci = p.random(C);
  }

  p.setup = () => {
    const canvas = p.createCanvas(1080, 1080, p.WEBGL);
    canvas.style("max-width", "calc(100vmin - 200px)");
    canvas.style("max-height", "calc(100vmin - 200px)");
    p.noFill();
    document.body.style.background = bg;

    // Pre-compute RGB values once at setup
    rgbColors = colors.map((c) => {
      const col = p.color(c);
      return [p.red(col), p.green(col), p.blue(col)];
    });

    for (let i = 0; i < STRAND_COUNT; i++) strands.push(makeStrand(true));
  };

  p.keyPressed = () => {
    if (p.key === "s" || p.key === "S") p.saveCanvas(`flow-3d-${Date.now()}`, "png");
  };

  p.draw = () => {
    p.background(bg);
    p.orbitControl(2, 2, 0.1);

    for (const s of strands) {
      s.age++;

      const [vx, vy, vz] = velocity(s.x, s.y, s.z, s.nx, s.ny, s.nz);
      s.x += vx;
      s.y += vy;
      s.z += vz;

      // Write into the existing slot object — no allocation
      const slot = s.trail[s.trailHead];
      slot.x = s.x;
      slot.y = s.y;
      slot.z = s.z;
      s.trailHead = (s.trailHead + 1) % TRAIL_LEN;
      s.trailSize = Math.min(s.trailSize + 1, TRAIL_LEN);

      if (s.age > LIFE) {
        resetStrand(s);
        continue;
      }
      if (s.trailSize < 4) continue;

      s.ci = (s.ci + 0.003) % C;

      const i0 = Math.floor(s.ci) % C;
      const i1 = (i0 + 1) % C;
      const t = s.ci % 1;

      // Inline lerp — avoids p5 Color allocation
      const r = rgbColors[i0][0] + (rgbColors[i1][0] - rgbColors[i0][0]) * t;
      const g = rgbColors[i0][1] + (rgbColors[i1][1] - rgbColors[i0][1]) * t;
      const b = rgbColors[i0][2] + (rgbColors[i1][2] - rgbColors[i0][2]) * t;

      p.stroke(r, g, b);
      p.strokeWeight(STROKE_WEIGHT);

      // Draw segments from circular buffer in chronological order
      for (let i = 0; i < s.trailSize - 1; i++) {
        const ai = (s.trailHead - s.trailSize + i + TRAIL_LEN) % TRAIL_LEN;
        const bi = (ai + 1) % TRAIL_LEN;
        const a = s.trail[ai];
        const b2 = s.trail[bi];
        p.line(a.x, a.y, a.z, b2.x, b2.y, b2.z);
      }
    }
  };
});
