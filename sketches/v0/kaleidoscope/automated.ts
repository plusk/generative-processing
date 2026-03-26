import p5 from "p5";
import palettesData from "../../../palettes.json";

let symmetry = 64;

let symangle = 360 / symmetry;

let frame = 0;
let x: any, y: any;

let cnv: any;
let palette: any;
let colors: any;
let colors_stroke: any;
let colors_bg: any;

const PALETTE_NAME = "pastella";

const STEP = 1.5;

let angle = 0;
let anglestep = 1;
let anglesign = 1;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080);
    cnv.mouseClicked(clickOnSave);

    palette = palettesData[PALETTE_NAME];
    // const keys = Object.keys(palettesData);
    // palette = palettesData[keys[(keys.length * Math.random()) << 0]];

    colors = palette["colors"];
    colors_bg = palette["bg"];
    colors_stroke = palette["stroke"];

    p.background(colors_bg);
    p.angleMode(p.DEGREES);

    p.strokeWeight(3);
    x = p.width / 2;
    y = p.height / 2;
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    frame += 0.5;

    if (x > 0 && x < p.width && y > 0 && y < p.height) {
      let startx = x;
      let starty = y;

      let noised = p.noise(x, y) - 0.5;

      anglestep = p.random(2);
      if (angle > 180 || angle < 0) anglesign *= -1;
      angle += anglestep * anglesign + noised * 2;

      x += p.cos(angle) * STEP;
      y += p.sin(angle) * STEP;

      for (let i = 0; i < symmetry; i++) {
        p.stroke(colors[i % colors.length]);
        p.rotate(symangle);
        p.line(startx - p.width / 2, starty - p.height / 2, x - p.width / 2, y - p.height / 2);
        p.push();
        p.scale(1, -1);
        p.line(startx - p.width / 2, starty - p.height / 2, x - p.width / 2, y - p.height / 2);
        p.pop();
      }
    }
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
