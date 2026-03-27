import p5 from "p5";
import { palettes } from "../../../palettes";

let cnv: any;
let PALETTE: any;
let COLORS: any;
let BG: any;
let STROKE: any;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 1;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
const SPREAD = 14;
const OPACITY = 0.25;

let x0: any;
let y0: any;

let TICK_RATE = 100;
let ticker = 0;
const FRAME_LIMIT = 300;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);
    p.frameRate(30);

    p.colorMode(p.HSL);
    PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = palettes[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));

    p.background(BG);
    p.fill(BG);
    STROKE.setAlpha(OPACITY);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLORS);
  };

  p.draw = () => {
    //p.saveCanvas();

    p.translate(p.width / 2, p.height / 2);
    for (let i = 0; i < TICK_RATE; i++) {
      const a = ANGLE * ticker;
      const r = SPREAD * p.sqrt(ticker);
      const x1 = r * p.cos(a);
      const y1 = r * p.sin(a);
      //p.circle(x1, y1, 10);
      if (ticker != 0) {
        p.line(x0, y0, x1, y1);
      }
      x0 = x1;
      y0 = y1;
      ticker++;
    }

    if (p.frameCount >= FRAME_LIMIT) {
      console.log(p.frameCount);
      p.noLoop();
    }

    // p.beginShape(); p.POINTS, p.LINES, p.TRIANGLES, p.TRIANGLE_FAN, p.TRIANGLE_STRIP, p.QUADS, p.QUAD_STRIP
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
