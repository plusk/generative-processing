let PALETTES, COLORS, STROKE, BACKGROUNDS, BG;

const PRINT_MODE = false;

const PALETTE_NAME = "mello";

const STROKE_WEIGHT = 1;
const OPACITY = 1;
const LAYER_COUNT = 10;
const MAX_RADIUS = 500;

const IS_DARK = true;
const HAS_STROKE = false;

const NOISE_FACTOR = 2;
const NOISE_SPEED = 0.005;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  pixelDensity(1);

  const cnv = PRINT_MODE ? createCanvas(4960, 7016) : createCanvas(1080, 1350);
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
  angleMode(DEGREES);
}

function draw() {
  translate(width / 2, height / 2);
  background(IS_DARK ? 0 : 255);

  !HAS_STROKE && noStroke();

  for (let i = LAYER_COUNT; i > 0; i--) {
    drawLayer((MAX_RADIUS / LAYER_COUNT) * i, i);
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
    const xOff = map(i * 0.1 * cos(a) + 1, -1, 1, 1, 1 + NOISE_FACTOR);
    const yOff = map(i * 0.1 * sin(a) + 1, -1, 1, 1, 1 + NOISE_FACTOR);
    const noised = noise(xOff, yOff, frameCount * NOISE_SPEED);

    const noisedRadius = noised * r;
    const x = noisedRadius * cos(a);
    const y = noisedRadius * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function clickOnSave() {
  saveCanvas();
}
