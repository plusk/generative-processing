import p5 from "p5";
import { palettes } from "../../../palettes";

const PALETTE_NAME = "symmeblu";

const STROKE_WEIGHT = 4;
const PADDING = 200;

let cnv: any;
let palette: any;
let colors: any[];
let colors_bg: any;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettes[PALETTE_NAME];
    // const keys = Object.keys(palettes);
    // palette = (palettes)[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = palette["bg"];

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.stroke(colors_bg);
    (p as any).rectMode(p.CENTER);
    p.frameRate(2);
  };

  p.draw = () => {
    p.background(colors_bg);
    p.translate(p.width / 2, p.height / 2);
    p.beginShape();
    drawSquare(0, 0, p.width - PADDING * 2);
    p.endShape(p.CLOSE);
  };

  const drawSquare = (x: number, y: number, radius: number) => {
    p.fill(p.random(colors));
    p.stroke(p.random(colors));

    if (p.random() > 0.5) {
      p.vertex(x, y);
      //p.rect(x, y, radius);
      //p.circle(x, y, radius);
    }
    const uhhh = [2, 2, 2, 4];
    if (radius > STROKE_WEIGHT * 4) {
      if (p.random() > 0.25) drawSquare(x - radius / 4, y - radius / 4, radius / p.random(uhhh));
      if (p.random() > 0.25) drawSquare(x + radius / 4, y - radius / 4, radius / p.random(uhhh));
      if (p.random() > 0.25) drawSquare(x - radius / 4, y + radius / 4, radius / p.random(uhhh));
      if (p.random() > 0.25) drawSquare(x + radius / 4, y + radius / 4, radius / p.random(uhhh));
    }
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
