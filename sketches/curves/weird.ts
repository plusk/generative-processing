import p5 from "p5";
import { palettes } from "../../palettes";

let cnv: any;
let palette: any;
let colors: any;

let colors_bg: any;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const RADIUS = 400;
const ANGLE_STEP = 100;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettes[PALETTE_NAME];
    // const keys = Object.keys(palettes);
    // palette = palettes[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = palette["bg"];

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);
    p.stroke(p.random(colors));

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(colors);
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    for (let r = 0; r < RADIUS; r += STROKE_WEIGHT) {
      for (let a = 0; a < p.TWO_PI; a += ANGLE_STEP / r) {
        p.point(r * p.cos(a), r * p.sin(a));
      }
    }
    p.noLoop();
    // p.beginShape(); p.POINTS, p.LINES, p.TRIANGLES, p.TRIANGLE_FAN, p.TRIANGLE_STRIP, p.QUADS, p.QUAD_STRIP
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
