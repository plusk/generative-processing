import p5 from "p5";
import palettesData from "../../../palettes.json";

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 2;
const RING_COUNT = 5;
const LINE_COUNT = 1000;
const STEP = 4;
const RADIUS = 150;
const NOISE_DETAIL = 0.005;

const OPACITY = 255;

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

    PALETTE = (palettesData as any)[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettesData);
    // PALETTE = (palettesData as any)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));

    p.background(BG);
    BG.setAlpha(15);
    p.fill(BG);
    //STROKE.setAlpha(15);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLORS);

    for (let r = 0; r < RING_COUNT; r++) {
      const RING: any[] = [];
      const xCenter = p.random(p.width);
      const yCenter = p.random(p.height / 2);
      const collie = p.color(COLORS[r % COLORS.length]);
      collie.setAlpha(OPACITY);
      const angle = p.random(p.QUARTER_PI, p.TWO_PI - p.QUARTER_PI);
      for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / LINE_COUNT) {
        const x = xCenter + RADIUS * p.cos(a);
        const y = yCenter + RADIUS * p.sin(a);
        RING.push({
          x,
          y,
          angle,
          color: collie,
        });
      }
      RINGS.push(RING);
    }
  };

  p.draw = () => {
    for (let r = 0; r < RINGS.length; r++) {
      const RING = RINGS[r];
      p.stroke(RING[0].color);
      p.beginShape();
      for (let l = 0; l < RING.length; l++) {
        const LINE = RING[l];
        drawLine(LINE);
      }
      p.endShape(p.CLOSE);
    }
  };

  const drawLine = (LINE: any) => {
    const noyze = p.noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
    const x = LINE.x + STEP * p.cos(LINE.angle * noyze);
    const y = LINE.y + STEP * p.sin(LINE.angle * noyze);
    //p.line(LINE.x, LINE.y, x, y);
    p.vertex(x, y);
    LINE.x = x;
    LINE.y = y;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
