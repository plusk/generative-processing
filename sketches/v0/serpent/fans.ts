import p5 from "p5";
import { palettes } from "../../../palettes";

let cnv: any;
let PALETTE: any;
let COLORS: any;
let BG: any;
let STROKE: any;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 10;
const UNIT = 1080 / 3;

const _MAGIC = 4.75;

let scroll = 0;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = palettes[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
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
  };

  p.draw = () => {
    //p.circle(p.width / 2, p.height / 2, 100);
    // p.beginShape(); p.POINTS, p.LINES, p.TRIANGLES, p.TRIANGLE_FAN, p.TRIANGLE_STRIP, p.QUADS, p.QUAD_STRIP
    let odd = false;
    const HEIGHT = p.height + UNIT;
    for (let y = scroll; y <= HEIGHT; y += UNIT / 4) {
      for (let x = 0; x <= p.width; x += UNIT) {
        if (odd) x += UNIT * 0.5;
        const LAYERS = 4;

        const MAGIQUE = [0.8375, 0.6575, 0.4425, 0];
        const ANGELS: any[] = [];
        for (let m = 0; m < MAGIQUE.length; m++) {
          let xbez = (p as any).bezierPoint(
            x,
            x,
            (x - UNIT / 2 - x) / p.PI + x,
            x - UNIT / 2,
            MAGIQUE[m],
          );
          let ybez = (p as any).bezierPoint(
            y - (UNIT / 8) * 5,
            y - (UNIT / 8) * 5,
            y - (UNIT / 8) * 7,
            y - (UNIT / 8) * 7,
            MAGIQUE[m],
          );
          p.point(xbez, ybez);
          const xdiff = x - xbez;
          const ydiff = y - ybez;
          ANGELS.push(p.atan(ydiff / xdiff));
        }
        //console.log(ANGELS);

        for (let l = 0; l < LAYERS; l++) {
          p.beginShape(p.POINTS);
          const diameter = (UNIT * (LAYERS - l + 1)) / LAYERS;
          //p.noStroke();
          p.stroke("#ff0000");
          p.arc(x, y, diameter, diameter, p.PI, p.TWO_PI);
          p.stroke(STROKE);
          const aCut = ANGELS[l] * 0.5;
          const aStart = p.PI + aCut;
          const aEnd = p.TWO_PI - aCut;
          for (let a = aStart; a <= aEnd; a += 2 * p.atan(STROKE_WEIGHT / (diameter / 2))) {
            const xDot = x + (diameter * p.cos(a)) / 2;
            const yDot = y + (diameter * p.sin(a)) / 2;
            p.vertex(xDot, yDot);
            p.line(x, y, xDot, yDot);
          }
          p.endShape(p.CLOSE);
        }
        if (odd) x -= UNIT * 0.5;
      }
      odd = !odd;
    }
    //scroll--;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
