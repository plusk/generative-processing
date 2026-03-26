import p5 from "p5";
import palettesData from "../../../palettes.json";

const PALETTE_NAME = "redcent"; // retro

const STROKE_WEIGHT = 1;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
let SPREAD = 75;
const OPACITY = 1;

const NUCOLOR: any[] = [];

let cnv: any;
let PALETTE: any;
let COLORS: any[];
let BG: any;

let x0 = 0;
let y0 = 0;

let TICK_RATE = 0.0225;
let ticker = 0;
const FRAME_LIMIT = 300;

let coleur: any;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);
    p.frameRate(30);

    p.colorMode(p.HSL);
    PALETTE = (palettesData as any)[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettesData);
    // PALETTE = (palettesData as any)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);

    p.background(BG);
    p.fill(BG);
    p.noFill();
    p.strokeWeight(STROKE_WEIGHT);
    (p as any).rectMode(p.CENTER);

    for (let c = 0; c < COLORS.length; c++) {
      const coleur = p.color(COLORS[c]);
      coleur.setAlpha(OPACITY);
      NUCOLOR.push(coleur);
    }
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    p.rotate(ANGLE * 0.825);
    for (let i = 0; i < TICK_RATE; i++) {
      TICK_RATE += 0.0225;
      const a = ANGLE * ticker;
      const r = SPREAD * p.sqrt(ticker);
      const x1 = r * p.cos(a);
      const y1 = r * p.sin(a);
      //p.circle(x1, y1, 10);
      //p.line(x0, y0, x1, y1);
      coleur = p.random(NUCOLOR);
      p.stroke(
        p.hue(coleur),
        p.saturation(coleur),
        (p.lightness(coleur) / FRAME_LIMIT) * p.frameCount,
      );
      const xdiff = p.abs(x0 - x1);
      const ydiff = p.abs(y0 - y1);
      let meh = 0;
      if (xdiff > ydiff) meh = xdiff;
      else meh = ydiff;
      p.circle(x0, y0, meh);
      x0 = x1;
      y0 = y1;
      ticker++;
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
