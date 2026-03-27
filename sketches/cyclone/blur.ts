import p5 from "p5";
import { palettes } from "../../palettes";

const PALETTE_NAME = "pastella";

const WALKER_COUNT = 100;
const STROKE_WEIGHT = 2;
const STEP = 50;
const ANGLE_STEP = 10;
const NOISE_FACTOR = 0.05;
const ANGLE_OFFSET = 270;

const WALKERS: any[] = [];

let palette: any;
let colors: any[];
let colors_bg: any;

new p5((p: p5) => {
  p.setup = () => {
    const cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettes[PALETTE_NAME];
    // const keys = Object.keys(palettes);
    // palette = (palettes)[keys[(keys.length * Math.random()) << 0]];
    colors = palette.COLORS;
    colors_bg = palette.bg;

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);
    p.stroke(p.random(colors));
    p.angleMode(p.DEGREES);

    for (let i = 0; i < WALKER_COUNT; i++) {
      WALKERS.push({
        x: p.random(-STEP, STEP),
        y: p.random(-STEP, STEP),
        angle: 0,
        color: p.color(p.random(colors)),
      });
    }
  };

  const TIGHTNESS = 100;
  const AMP = 50;

  p.draw = () => {
    //p.background(colors_bg);
    //p.translate(-p.width / 2, p.height / 2);
    //p.translate(p.width / 2, p.height / 2);

    for (let i = 0; i < WALKERS.length; i++) {
      const w = WALKERS[i];
      w.color.setAlpha(Math.exp(2 * ((((w.angle + ANGLE_OFFSET) % 360) - 180) / TIGHTNESS) ** 2));
      p.strokeWeight(
        STROKE_WEIGHT *
          Math.exp(-1 * ((((w.angle + ANGLE_OFFSET) % 360) - 180) / TIGHTNESS) ** 2) *
          AMP,
      );
      p.stroke(w.color);
      w.angle += ANGLE_STEP * p.noise(w.x * NOISE_FACTOR, w.y * NOISE_FACTOR);
      w.x += STEP * p.cos(w.angle);
      w.y += STEP * p.sin(w.angle);
      p.point(w.x, w.y);
    }
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
