import p5 from "p5";
import { palettes } from "../../palettes";

let section: any;
let palette: any;
let colors: any;
let bg: p5.Color;

const OPACITY_STROKE = 0.75; // higher = harsher circles
const OPACITY_FILL = 0.1; // higher = less visible background circles

new p5((p: p5) => {
  p.setup = () => {
    const cnv = p.createCanvas(1080, 1080);
    cnv.mouseClicked(clickOnSave);

    p.colorMode(p.HSL);

    palette = palettes["onom"];
    colors = palette.COLORS;
    bg = p.color(palette.bg);
    p.background(bg);

    bg.setAlpha(OPACITY_FILL * 255);
    p.fill(bg);

    const strokey = p.color(p.random(colors));
    strokey.setAlpha(OPACITY_STROKE * 255);
    p.stroke(strokey);

    section = p.width / 4;
  };

  p.draw = () => {
    for (let y = section; y <= p.height - section; y += 8) {
      for (let x = section; x <= p.width - section; x += 8) {
        const nooice = p.noise(0.01 * x, 0.01 * y, 0.1 * p.frameCount);
        p.circle(x, y, nooice * section * 2);
      }
    }
  };

  const clickOnSave = () => {
    // p.saveCanvas();
  };
});
