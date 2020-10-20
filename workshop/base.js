let PALETTES, COLORS, STROKE, BG;

const PRINT_MODE = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "online";

const STROKE_WEIGHT = 2;
const DIAMETER = 400;

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
  BG = color(PALETTE.bg);
  STROKE = random(COLORS);

  background(BG);
  stroke(STROKE);
  fill(random(COLORS));
  strokeWeight(STROKE_WEIGHT);
}

function draw() {
  circle(width / 2, height / 2, DIAMETER);
}

function clickOnSave() {
  saveCanvas();
}
