import p5 from "p5";
import { palettes } from "../../palettes";

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 2;
const LINE_COUNT = 100;
const STEP = STROKE_WEIGHT * 2;
const RADIUS = 50;
const REPETITIONS = 50;
const NOISE_DETAIL = 0.00375;
const NOISE_EVO = 0.01;

const OPACITY = 255;
const BG_OPACITY = 5;

const LOD = 2;
const FALLBACK = 0.5;

let cnv: any;
let PALETTE: any;
let COLORS: any[];
let BG: any;
let STROKE: any;
let SATURATION: any;
let HUE: any;
let LIGHTNESS: any;

const RING: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);
    p.colorMode(p.HSL);

    PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = (palettes)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));

    HUE = p.hue(STROKE);
    SATURATION = p.saturation(STROKE);
    LIGHTNESS = p.lightness(STROKE);

    p.background(BG);
    p.fill(BG);
    STROKE.setAlpha(OPACITY);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLORS);

    const xCenter = p.width / 2;
    const yCenter = p.height / 2;
    const angle = p.HALF_PI;
    for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / LINE_COUNT) {
      const x = xCenter + RADIUS * p.cos(a);
      const y = yCenter + RADIUS * p.sin(a);
      RING.push({
        x,
        y,
        a,
        angle,
      });
    }
    p.noiseDetail(LOD, FALLBACK);
  };

  p.draw = () => {
    resetDraw();
    for (let i = 0; i < REPETITIONS; i++) {
      p.stroke(HUE, (SATURATION / REPETITIONS) * i, LIGHTNESS);
      p.beginShape();
      for (let l = 0; l < RING.length; l++) {
        const LINE = RING[l];
        drawLine(LINE);
      }
      p.endShape(p.CLOSE);
    }
  };

  const resetDraw = () => {
    BG.setAlpha(255);
    p.background(BG);
    BG.setAlpha(BG_OPACITY);
    p.fill(BG);
    p.translate(p.width / 2, p.height / 2);
    for (let i = 0; i < RING.length; i++) {
      const LINE = RING[i];
      LINE.x = RADIUS * p.cos(LINE.a);
      LINE.y = RADIUS * p.sin(LINE.a);
    }
  };

  const drawLine = (LINE: any) => {
    const noyze =
      p.noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL, p.frameCount * NOISE_EVO) - 0.5;
    const x = LINE.x + STEP * p.cos(LINE.angle + p.TWO_PI * noyze);
    const y = LINE.y + STEP * p.sin(LINE.angle + p.TWO_PI * noyze);
    //p.line(LINE.x, LINE.y, x, y);
    p.vertex(x, y);
    LINE.x = x;
    LINE.y = y;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
