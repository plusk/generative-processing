import p5 from "p5";
import palettesData from "../../../palettes.json";

// ONLY WORKS WITH P5v1.0.0, THEY FIXED MY BUG :(

let section: any;
let gap: any;
let z = 0;
let xoff = 0;
let yoff = 0;

let scribblecount = 32;
let coords: any[] = [];
let maxr = 7.5;

let bigrad = 0;

let bigcolor: any;
let cnv: any;

let palette: any;
let colors: any;

let colors_bg: any;

const PALETTE_NAME = "genesis";

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080);
    cnv.mouseClicked(clickOnSave);

    palette = palettesData[PALETTE_NAME];
    colors = palette["colors"];
    colors_bg = palette["bg"];

    p.background(colors_bg);

    section = p.width / 8;
    gap = p.width / 16;
    bigrad = p.width > p.height ? (p.height - section) / 2 : (p.width - section) / 2;
    for (let c = 0; c < scribblecount; c++) {
      const ang = p.random(p.TWO_PI);
      const rad = bigrad * p.sqrt(p.random());
      coords.push([
        rad * p.cos(ang),
        rad * p.sin(ang),
        p.random(maxr),
        p.random(1),
        p.random(colors),
      ]);
    }
    p.strokeWeight(3);
    bigcolor = p.random(colors);
  };

  const SPEED = 5; // higher = fewer circles

  const OPACITY_FILL = 0.5; // higher = less visible background circles

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);

    z++;

    coords.forEach((coord) => {
      const x = coord[0];
      const y = coord[1];
      const r = coord[2];
      const decay = coord[3];
      const nooice = p.noise(0.005 * x, 0.005 * y, 0.5 * z);
      p.stroke(coord[4]);
      p.fill(p.color(45, 45, 75, OPACITY_FILL));
      xoff = p.random(-gap / 4, gap / 4);
      yoff = p.random(-gap / 4, gap / 4);
      const raddy = r * nooice * (gap - z * SPEED * decay);
      if (raddy > 0) p.circle(x + xoff, y + yoff, raddy);
    });
    p.stroke(bigcolor);
    p.fill(p.color(45, 45, 75, 0));
    p.strokeWeight(1000);
    p.fill(p.color(45, 45, 75, 0));
    p.circle(0, 0, bigrad * 4);
    if (gap - z * SPEED < 1) {
      p.noLoop();
    }
  };

  const clickOnSave = () => {
    // p.saveCanvas();
  };
});
