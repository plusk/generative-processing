import p5 from "p5";
import { palettes } from "../../palettes";

const PALETTE_NAME = "genesis"; // retro

const STROKE_WEIGHT = 2;
const RING_COUNT = 5;
const ANGLE_STEP = 2.25;
const NOISE_DETAIL = 0.0075;
const LINE_FACTOR = 2;
const PADDING = 200;

const FRAME_LIMIT = 120;

const STEP = STROKE_WEIGHT;

let PALETTE: any;
let COLORS: p5.Color[];
let BG: p5.Color;

const RINGS: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = (palettes)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE.colors;
    BG = p.color(PALETTE.bg);

    p.background(BG);
    p.fill(BG);
    p.strokeWeight(STROKE_WEIGHT);

    p.colorMode(p.HSL);
    (p.drawingContext as CanvasRenderingContext2D).shadowBlur = STROKE_WEIGHT;

    let radsum = 0;

    for (let r = 0; r < RING_COUNT; r++) {
      const RING: any[] = [];
      const raddy = ((p.height - PADDING * 2) / 4 / RING_COUNT) * (r + 1);
      radsum += raddy;
      const xCenter = p.width / 2;
      const yCenter = (PADDING * 3) / 4 + radsum;
      const coleur = p.color(p.random(COLORS));
      for (
        let a = p.TWO_PI / (raddy * LINE_FACTOR);
        a < p.TWO_PI;
        a += p.TWO_PI / (raddy * LINE_FACTOR)
      ) {
        const x = xCenter + raddy * p.cos(a);
        const y = yCenter + raddy * p.sin(a);
        RING.push({
          x,
          y,
          a,
          color: coleur,
          step: p.random(STEP * 0.5, STEP * 1),
        });
      }
      RINGS.push(RING);
    }
  };

  p.draw = () => {
    for (let r = 0; r < RINGS.length; r++) {
      const RING = RINGS[r];
      const HUE = p.hue(RING[0].color);
      const SATURATION = p.saturation(RING[0].color);
      const LIGHTNESS = p.lightness(RING[0].color);
      const coleur = p.color(
        HUE,
        (SATURATION / FRAME_LIMIT) * p.frameCount,
        (LIGHTNESS / FRAME_LIMIT) * p.frameCount,
        (5 / FRAME_LIMIT) * p.frameCount,
      );
      p.stroke(coleur);
      //p.drawingContext.shadowColor = coleur;

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
    const angle = LINE.a * noyzed * ANGLE_STEP;

    const x = LINE.x + LINE.step * p.cos(p.HALF_PI + angle);
    const y = LINE.y + LINE.step * p.sin(p.HALF_PI + angle);
    p.line(LINE.x, LINE.y, x, y);
    LINE.x = x;
    LINE.y = y;
    LINE.a = angle;
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
