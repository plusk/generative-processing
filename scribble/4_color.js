let section;
let gap;
let z = 0;
let xoff = 0;
let yoff = 0;

let scribblecount = 64;
let coords = [];
let maxr = 7.5;

let bigrad = 0;

let palette;
let bigcolor;
let cnv;

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);

  section = width / 8;
  gap = width / 16;
  colorMode(HSL);
  background(45, 45, 75);
  bigrad = width > height ? (height - section) / 2 : (width - section) / 2;
  for (let c = 0; c < scribblecount; c++) {
    const ang = random(TWO_PI);
    const rad = bigrad * sqrt(random());
    coords.push([
      rad * cos(ang),
      rad * sin(ang),
      random(maxr),
      random(palette),
    ]);
  }
  strokeWeight(3);
  bigcolor = random(palette);
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
    fill(color(45, 45, 75, OPACITY_FILL));
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
