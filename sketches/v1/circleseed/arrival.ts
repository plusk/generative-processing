import p5 from "p5";
import { palettes } from "../../../palettes";

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const RING_COUNT = 1;
const LINE_COUNT = 10000;
const STEP = 4;
const ANGLE_STEP = 1.75;
const RADIUS = 250;
const NOISE_DETAIL = 0.0075;

const FRAME_LIMIT = 60;

let cnv: any;
let PALETTE: any;
let COLORS: any[];
let BG: any;
let STROKE: any;

const RINGS: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = (palettes)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));

    p.background(BG);
    p.fill(BG);
    STROKE.setAlpha(15);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);
    p.colorMode(p.HSL);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLORS);

    for (let r = 0; r < RING_COUNT; r++) {
      const RING: any[] = [];
      const xCenter = p.width / 2;
      const yCenter = p.width / 2;
      for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / LINE_COUNT) {
        const x = xCenter + RADIUS * p.cos(a);
        const y = yCenter + RADIUS * p.sin(a);
        RING.push({
          x,
          y,
          a,
          color: p.random(COLORS),
        });
      }
      RINGS.push(RING);
    }
  };

  p.draw = () => {
    for (let r = 0; r < RINGS.length; r++) {
      const RING = RINGS[r];
      for (let l = 0; l < RING.length; l++) {
        const LINE = RING[l];
        drawLine(LINE);
      }
    }
    if (p.frameCount > FRAME_LIMIT) {
      p.noLoop();
    }
    // p.beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  };

  const drawLine = (LINE: any) => {
    const noyzed = p.noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
    const angle = LINE.a * noyzed * ANGLE_STEP;
    const x = LINE.x + STEP * p.cos(angle + p.HALF_PI);
    const y = LINE.y + STEP * p.sin(angle + p.HALF_PI);
    p.line(LINE.x, LINE.y, x, y);
    LINE.x = x;
    LINE.y = y;
    LINE.a = angle;
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
