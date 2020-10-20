let PALETTES, COLORS, BG;

const PRINT_MODE = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "online";

const STROKE_WEIGHT = 20;
const DIAMETER = 400;

/*

  CONFIG END

*/

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  const cnv = PRINT_MODE ? createCanvas(4960, 7016) : createCanvas(1080, 1350);
  cnv.mouseClicked(clickOnSave);
  pixelDensity(1);

  /* Get colors from the palettes */
  const PALETTE_KEYS = Object.keys(PALETTES);
  const PALETTE = !RANDOM_PALETTE
    ? PALETTES[PALETTE_NAME]
    : PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];

  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = color(PALETTE.bg);
  colorMode(HSL);

  /* Sketch-specific setup */
  strokeWeight(STROKE_WEIGHT);
  stroke(random(COLORS));
  fill(random(COLORS));
  background(BG);
}

function draw() {
  circle(width / 2, height / 2, DIAMETER);
}

function clickOnSave() {
  saveCanvas();
}
