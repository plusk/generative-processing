// ONLY WORKS WITH P5v1.0.0, THEY FIXED MY BUG :(

let section;
let gap;
let z = 0;
let xoff = 0;
let yoff = 0;

let scribblecount = 32;
let coords = [];
let maxr = 7.5;

let bigrad = 0;

let bigcolor;
let cnv;

let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "genesis";

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  background(colors_bg);

  section = width / 8;
  gap = width / 16;
  bigrad = width > height ? (height - section) / 2 : (width - section) / 2;
  for (let c = 0; c < scribblecount; c++) {
    const ang = random(TWO_PI);
    const rad = bigrad * sqrt(random());
    coords.push([rad * cos(ang), rad * sin(ang), random(maxr), random(1), random(colors)]);
  }
  strokeWeight(3);
  bigcolor = random(colors);
}

const SPEED = 5; // higher = fewer circles
const OPACITY_STROKE = 1; // higher = harsher circles
const OPACITY_FILL = 0.5; // higher = less visible background circles

function draw() {
  translate(width / 2, height / 2);

  z++;

  coords.forEach((coord) => {
    const x = coord[0];
    const y = coord[1];
    const r = coord[2];
    const decay = coord[3];
    const nooice = noise(0.005 * x, 0.005 * y, 0.5 * z);
    stroke(coord[4]);
    fill(color(45, 45, 75, OPACITY_FILL));
    xoff = random(-gap / 4, gap / 4);
    yoff = random(-gap / 4, gap / 4);
    const raddy = r * nooice * (gap - z * SPEED * decay);
    if (raddy > 0) circle(x + xoff, y + yoff, raddy);
  });
  stroke(bigcolor);
  fill(color(45, 45, 75, 0));
  strokeWeight(1000);
  fill(color(45, 45, 75, 0));
  circle(0, 0, bigrad * 4);
  if (gap - z * SPEED < 1) {
    noLoop();
  }
}

function clickOnSave() {
  // saveCanvas();
}
