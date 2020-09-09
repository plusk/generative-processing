let cnv;
let palettes;
let palette;
let colors;

//redrange
//yeblu
//pastella
//sydney
const PALETTE_NAME = "bekk";

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

  const palette = palettes[PALETTE_NAME];
  // const keys = Object.keys(palettes);
  // palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];

  strokeWeight(STROKE_WEIGHT);
  frameRate(2);

  padding = width / 5;

  jumpx = (width - padding * 2) / (POLYCOUNT - 1);
  jumpy = (height - padding * 2) / (POLYCOUNT - 1);
}

function drawBackground() {
  const c1 = color("#FF9999");
  const c2 = color("#FF5B5B");
  for (var y = 0; y < height; y++) {
    const inter = y / height;
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function draw() {
  drawBackground();
  let row = 1;
  for (let y = padding; y <= height - padding; y += jumpy) {
    let col = 2;
    for (let x = padding; x <= width - padding; x += jumpx) {
      push();
      translate(x, y);
      rotate(-PI / 2);
      polygon(0, 0, jumpx * 0.3, col, row);
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
      vert[0] + DECAY * random(-randy, randy),
      vert[1] + DECAY * random(-randy, randy),
      nuvert[0] + DECAY * random(-randy, randy),
      nuvert[1] + DECAY * random(-randy, randy)
    );
    strokeWeight(STROKE_WEIGHT * 3);
    point(
      vert[0] + DECAY * random(-randy, randy),
      vert[1] + DECAY * random(-randy, randy)
    );
    point(
      nuvert[0] + DECAY * random(-randy, randy),
      nuvert[1] + DECAY * random(-randy, randy)
    );
    strokeWeight(STROKE_WEIGHT);
  }
}

function clickOnSave() {
  saveCanvas();
}
