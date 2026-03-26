import p5 from "p5";
import palettesData from "../../../palettes.json";

let cnv: any;
let palette: any;
let colors: any;
let colors_stroke: any;
let colors_bg: any;

const PALETTE_NAME = "redrange";

let padding: any;

let areax: any;
let areay: any;

const MAXPOLY = 8;
const POLYCOUNT = MAXPOLY - 1;

let STROKE_WEIGHT = 3;

let jumpx: any;
let jumpy: any;
let col: any;
let row: any;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1350);
    cnv.mouseClicked(clickOnSave);

    palette = palettesData[PALETTE_NAME];
    // const keys = Object.keys(palettesData);
    // palette = palettesData[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = palette["bg"];

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);

    p.fill(colors_bg);

    p.frameRate(2);

    padding = 1080 / 5;

    jumpx = (p.width - padding * 2) / (POLYCOUNT - 1);
    jumpy = (p.height - padding * 2) / (POLYCOUNT - 1);
  };

  p.draw = () => {
    p.background(colors_bg);
    row = 1;
    for (let y = padding; y <= p.height - padding; y += jumpy) {
      col = 2;
      for (let x = padding; x <= p.width - padding; x += jumpx) {
        p.push();
        p.translate(x, y);
        p.rotate(-p.PI / 2);
        if (col == 1) {
          p.point(0, 0);
        } else {
          polygon(0, 0, jumpx * 0.3, col, row);
        }
        p.pop();
        col++;
      }
      row++;
    }
    // p.noLoop();
  };

  const polygon = (x: any, y: any, radius: any, npoints: any, row: any) => {
    let angle = p.TWO_PI / npoints;
    const vertices: any[] = [];
    for (let a = 0; a < p.TWO_PI; a += angle) {
      let sx = x + p.cos(a) * radius;
      let sy = y + p.sin(a) * radius;
      vertices.push([sx, sy]);
    }

    for (let v = 0; v < vertices.length; v++) {
      p.stroke(p.random(colors));
      const vert = vertices[v];
      if (v === 0 && npoints) {
        consider(vert, vertices[vertices.length - 1], row);
        consider(vert, [x, y], row);
        consider(vert, vertices[v + 1], row);
      } else if (v === vertices.length - 1) {
        consider(vert, vertices[v - 1], row);
        consider(vert, [x, y], row);
        consider(vert, vertices[0], row);
      } else {
        consider(vert, vertices[v - 1], row);
        consider(vert, [x, y], row);
        consider(vert, vertices[v + 1], row);
      }
    }
  };

  const consider = (vert: any, nuvert: any, row: any) => {
    const DECAY = ((jumpy / (POLYCOUNT - row + 1)) * p.random(row - 1)) / POLYCOUNT;
    const randy = 0.25 * (row - 1);
    if (p.random() < 0.5) {
      p.strokeWeight(STROKE_WEIGHT * p.random(1 - (0.2 / POLYCOUNT) * row, 1 + (row - 1) / POLYCOUNT));
      p.line(
        vert[0] + DECAY * p.random(-randy, randy),
        vert[1] + DECAY * p.random(-randy, randy),
        nuvert[0] + DECAY * p.random(-randy, randy),
        nuvert[1] + DECAY * p.random(-randy, randy)
      );
      p.strokeWeight(STROKE_WEIGHT * 3);
      p.point(vert[0] + DECAY * p.random(-randy, randy), vert[1] + DECAY * p.random(-randy, randy));
      p.point(nuvert[0] + DECAY * p.random(-randy, randy), nuvert[1] + DECAY * p.random(-randy, randy));
      p.strokeWeight(STROKE_WEIGHT);
    }
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
