import p5 from "p5";
import { palettes } from "../../palettes";

let PALETTE: any;
let COLORS: any;
let BG: p5.Color;

const PALETTE_NAME = "speis"; // mono, sydney, pastella, speis

const STROKE_WEIGHT_START = 10;
let STROKE_WEIGHT = STROKE_WEIGHT_START;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
let SPREAD = 20;
const AMOUNT = 5;

let x0 = 0;
let y0 = 0;

let TICK_RATE = 1;
let ticker = 0;
const FRAME_LIMIT = 300;

const BACKLOG: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);
    p.frameRate(30);

    p.colorMode(p.HSL);
    PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = palettes[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE.colors;
    BG = p.color(PALETTE.bg);

    p.background(BG);
    p.fill(BG);
    p.noFill();
    p.strokeWeight(STROKE_WEIGHT);
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    const FRAME_FACTOR = p.frameCount / FRAME_LIMIT;
    for (let i = 0; i < TICK_RATE; i++) {
      STROKE_WEIGHT = p.random(
        STROKE_WEIGHT_START - STROKE_WEIGHT_START * FRAME_FACTOR,
        STROKE_WEIGHT_START + 5 * STROKE_WEIGHT_START * FRAME_FACTOR,
      );
      TICK_RATE += 0.01;
      SPREAD += 0.1;
      p.scale(p.random(1 - 0.5 * FRAME_FACTOR, 1));
      p.strokeWeight(STROKE_WEIGHT);
      const coleur = p.color(COLORS[ticker % COLORS.length]);
      const a = ANGLE * ticker;
      const r = SPREAD * p.sqrt(ticker);
      const x1 = r * p.cos(a);
      const y1 = r * p.sin(a);
      //p.circle(x1, y1, 10);
      //p.line(x0, y0, x1, y1);
      p.point(x0, y0);
      (p as any).drawingContext.shadowColor = coleur;
      p.stroke(coleur);
      p.point(x1, y1);
      (p as any).drawingContext.shadowBlur = STROKE_WEIGHT;
      p.strokeWeight(STROKE_WEIGHT / 5);
      BACKLOG[ticker % AMOUNT] = { x0, y0 };
      if (ticker > AMOUNT - 1) {
        const sx = BACKLOG[(ticker + 1) % AMOUNT].x0;
        const sy = BACKLOG[(ticker + 1) % AMOUNT].y0;
        //p.line(sx, sy, x1, y1);
        curveBetween(sx, sy, x1, y1, 0.25, 0.25, 0);
        p.point(sx, sy);
      }
      x0 = x1;
      y0 = y1;
      ticker++;
    }

    if (p.frameCount > FRAME_LIMIT) {
      console.log("donezo");
      p.noLoop();
      //p.saveCanvas();
    }
  };

  const curveBetween = (x1: any, y1: any, x2: any, y2: any, d: any, h: any, flip: any) => {
    //find two control points off this line
    var original = p5.Vector.sub(p.createVector(x2, y2), p.createVector(x1, y1));
    var inline = original
      .copy()
      .normalize()
      .mult(original.mag() * d);
    var rotated = inline
      .copy()
      .rotate(p.radians(90) + flip * p.radians(180))
      .normalize()
      .mult(original.mag() * h);
    var p1 = p5.Vector.add(p5.Vector.add(inline, rotated), p.createVector(x1, y1));
    //p.line(x1, y1, p1.x, p1.y); //show control line
    rotated.mult(-1);
    var p2 = p5.Vector.add(p5.Vector.add(inline, rotated).mult(-1), p.createVector(x2, y2));
    //p.line(x2, y2, p2.x, p2.y); //show control line
    p.bezier(x1, y1, p1.x, p1.y, p2.x, p2.y, x2, y2);
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
