let section;
let gap;
let z = 0;
let xoff = 0;
let yoff = 0;

let scribblecount = 50;
let coords = [];
let maxr = 7.5;

let bigrad = 0;

let palettes;
let palette;
let bigcolor;
let cnv;

function preload() {
  palettes = loadJSON("../palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);

  palette = palettes["symmeblu"];

  colors = palette["colors"];

  section = width / 8;
  gap = width / 16;
  colorMode(HSL);
  background(palette["bg"]);
  bigrad = width > height ? (height - section) / 2 : (width - section) / 2;
  for (let c = 0; c < scribblecount; c++) {
    const ang = random(TWO_PI);
    const rad = bigrad * sqrt(random());
    const col = color(random(colors));
    col.setAlpha(random() + random() + random());
    coords.push([rad * cos(ang), rad * sin(ang), random(maxr), col]);
  }
  bigcolor = random(colors);
}

const SPEED = 5; // higher = fewer circles
const OPACITY_STROKE = 1; // higher = harsher circles
const OPACITY_FILL = 0.5; // higher = less visible background circles

function draw() {
  translate(width / 2, height / 2);

  z++;

  coords.forEach((coord) => {
    strokeWeight(random(10));
    const x = coord[0];
    const y = coord[1];
    const r = coord[2];
    const nooice = noise(0.005 * x, 0.005 * y, 0.5 * z);
    stroke(coord[3]);
    const filler = color(palette["bg"]);
    filler.setAlpha(OPACITY_FILL * 1);
    fill(filler);
    xoff = random(-gap / 4, gap / 4);
    yoff = random(-gap / 4, gap / 4);
    const raddy = r * nooice * (gap - z * SPEED);
    if (raddy > 0) circle(x + xoff, y + yoff, raddy);
  });
  if (gap - z * SPEED < 1) {
    noLoop();
  }
  stroke(bigcolor);
  strokeWeight(1000);
  fill(color(45, 45, 75, 0));
  circle(0, 0, bigrad * 4);
}

function clickOnSave() {
  saveCanvas();
}
