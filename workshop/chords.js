let PALETTES, COLORS, STROKE, BG;

/* Enable to make a canvas suitable for A2 paper */
const PRINT_MODE = false;

/* Get a random palette or choose a specific one from palettes.json */
const RANDOM_PALETTE = false;
const PALETTE_NAME = "mono";

/* Choose a random color from the palette for each line */
const RANDOM_STROKE = false;

/* How big the circle will be */
const RADIUS = 400;

/* How many independent lines will be drawn each frame */
const LINE_COUNT = 5;

/* How swiftly the lines will move around (lower is slower) */
const NOISE_SPEED = 0.05;

/* How opaque the lines will be, lower means more transparent */
/* Lower will be smoother, but also takes longer to fill the circle */
const OPACITY = 0.05;
const STROKE_WEIGHT = 1;

/* Enable to use randomness instead of noise to select line locations */
/* This effectively overrides the remaining config */
const IS_RANDOM = false;

/* If not IS_RANDOM: noise will naturally tend towards a mean */
/* Enable this to vary where the mean is, or disable and specify your own */
const RANDOM_BIASED_ANGLE = true;
let BIASED_ANGLE = Math.PI / 2;

/* If not IS_RANDOM: this value effectively says how strong the bias is */
/* A lower value means the bias is strong, higher means near-random lines */
const NOISE_RANDOMNESS = 0.75;

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
  strokeWeight(STROKE_WEIGHT);
  STROKE = random(COLORS);
  STROKE.setAlpha(OPACITY);
  stroke(STROKE);
  background(BG);

  RANDOM_BIASED_ANGLE && (BIASED_ANGLE = random(TWO_PI));
  noiseDetail(4, NOISE_RANDOMNESS);
}

function draw() {
  /* Moves the origin of the coordinate system to the center of the canvas */
  /* Rotate based on the bias angle, be that random or not */
  translate(width / 2, height / 2);
  rotate(BIASED_ANGLE);

  /* For every line to be rendered each frame */
  for (let i = 0; i < LINE_COUNT; i++) {
    /* Select two random or noised angles on the circle */
    let a1, a2;
    if (IS_RANDOM) {
      a1 = random(TWO_PI);
      a2 = random(TWO_PI);
    } else {
      a1 = TWO_PI * noise(i, frameCount * NOISE_SPEED);
      a2 = TWO_PI * noise(i + LINE_COUNT, frameCount * NOISE_SPEED);
    }

    /* Use the two angles to determine two points on the circle */
    const x1 = RADIUS * cos(a1);
    const y1 = RADIUS * sin(a1);
    const x2 = RADIUS * cos(a2);
    const y2 = RADIUS * sin(a2);

    /* If random, choose a new color for each line */
    if (RANDOM_STROKE) {
      const randomColor = random(COLORS);
      randomColor.setAlpha(OPACITY);
      stroke(randomColor);
    }

    /* Draw a line between the two points */
    line(x1, y1, x2, y2);
  }
}

function clickOnSave() {
  saveCanvas();
}
