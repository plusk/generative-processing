let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

//redrange
//yeblu
//pastella
//sydney
const PALETTE_NAME = "sydney";

let padding;

let areax;
let areay;

const MAXPOLY = 8;
const POLYCOUNT = MAXPOLY - 1;

let STROKE_WEIGHT = 3;

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1350);
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  // const keys = Object.keys(palettes);
  // palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  background(colors_bg);
  strokeWeight(STROKE_WEIGHT);

  fill(colors_bg);

  frameRate(2);

  padding = 1080 / 5;

  jumpx = (width - padding * 2) / (POLYCOUNT - 1);
  jumpy = (height - padding * 2) / (POLYCOUNT - 1);
}

let col;
let row;

function draw() {
  background(colors_bg);
  row = 1;
  for (let y = padding; y <= height - padding; y += jumpy) {
    col = 2;
    for (let x = padding; x <= width - padding; x += jumpx) {
      push();
      translate(x, y);
      rotate(-PI / 2);
      if (col == 1) {
        point(0, 0);
      } else {
        polygon(0, 0, jumpx * 0.3, col, row);
      }
      pop();
      col++;
    }
    row++;
  }
  // noLoop();
}

function polygon(x, y, radius, npoints, row) {
  let angle = TWO_PI / npoints;
  const vertices = [];
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertices.push([sx, sy]);
  }

  for (let v = 0; v < vertices.length; v++) {
    stroke(random(colors));
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
}

function consider(vert, nuvert, row) {
  const DECAY = ((jumpy / (POLYCOUNT - row + 1)) * random(row - 1)) / POLYCOUNT;
  const randy = 0.25 * (row - 1);
  if (random() < 0.5) {
    strokeWeight(
      STROKE_WEIGHT *
        random(1 - (0.2 / POLYCOUNT) * row, 1 + (row - 1) / POLYCOUNT)
    );
    line(
      vert[0] - DECAY,
      vert[1] - DECAY,
      nuvert[0] + DECAY,
      nuvert[1] + DECAY
    );
    strokeWeight(STROKE_WEIGHT * 3);
    point(vert[0] - DECAY, vert[1] - DECAY);
    point(nuvert[0] + DECAY, nuvert[1] + DECAY);
    strokeWeight(STROKE_WEIGHT);
  }
}

function clickOnSave() {
  saveCanvas();
}
