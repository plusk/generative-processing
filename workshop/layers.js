let PALETTES, COLORS, STROKE, BG;

const PRINT_MODE = false;

const RANDOM_PALETTE = true;
const PALETTE_NAME = "mello";

const STROKE_WEIGHT = 1;
const OPACITY = 1;
const LAYER_COUNT = 10;
const MAX_RADIUS = 500;

const INVERTED_GRADIENT = false;
const HAS_STROKE = false;
const COLORED_BACKGROUND = true;
const CAP_LIGHTNESS = true;
const SYMMETRICAL_X = false;
const SYMMETRICAL_Y = false;

const NOISE_AMPLIFIER = 2;
const NOISE_SPEED = 0.005;
const SHARPNESS = 0.1;

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
  STROKE.setAlpha(OPACITY);
  HAS_STROKE ? stroke(STROKE) : noStroke();
  strokeWeight(STROKE_WEIGHT);
  angleMode(DEGREES);
}

function draw() {
  translate(width / 2, height / 2);
  COLORED_BACKGROUND
    ? background(STROKE)
    : background(INVERTED_GRADIENT ? 255 : 0);

  for (let i = LAYER_COUNT; i > 0; i--) {
    drawLayer((MAX_RADIUS / LAYER_COUNT) * i, i);
  }
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
    const x = noisedRadius * cos(a);
    const y = noisedRadius * sin(a);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function clickOnSave() {
  saveCanvas();
}
