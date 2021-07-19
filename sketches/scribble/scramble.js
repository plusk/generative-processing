let section;
let gap;
let z = 0;
let xoff = 0;
let yoff = 0;

let scribblecount = 64;
let coords = [];
let maxr = 7.5;

let cnv;

let palettes;
let bg;

const SPEED = 5; // higher = fewer circles
const OPACITY_STROKE = 0.75; // higher = harsher circles
const OPACITY_FILL = 0.5; // higher = less visible background circles

function preload() {
  palettes = loadJSON("../palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);
  section = width / 8;
  gap = width / 16;
  colorMode(HSL);

  palette = palettes["onom"];
  colors = palette["colors"];
  bg = color(palette["bg"]);
  background(bg);

  bg.setAlpha(OPACITY_FILL);
  fill(bg);

  const strokey = color(random(colors));
  strokey.setAlpha(OPACITY_STROKE);
  stroke(strokey);

  for (let c = 0; c < scribblecount; c++) {
    coords.push([random(width), random(height), random(maxr)]);
  }
}

function draw() {
  if (gap - z * SPEED < 10) {
    noLoop();
  }
  z++;

  coords.forEach((coord) => {
    const x = coord[0];
    const y = coord[1];
    const r = coord[2];
    const nooice = noise(0.005 * x, 0.005 * y, 0.5 * z);
    xoff = random(-gap / 4, gap / 4);
    yoff = random(-gap / 4, gap / 4);
    circle(x + xoff, y + yoff, r * nooice * (gap - z * SPEED));
  });
}

function clickOnSave() {
  // saveCanvas();
}
