let PALETTES, COLORS, STROKE, BG;

const PRINT_MODE = false;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 1;
const OPACITY = 0.1;
const RADIUS = 400;

const IS_RANDOM = false;

const LINE_COUNT = 10;
const NOISE_SPEED = 0.05;

const RANDOM_BIASED_ANGLE = true;
let BIASED_ANGLE = Math.PI / 2;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  pixelDensity(1);

  const cnv = PRINT_MODE ? createCanvas(4960, 7016) : createCanvas(1080, 1350);
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = color(PALETTE.bg);

  STROKE = random(COLORS);

  STROKE.setAlpha(OPACITY);

  background(BG);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  BIASED_ANGLE = random(TWO_PI);

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
