import p5 from "p5";
import { palettes } from "../../palettes";

let cnv: any;
let palette: any;

const PALETTE_NAME = "mono";

const STROKE_WEIGHT = 1;
const COUNT = 100;
const RADIUS = 1080 / 4;

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
    p.translate(p.width / 2, p.height / 2);
    const xEnd = p.random(-p.width / 4, p.width / 4);
    const yEnd = p.random(-p.height / 4, p.height / 4);
    const xAnchor0 = p.random(-p.width / 2, p.width / 2);
    const yAnchor0 = p.random(-p.height / 2, p.height / 2);
    const xAnchor1 = p.random(-p.width / 2, p.width / 2);
    const yAnchor1 = p.random(-p.height / 2, p.height / 2);

    for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / COUNT) {
      const xStart = RADIUS * p.cos(a);
      const yStart = RADIUS * p.sin(a);

      p.bezier(xStart, yStart, xAnchor0, yAnchor0, xAnchor1, yAnchor1, xEnd, yEnd);
    }

    p.noLoop();
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
