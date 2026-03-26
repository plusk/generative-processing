import p5 from "p5";
import palettesData from "../../../palettes.json";

let cnv: any;
let PALETTE: any;
let COLORS: any;
let BG: any;
let STROKE: any;

const PALETTE_NAME = "genesis"; // retro

const STROKE_WEIGHT = 1;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
const SPREAD = 15;
const OPACITY = 0.5;
const MIN_LIGHTNESS = 0.15;

let x0: any;
let y0: any;

let TICK_RATE = 1;
let ticker = 0;
const FRAME_LIMIT = 300;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);
    p.frameRate(30);

    p.colorMode(p.HSL);
    PALETTE = palettesData[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettesData);
    // PALETTE = palettesData[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
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
    p.translate(p.width / 2, p.height / 2);
    TICK_RATE += 0.075;
    for (let i = 0; i < TICK_RATE; i++) {
      p.stroke(
        p.hue(STROKE),
        p.saturation(STROKE),
        (p.lightness(STROKE) / FRAME_LIMIT) * (FRAME_LIMIT * (1 + MIN_LIGHTNESS) - p.frameCount),
        OPACITY
      );
      const a = ANGLE * ticker;
      p.rotate(a);
      const r = SPREAD * p.sqrt(ticker);
      const x1 = r * p.cos(a);
      const y1 = r * p.sin(a);
      if (ticker > 1) {
        p.line(x0, y0, x1, y1);
      }
      x0 = x1;
      y0 = y1;
      ticker++;
    }
    //p.saveCanvas();
    if (p.frameCount > FRAME_LIMIT) {
      p.noLoop();
    }

    // p.beginShape(); p.POINTS, p.LINES, p.TRIANGLES, p.TRIANGLE_FAN, p.TRIANGLE_STRIP, p.QUADS, p.QUAD_STRIP
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
