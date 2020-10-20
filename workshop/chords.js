let PALETTES, COLORS, STROKE, BG;

/* Enable to make a canvas suitable for A2 paper */
const PRINT_MODE = false;

/* Get a random palette or choose a specific one from palettes.json */
const RANDOM_PALETTE = false;
const PALETTE_NAME = "mono";

const STROKE_WEIGHT = 1;
const OPACITY = 0.1;
const RADIUS = 400;

const IS_RANDOM = false;
const NOISE_SPEED = 0.05;
const LINE_COUNT = 10;

const RANDOM_BIASED_ANGLE = true;
let BIASED_ANGLE = Math.PI / 2;

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

  colorMode(HSL);
  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = color(PALETTE.bg);

  /* Sketch-specific setup */
  STROKE = random(COLORS);
  STROKE.setAlpha(OPACITY);
  stroke(STROKE);

  background(BG);
  strokeWeight(STROKE_WEIGHT);

  RANDOM_BIASED_ANGLE && (BIASED_ANGLE = random(TWO_PI));
  noiseDetail(4, 0.75);
}

function draw() {
  translate(width / 2, height / 2);
  rotate(BIASED_ANGLE);

  for (let i = 0; i < LINE_COUNT; i++) {
    let a1, a2;

    if (IS_RANDOM) {
      a1 = random(TWO_PI);
      a2 = random(TWO_PI);
    } else {
      a1 = TWO_PI * noise(i, frameCount * NOISE_SPEED);
      a2 = TWO_PI * noise(i + LINE_COUNT, frameCount * NOISE_SPEED);
    }

    const x1 = RADIUS * cos(a1);
    const y1 = RADIUS * sin(a1);
    const x2 = RADIUS * cos(a2);
    const y2 = RADIUS * sin(a2);

    line(x1, y1, x2, y2);
  }
}

function clickOnSave() {
  saveCanvas();
}
