let PALETTES, COLORS, STROKE, BACKGROUNDS, BG;

const EXPORT = false;

const PALETTE_NAME = "speis";

const STROKE_WEIGHT = 2;
const OPACITY = 1;
const LAYER_COUNT = 10;
const MAX_RADIUS = 500;
const IS_DARK = true;
const HAS_STROKE = true;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  if (EXPORT) frameRate(4);
  angleMode(DEGREES);

  const cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE = PALETTES[PALETTE_NAME];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BACKGROUNDS = PALETTE["bg"].map((col) => color(col));

  STROKE = random(COLORS);
  BG = random(BACKGROUNDS);

  background(BG);
  STROKE.setAlpha(OPACITY);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);
}

function draw() {
  translate(width / 2, height / 2);
  background(IS_DARK ? 0 : 255);

  !HAS_STROKE && noStroke();

  for (let i = LAYER_COUNT; i > 0; i--) {
    drawLayer(50 * i, i);
  }
}

function drawLayer(r, i) {
  const layerColorFactor = IS_DARK
    ? IS_DARK - i / LAYER_COUNT
    : i / LAYER_COUNT;

  const fillColor = color(
    hue(STROKE),
    layerColorFactor * saturation(STROKE),
    layerColorFactor * 100
  );
  fill(fillColor);

  beginShape();
  for (let a = 0; a < 360; a++) {
    const noised = noise(cos(a) * 1, sin(a) * 1, frameCount * 0.005);
    const x = noised * r * cos(a);
    const y = noised * r * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function clickOnSave() {
  //saveCanvas();
}
