import p5 from "p5";
import { createNoise2D, createNoise3D } from "simplex-noise";
import { palettes } from "../palettes";

const { bg, colors } = palettes["genesis"];
const C = colors.length;

// Separate noise instances so field, speed, and color are fully independent
const fieldNoise = createNoise3D();
const spdNoise = createNoise3D();
const colorNoise = createNoise2D();

new p5((p: p5) => {
  const INK_COUNT = 2500;
  const ERASER_COUNT = 500;
  const NOISE_SCALE = 0.001;
  const VELOCITY_SCALE = 500;
  const TIME_STEP = 0.000375;

  interface Strand {
    x: number;
    y: number;
    px: number;
    py: number;
    age: number;
    life: number;
    ci: number;
    eraser: boolean;
  }

  const strands: Strand[] = [];
  let t = 0;

  function curl(x: number, y: number): [number, number] {
    const n = (dx: number, dy: number) =>
      fieldNoise((x + dx) * NOISE_SCALE, (y + dy) * NOISE_SCALE, t);
    const dndy = (n(0, 1) - n(0, -1)) / 2;
    const dndx = (n(1, 0) - n(-1, 0)) / 2;
    return [dndy * VELOCITY_SCALE, -dndx * VELOCITY_SCALE];
  }

  function make(aged = false, eraser = false): Strand {
    const x = p.random(p.width);
    const y = p.random(p.height);
    const life = 120 + p.random(180);
    return {
      x,
      y,
      px: x,
      py: y,
      age: aged ? p.random(life) : 0,
      life,
      // map simplex [-1,1] → [0, C]
      ci: ((colorNoise(x * 0.005, y * 0.005) + 1) / 2) * C,
      eraser,
    };
  }

  p.setup = () => {
    const canvas = p.createCanvas(1080, 1080);
    canvas.style("max-width", "calc(100vmin - 200px)");
    canvas.style("max-height", "calc(100vmin - 200px)");
    canvas.mouseClicked(() => p.saveCanvas(`flow-${Date.now()}`, "png"));
    p.background(bg);
    document.body.style.background = bg;
    for (let i = 0; i < INK_COUNT; i++) strands.push(make(true, false));
    for (let i = 0; i < ERASER_COUNT; i++) strands.push(make(true, true));
  };

  p.draw = () => {
    t += TIME_STEP;

    for (const s of strands) {
      s.age++;

      if (s.age > s.life) {
        Object.assign(s, make(false, s.eraser));
        continue;
      }

      const [vx, vy] = curl(s.x, s.y);
      // map simplex [-1,1] → speed range [0.4, 1.8]
      const spd = p.map(spdNoise(s.x * 0.002, s.y * 0.002, t * 0.4), -1, 1, 0.4, 1.8);

      s.px = s.x;
      s.py = s.y;
      s.x += vx * spd;
      s.y += vy * spd;

      const oob = s.x < -10 || s.x > p.width + 10 || s.y < -10 || s.y > p.height + 10;
      if (oob) {
        Object.assign(s, make(false, s.eraser));
        continue;
      }

      const env = Math.sin(p.map(s.age, 0, s.life, 0, Math.PI));

      if (s.eraser) {
        // weight envelope: grows from 0 → 8 → 0, no abrupt pop-in
        p.stroke(bg);
        p.strokeWeight(5 + env * 5);
        p.line(s.px, s.py, s.x, s.y);
        continue;
      }

      s.ci = (s.ci + 0.004) % C;

      const i0 = Math.floor(s.ci) % C;
      const i1 = (i0 + 1) % C;
      const col = p.lerpColor(p.color(colors[i0]), p.color(colors[i1]), s.ci % 1);
      col.setAlpha(env * 255);

      p.stroke(col);
      p.strokeWeight(5 + env * 5);
      p.line(s.px, s.py, s.x, s.y);
    }
  };
});
