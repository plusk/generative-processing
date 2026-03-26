import p5 from "p5";
import palettesData from "../../../palettes.json";

let cnv: any;
let palette: any;
let colors: any;
let colors_stroke: any;
let colors_bg: any;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 1;
const RADIUS = 1080 / 4;
const ANGLE_STEP = 0.02;

let COLOR_PALETTE: any;
let COLOR_BG: any;
let COLOR_STROKE: any;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettesData[PALETTE_NAME];
    // const keys = Object.keys(palettesData);
    // palette = palettesData[keys[(keys.length * Math.random()) << 0]];
    COLOR_PALETTE = palette["colors"];
    COLOR_BG = p.color(palette["bg"]);
    COLOR_STROKE = p.color(p.random(COLOR_PALETTE));

    p.background(COLOR_BG);
    p.fill(COLOR_BG);
    //p.noFill();
    //COLOR_STROKE.setAlpha(4);
    p.stroke(COLOR_STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(colors);
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    for (let r = 0; r < RADIUS; r += STROKE_WEIGHT * 2) {
      for (let a = 0; a < p.TWO_PI; a += ANGLE_STEP) {
        const x0 = 0;
        const y0 = 0;
        const x1 = r * p.cos(a);
        const y1 = r * p.sin(a);

        const cx0 = p.random(r) * p.cos(p.random(a));
        const cy0 = p.random(r) * p.cos(p.random(a));
        const cx1 = p.random(r) * p.cos(p.random(a));
        const cy1 = p.random(r) * p.cos(p.random(a));
        //p.point(x, y);
        //p.bezier(0, 0, 25, 50, 50, 25, 100, 100);
        p.bezier(x0, y0, cx0, cy0, cx1, cy1, x1, y1);
        //p.bezier(0, 0, x, y, 0, p.height, p.height / 2);
        //p.circle(x, y, r);
      }
    }
    p.noLoop();
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
