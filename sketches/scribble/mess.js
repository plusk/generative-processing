let section;
let cnv;

function preload() {
  palettes = loadJSON("../palettes.json");
}

const SPEED = 5; // higher = fewer circles
const OPACITY_STROKE = 0.75; // higher = harsher circles
const OPACITY_FILL = 0.1; // higher = less visible background circles

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

  section = width / 4;
}

function draw() {
  for (let y = section; y <= height - section; y += 8) {
    for (let x = section; x <= width - section; x += 8) {
      const nooice = noise(0.01 * x, 0.01 * y, 0.1 * frameCount);
      circle(x, y, nooice * section * 2);
    }
  }
}

function clickOnSave() {
  // saveCanvas();
}
