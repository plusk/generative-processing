import p5 from "p5";
import { palettes } from "../../palettes";

const EXPORT = false;

const PALETTE_NAME = "genesis";

const STROKE_WEIGHT = 2;

const COUNT = 25;
const OPACITY = 0.075;
const ANGLE_STEP = 0.005;
const MAX_RADIUS = (1080 / 4) * 3;

const FRAME_START = (Math.PI / ANGLE_STEP) * 2 - 1;
const FRAME_END = (Math.PI / ANGLE_STEP) * 4;

let COLORS: any[], BG: any, STROKE: any;
let RINGS: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    if (EXPORT) p.frameRate(4);
    p.pixelDensity(1);

    const cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    p.colorMode(p.HSL);
    const PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = (palettes)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"].map((col: string) => p.color(col));
    BG = p.color(PALETTE.bg);
    STROKE = p.random(COLORS);

    p.strokeWeight(STROKE_WEIGHT);

    p.stroke(STROKE);
    p.background(BG);
    BG.setAlpha(OPACITY * 255);

    p.fill(BG);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = STROKE;

    for (let i = 0; i < COUNT; i++) {
      RINGS.push({
        a: 0,
        r: ((i + 1) * MAX_RADIUS) / COUNT,
      });
    }
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    p.rotate(p.HALF_PI);
    p.beginShape();
    for (let i = 0; i < RINGS.length; i++) {
      const ring = RINGS[i];
      const x = ring.r * p.cos(ring.a);
      const y = ring.r * p.sin(ring.a);
      p.strokeWeight(STROKE_WEIGHT * 5);
      p.point(x, y);
      p.strokeWeight(STROKE_WEIGHT);
      p.vertex(x, y);
      ring.a += i * ANGLE_STEP;
    }
    p.endShape();

    if (EXPORT) {
      if (p.frameCount > FRAME_START && p.frameCount <= FRAME_END) {
        p.saveCanvas();
      }
      if (p.frameCount > FRAME_END) {
        p.noLoop();
      }
    }
    // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
