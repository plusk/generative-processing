import p5 from "p5";
import { palettes } from "../../../palettes";

let section: any;
let gap: any;
let xoff = 0;
let yoff = 0;
let cnv: any;
let bg: any;
let palette: any;
let colors: any;

const SPEED = 5; // higher = fewer circles
const OPACITY_STROKE = 0.75; // higher = harsher circles
const OPACITY_FILL = 0.5; // higher = less visible background circles

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080);
    cnv.mouseClicked(clickOnSave);

    p.colorMode(p.HSL);

    palette = palettes["onom"];
    colors = palette["colors"];
    bg = p.color(palette["bg"]);
    p.background(bg);

    bg.setAlpha(OPACITY_FILL * 255);
    p.fill(bg);

    const strokey = p.color(p.random(colors));
    strokey.setAlpha(OPACITY_STROKE * 255);
    p.stroke(strokey);

    section = p.width / 8;
    gap = p.width / 8;
  };

  p.draw = () => {
    if (gap - p.frameCount * SPEED < 0) {
      p.noLoop();
    }
    for (let y = section; y <= p.height - section; y += gap) {
      for (let x = section; x <= p.width - section; x += gap) {
        const nooice = p.noise(0.005 * x, 0.005 * y, 0.5 * p.frameCount);
        xoff = p.random(-gap / 4, gap / 4);
        yoff = p.random(-gap / 4, gap / 4);
        p.circle(x + xoff, y + yoff, nooice * (gap - p.frameCount * SPEED));
      }
    }
  };

  const clickOnSave = () => {
    // p.saveCanvas();
  };
});
