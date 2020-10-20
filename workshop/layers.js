let PALETTES, COLORS, STROKE, BG;

const PRINT_MODE = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "genesis";

const STROKE_WEIGHT = 1;
const LAYER_COUNT = 10;
const MAX_RADIUS = 500;

const INVERTED_GRADIENT = false;
const CAP_LIGHTNESS = false;
const HAS_STROKE = false;
const SYMMETRICAL_X = false;
const SYMMETRICAL_Y = false;

/**
 * Background is determined by the gradient, but these flags may override it
 * If both flags are true, palette background will be used
 */
const USE_FILL_AS_BACKGROUND = true;
const USE_PALETTE_BACKGROUND = false;

const NOISE_AMPLIFIER = 2;
const NOISE_SPEED = 0.005;
const SHARPNESS = 0.1;

/* Negative speed rotates counter-clockwise */
const ROTATION_SPEED = 0.05;

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
  STROKE = random(COLORS);

  HAS_STROKE ? stroke(STROKE) : noStroke();
  strokeWeight(STROKE_WEIGHT);
  angleMode(DEGREES);
}

function draw() {
  translate(width / 2, height / 2);
  drawBackground();

  for (let i = LAYER_COUNT; i > 0; i--) {
    drawLayer((MAX_RADIUS / LAYER_COUNT) * i, i);
  }
}

function drawBackground() {
  if (INVERTED_GRADIENT) {
    CAP_LIGHTNESS ? background(STROKE) : background(255);
  } else {
    background(0);
  }
  USE_FILL_AS_BACKGROUND && background(STROKE);
  USE_PALETTE_BACKGROUND && background(BG);
}

function drawLayer(r, i) {
  const layerColorFactor = INVERTED_GRADIENT
    ? i / LAYER_COUNT
    : 1 - i / LAYER_COUNT;

  const fillColor = color(
    hue(STROKE),
    layerColorFactor * saturation(STROKE),
    layerColorFactor * (CAP_LIGHTNESS ? lightness(STROKE) : 100)
  );
  fill(fillColor);

  beginShape();
  for (let a = 0; a < 360; a++) {
    const xOff = SYMMETRICAL_Y
      ? cos(a)
      : map(i * SHARPNESS * cos(a) + 1, -1, 1, 1, 1 + NOISE_AMPLIFIER);
    const yOff = SYMMETRICAL_X
      ? sin(a)
      : map(i * SHARPNESS * sin(a) + 1, -1, 1, 1, 1 + NOISE_AMPLIFIER);
    const noised = noise(xOff, yOff, frameCount * NOISE_SPEED);

    const noisedRadius = noised * r;
    const x = noisedRadius * cos(a + frameCount * ROTATION_SPEED);
    const y = noisedRadius * sin(a + frameCount * ROTATION_SPEED);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function clickOnSave() {
  saveCanvas();
}
