import p5 from "p5";
import { palettes } from "../../../palettes";

const PALETTE_NAME = "genesis"; // retro

const STROKE_WEIGHT = 10;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
const SPREAD = 10;

let cnv: any;
let PALETTE: any;
let COLORS: any[];
let BG: any;

let x0: number;
let y0: number;

let TICK_RATE = 50;
let ticker = 7000;
const FRAME_LIMIT = 300;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);
    p.frameRate(30);

    p.colorMode(p.HSL);
    PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = (palettes)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);

    p.background(BG);
    p.fill(BG);
    //p.noFill();
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLORS);
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    p.rotate(ANGLE);
    TICK_RATE *= 0.9939;
    for (let i = 0; i < TICK_RATE; i++) {
      const coleur = p.color(COLORS[p.round(ticker) % COLORS.length]);
      p.stroke(coleur);
      const a = ANGLE * ticker;
      const r = SPREAD * p.sqrt(ticker);
      const x1 = r * p.cos(a);
      const y1 = r * p.sin(a);
      p.strokeWeight(STROKE_WEIGHT + 0.005 * ticker ** 1.1);
      //p.circle(x1, y1, 10);
      p.point(x0, y0);
      x0 = x1;
      y0 = y1;
      if (ticker > 1) ticker--;
    }
    //p.saveCanvas();
    if (p.frameCount > FRAME_LIMIT) {
      console.log("donezo");
      p.noLoop();
    }
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
