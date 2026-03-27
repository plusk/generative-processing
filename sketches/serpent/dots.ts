import p5 from "p5";
import { palettes } from "../../palettes";

let PALETTE: any;
let COLORS: any;
let BG: p5.Color;
let STROKE: any;

const PALETTE_NAME = "pastella"; // termos, pastella, monster
const MIN_ALPHA = 63;
const MAX_ALPHA = 255;

const STROKE_WEIGHT = 15;
const UNIT = 1080 / 3;
const _MAGIC = 4.75;
const ANGELS = [Math.PI / 3.9, Math.PI / 4.5, Math.PI / 5.9, Math.PI / 11];
const MAGIQUE = [15, 10, 6, 2];
const ODD = [true, false, false, false];

let scroll = 0;
const OFFSETS: any[] = [];

let ticker = 0;
const LAYERS = 4;
const MAXNDEX = 3;
const MAXYNDEX = 16;
const DURATION = 30 * 4;
const HIGHLIGHTED: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = palettes[PALETTE_NAME];
    COLORS = PALETTE.colors;
    BG = p.color(PALETTE.bg);
    STROKE = p.color(p.random(COLORS));

    p.background(BG);
    p.fill(BG);
    STROKE.setAlpha(MIN_ALPHA);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    for (let i = 0; i < MAXYNDEX; i++) {
      OFFSETS.push(p.round(p.random(DURATION)));
    }
  };

  p.draw = () => {
    let odd = false;
    const HEIGHT = p.height + UNIT;
    let yndex = 0;
    for (let y = scroll; y <= HEIGHT; y += UNIT / 4) {
      const WAVE: any[] = [];
      if ((ticker + OFFSETS[yndex % MAXYNDEX]) % DURATION === 0) {
        HIGHLIGHTED[yndex] = Math.round((LAYERS - 1) * Math.random());
      }
      let xndex = 0;
      for (let x = 0; x <= p.width; x += UNIT) {
        const FAN: any[] = [];
        if (odd) x += UNIT * 0.5;
        for (let l = 0; l < LAYERS; l++) {
          const diameter = (UNIT * (LAYERS - l + 1)) / LAYERS;
          const stepper = (ANGELS[l] / (ODD[l] ? MAGIQUE[l] - 1 : MAGIQUE[l])) * 2;
          const starter = ODD[l] ? 0 : stepper / 2;
          const LAYER: any[] = [];
          for (let a = starter; a <= ANGELS[l]; a += stepper) {
            const angle = (p.TWO_PI / 4) * 3 + a;
            LAYER.push({
              x: x + (diameter * p.cos(angle)) / 2,
              y: y + (diameter * p.sin(angle)) / 2,
            });
            if (a != 0) {
              LAYER.push({
                x: x - (diameter * p.cos(-angle)) / 2,
                y: y - (diameter * p.sin(-angle)) / 2,
              });
            }
          }
          LAYER.sort((a: any, b: any) => a.x - b.x);
          drawDots(x, y, l, diameter, LAYER, HIGHLIGHTED[yndex], xndex, yndex);
          FAN.push(LAYER);
        }
        WAVE.push(FAN);
        if (odd) x -= UNIT * 0.5;
        xndex++;
      }
      odd = !odd;
      yndex++;
    }
    scroll--;
    ticker++;
    //p.saveCanvas();
    if (ticker === 30 * 15) {
      p.noLoop();
    }
  };

  const drawDots = (
    x: any,
    y: any,
    l: any,
    diameter: any,
    dots: any,
    HIGHLIGHTED: any,
    xndex: any,
    yndex: any,
  ) => {
    (p as any).drawingContext.shadowBlur = 0;
    p.stroke(BG);
    p.arc(x, y, diameter, diameter, p.PI, p.TWO_PI);

    const oddish = yndex % 2;

    const totallayerdots = dots.length * (MAXNDEX + oddish) * 2;
    const alphaRange = MAX_ALPHA - MIN_ALPHA;
    const dotoffset = (totallayerdots / (MAXNDEX + 1)) * xndex;
    const thisticker = ticker + OFFSETS[yndex % MAXYNDEX];

    const thisstroke = p.color(COLORS[yndex % COLORS.length]);

    p.beginShape(p.POINTS);
    for (let i = 0; i < dots.length; i++) {
      if (l === HIGHLIGHTED) {
        const timeFactor = (thisticker % DURATION) / DURATION;
        const timedot = totallayerdots * timeFactor;
        const thispos = dotoffset + i + totallayerdots / 2;
        const yootaro = (2.5067 / 1) * p.sqrt(p.TWO_PI);
        const eeek = Math.exp(-((thispos - timedot * 2) ** 2) / (0.25 * timedot) ** 2);
        (p as any).drawingContext.shadowColor = thisstroke;
        (p as any).drawingContext.shadowBlur = STROKE_WEIGHT;
        thisstroke.setAlpha(MIN_ALPHA + alphaRange * yootaro * eeek);
      } else {
        thisstroke.setAlpha(MIN_ALPHA);
      }
      p.stroke(thisstroke);
      const dot = dots[i];
      p.vertex(dot.x, dot.y);
    }
    p.endShape();
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
