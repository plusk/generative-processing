import p5 from "p5";
import { palettes } from "../../../palettes";

let cnv: any;
let palette: any;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const COUNT_X = 50;
const COUNT_Y = 50;

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
    p.noFill();
    COLOR_STROKE.setAlpha(63);
    p.stroke(COLOR_STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLOR_PALETTE);
  };

  p.draw = () => {
    const xEnd = p.random(p.width);
    const yEnd = p.random(p.height);
    const xAnchor0 = p.random(p.width);
    const yAnchor0 = p.random(p.height);
    const xAnchor1 = p.random(p.width);
    const yAnchor1 = p.random(p.height);
    for (let x = 0; x <= p.width; x += p.width / COUNT_X) {
      for (let y = 0; y <= p.height; y += p.height / COUNT_Y) {
        p.bezier(xEnd, yEnd, xAnchor0, yAnchor0, xAnchor1, yAnchor1, x, y);
      }
    }
    p.noLoop();
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
