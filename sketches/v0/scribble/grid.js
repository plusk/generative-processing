let section;
let gap;
let xoff = 0;
let yoff = 0;
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

  section = width / 8;
  gap = width / 8;
}

function draw() {
  if (gap - frameCount * SPEED < 0) {
    noLoop();
  }
  for (let y = section; y <= height - section; y += gap) {
    for (let x = section; x <= width - section; x += gap) {
      const nooice = noise(0.005 * x, 0.005 * y, 0.5 * frameCount);
      xoff = random(-gap / 4, gap / 4);
      yoff = random(-gap / 4, gap / 4);
      circle(x + xoff, y + yoff, nooice * (gap - frameCount * SPEED));
    }
  }
}

function clickOnSave() {
  // saveCanvas();
}
