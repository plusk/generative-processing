let section;
let gap;
let z = 0;
let xoff = 0;
let yoff = 0;
let cnv;

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);
  section = width / 8;
  gap = width / 8;
  colorMode(HSL);
  stroke(color(0, 0, 0, OPACITY_STROKE));
  background(45, 45, 75);
}

const SPEED = 5; // higher = fewer circles
const OPACITY_STROKE = 0.75; // higher = harsher circles
const OPACITY_FILL = 0.75; // higher = less visible background circles

function draw() {
  if (gap - z * SPEED < 0) {
    noLoop();
  }
  z++;
  for (let y = section; y <= height - section; y += gap) {
    for (let x = section; x <= width - section; x += gap) {
      const nooice = noise(0.005 * x, 0.005 * y, 0.5 * z);
      fill(color(45, 45, 75, OPACITY_FILL));
      xoff = random(-gap / 4, gap / 4);
      yoff = random(-gap / 4, gap / 4);
      circle(x + xoff, y + yoff, nooice * (gap - z * SPEED));
    }
  }
}

function clickOnSave() {
  // saveCanvas();
}
