import p5 from "p5";
import { palettes } from "../../palettes";

let cnv: any;
let palette: any;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const RADIUS = 1080 / 4;
const ANGLE_STEP = 0.1;

let COLOR_PALETTE: any;
let COLOR_BG: any;
let COLOR_STROKE: any;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettes[PALETTE_NAME];
    // const keys = Object.keys(palettes);
    // palette = palettes[keys[(keys.length * Math.random()) << 0]];
    COLOR_PALETTE = palette["colors"];
    COLOR_BG = p.color(palette["bg"]);
    COLOR_STROKE = p.color(p.random(COLOR_PALETTE));

    p.background(COLOR_BG);
    p.fill(COLOR_BG);
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
        const x = r * p.cos(a);
        const y = r * p.sin(a);
        //p.point(x, y);
        //p.bezier(0, 0, 25, 50, 50, 25, 100, 100);
        p.bezier(0, 0, -p.width / 2, -p.height / 2, p.width / 2, p.height / 2, x, y);
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
