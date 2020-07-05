let section;
let gap;
let z = 0;
let xoff = 0;
let yoff = 0;

let scribblecount = 32;
let coords = [];
let maxr = 7.5;

function setup() {
  createCanvas(1920, 1080);
  section = width / 8;
  gap = width / 16;
  colorMode(HSL);
  stroke(color(0, 0, 0, OPACITY_STROKE));
  background(45, 45, 75);
  for (let c = 0; c < scribblecount; c++) {
    coords.push([random(width), random(height), random(maxr)]);
  }
}

const SPEED = 5; // higher = fewer circles
const OPACITY_STROKE = 1; // higher = harsher circles
const OPACITY_FILL = 0.5; // higher = less visible background circles

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
    fill(color(45, 45, 75, OPACITY_FILL));
    xoff = random(-gap / 8, gap / 8);
    yoff = random(-gap / 8, gap / 8);
    circle(x + xoff, y + yoff, r * nooice * (gap - z * SPEED));
  });

  /*
  for (let y = section; y <= height - section; y += gap) {
    for (let x = section; x <= width - section; x += gap) {
      const nooice = noise(0.005 * x, 0.005 * y, 0.5 * z);
      fill(color(45, 45, 75, OPACITY_FILL));
      xoff = random(-gap / 16, gap / 16);
      yoff = random(-gap / 16, gap / 16);
      circle(x + xoff, y + yoff, nooice * (gap - z * SPEED));
    }
  }*/
}
