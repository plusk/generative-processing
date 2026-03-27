import p5 from "p5";
import { palettes } from "../../../palettes";

let _section: any;
let gap: any;
let z = 0;
let xoff = 0;
let yoff = 0;

let scribblecount = 64;
let coords: any[] = [];
let maxr = 7.5;

let cnv: any;

let palette: any;
let bg: any;
let colors: any;

const SPEED = 5; // higher = fewer circles
const OPACITY_STROKE = 0.75; // higher = harsher circles
const OPACITY_FILL = 0.5; // higher = less visible background circles

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080);
    cnv.mouseClicked(clickOnSave);
    _section = p.width / 8;
    gap = p.width / 16;
    p.colorMode(p.HSL);

    palette = palettes["onom"];
    colors = palette["colors"];
    bg = p.color(palette["bg"]);
    p.background(bg);

    bg.setAlpha(OPACITY_FILL);
    p.fill(bg);

    const strokey = p.color(p.random(colors));
    strokey.setAlpha(OPACITY_STROKE);
    p.stroke(strokey);

    for (let c = 0; c < scribblecount; c++) {
      coords.push([p.random(p.width), p.random(p.height), p.random(maxr)]);
    }
  };

  p.draw = () => {
    if (gap - z * SPEED < 10) {
      p.noLoop();
    }
    z++;

    coords.forEach((coord) => {
      const x = coord[0];
      const y = coord[1];
      const r = coord[2];
      const nooice = p.noise(0.005 * x, 0.005 * y, 0.5 * z);
      xoff = p.random(-gap / 4, gap / 4);
      yoff = p.random(-gap / 4, gap / 4);
      p.circle(x + xoff, y + yoff, r * nooice * (gap - z * SPEED));
    });
  };

  const clickOnSave = () => {
    // p.saveCanvas();
  };
});
