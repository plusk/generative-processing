let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "parchment";

let padding;

let areax;
let areay;

const MAXPOLY = 8;
const POLYCOUNT = MAXPOLY - 2;

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  // const keys = Object.keys(palettes);
  // palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  background(colors_bg);
  strokeWeight(4);
  fill(colors_bg);

  frameRate(1);

  padding = 1080 / 6;

  jumpx = (width - padding * 2) / (POLYCOUNT - 1);
  jumpy = (height - padding * 2) / (POLYCOUNT - 1);
}

let col;
let row;

function draw() {
  background(colors_bg);

  row = 1;
  for (let y = padding; y <= height - padding; y += jumpy) {
    col = 3;
    for (let x = padding; x <= width - padding; x += jumpx) {
      push();
      translate(x, y);
      rotate((TWO_PI / col) * (row - 1));
      if (col == 1) {
        point(0, 0);
      } else {
        polygon(0, 0, jumpx * 0.25, col);
      }
      pop();
      col++;
    }
    row++;
  }
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  const vertices = [];
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertices.push([sx, sy]);
  }

  let vert = vertices.splice(floor(random() * vertices.length), 1)[0];
  let nuvert;

  while (vertices.length > 0) {
    nuvert = vertices.splice(floor(random() * vertices.length), 1)[0];
    line(vert[0], vert[1], nuvert[0], nuvert[1]);
    vert = nuvert;
  }

  //line(vertizmo[0], vertizmo[1], vertizmotwo[0], vertizmotwo[1]);
}

function clickOnSave() {
  //saveCanvas();
}
