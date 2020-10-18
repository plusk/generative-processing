let PALETTES, COLORS, STROKE, BACKGROUNDS, BG;

const PRINT_MODE = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "termos";

const STROKE_WEIGHT = 2;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  pixelDensity(1);
  const cnv = PRINT_MODE ? createCanvas(4960, 7016) : createCanvas(1080, 1350);
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE_KEYS = Object.keys(PALETTES);
  const PALETTE = !RANDOM_PALETTE
    ? PALETTES[PALETTE_NAME]
    : PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BACKGROUNDS = PALETTE["bg"].map((col) => color(col));

  STROKE = random(COLORS);
  BG = random(BACKGROUNDS);

  background(BG);
  stroke(STROKE);
  fill(random(COLORS));
  strokeWeight(STROKE_WEIGHT);
}

function draw() {
  circle(width / 2, height / 2, 400);
}

function clickOnSave() {
  saveCanvas();
}
