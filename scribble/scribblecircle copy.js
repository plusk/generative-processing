let section;
let gap;
let z = 0;
let xoff = 0;
let yoff = 0;

let scribblecount = 32;
let coords = [];
let maxr = 7.5;

let bigrad = 0;

function setup() {
  createCanvas(750, 750);
  section = width / 8;
  gap = width / 16;
  colorMode(HSL);
  stroke(color(0, 0, 0, OPACITY_STROKE));
  background(45, 45, 75);
  let bigrad = width > height ? (height - section) / 2 : (width - section) / 2;
  for (let c = 0; c < scribblecount; c++) {
    const ang = random(TWO_PI);
    const rad = bigrad * sqrt(random());
    coords.push([rad * cos(ang), rad * sin(ang), random(maxr)]);
  }
}

const SPEED = 5; // higher = fewer circles
const OPACITY_STROKE = 1; // higher = harsher circles
const OPACITY_FILL = 0.5; // higher = less visible background circles

function draw() {
  translate(width / 2, height / 2);

  if (gap - z * SPEED < 10) {
    noLoop();
    stroke(color(255, 255));
    strokeWeight(100);
    fill(color(45, 45, 75, 0));
    circle(0, 0);
  }
  z++;

  coords.forEach((coord) => {
    const x = coord[0];
    const y = coord[1];
    const r = coord[2];
    const nooice = noise(0.005 * x, 0.005 * y, 0.5 * z);
    fill(color(45, 45, 75, OPACITY_FILL));
    xoff = random(-gap / 8, gap / 8);
    yoff = random(-gap / 8, gap / 8);
    circle(x + xoff, y + yoff, r * nooice * (gap - z * SPEED));
  });
}
