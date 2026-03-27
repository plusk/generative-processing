import p5 from "p5";
import { palettes } from "../../palettes";

const PALETTE_NAME = "genesis"; // retro, warm, sydney, symmeblu, termos, vintage, pastella

const STROKE_WEIGHT = 2;
const RING_COUNT = 10;
const LINE_COUNT = 200;
const STEP = 4;
const ANGLE_STEP = 0.1;
const RADIUS = 100;
const NOISE_DETAIL = 0.005;

const FRAME_LIMIT = 90;

const LOD = 4;
const FALL = 0.5;

let PALETTE: any;
let COLORS: p5.Color[];
let BG: p5.Color;
let STROKE: any;

const RINGS: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    const cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = (palettes)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE.colors;
    BG = p.color(PALETTE.bg);
    STROKE = p.color(COLORS[0]);

    p.background(BG);
    p.fill(BG);
    STROKE.setAlpha(127);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    p.colorMode(p.HSL);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLORS);

    for (let r = 0; r < RING_COUNT; r++) {
      const RING: any[] = [];
      const xCenter = p.random(RADIUS, p.width - RADIUS);
      const yCenter = p.random(p.height);
      const coleur = p.color(COLORS[r % COLORS.length]);
      for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / LINE_COUNT) {
        const x = xCenter + RADIUS * p.cos(a);
        const y = yCenter + RADIUS * p.sin(a);
        RING.push({
          x,
          y,
          a,
          color: coleur,
        });
      }
      RINGS.push(RING);
    }
    p.noiseDetail(LOD, FALL);
  };

  p.draw = () => {
    for (let r = 0; r < RINGS.length; r++) {
      const RING = RINGS[r];
      const HUE = p.hue(RING[0].color);
      const SATURATION = p.saturation(RING[0].color);
      const LIGHTNESS = p.lightness(RING[0].color);
      p.stroke(
        HUE,
        (SATURATION / FRAME_LIMIT) * p.frameCount,
        (LIGHTNESS / FRAME_LIMIT) * p.frameCount,
      );
      for (let l = 0; l < RING.length; l++) {
        const LINE = RING[l];
        drawLine(LINE);
      }
    }
    if (p.frameCount > FRAME_LIMIT) {
      p.noLoop();
    }
  };

  const drawLine = (LINE: any) => {
    const noyzed = p.noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
    const angle = LINE.a + noyzed * ANGLE_STEP;
    const x = LINE.x + STEP * p.cos(angle);
    const y = LINE.y + STEP * p.sin(angle);
    p.line(LINE.x, LINE.y, x, y);
    LINE.x = x;
    LINE.y = y;
    LINE.a = angle;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
