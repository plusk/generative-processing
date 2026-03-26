import p5 from "p5";
import palettesData from "../../../palettes.json";

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const RING_COUNT = 10;
const LINE_COUNT = 50;
const STEP = 5;
const RADIUS = 100;

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
    p.fill(BG);
    //STROKE.setAlpha(5);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLORS);

    for (let r = 0; r < RING_COUNT; r++) {
      const RING: any[] = [];
      const xCenter = p.random(p.width);
      const yCenter = p.random(p.height);
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
    // p.beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  };

  const drawLine = (LINE: any) => {
    const x = LINE.x + STEP;
    const y = LINE.y + STEP;
    p.line(LINE.x, LINE.y, x, y);
    LINE.x = x;
    LINE.y = y;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
