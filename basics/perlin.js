let PALETTES, COLORS, STROKE, BACKGROUNDS, BG;
const ACTIVE_WALKERS = [];

const PALETTE_NAME = "termos";

const WALKER_COUNT = 1000;
const STROKE_WEIGHT = 2;
const OPACITY = 1;

const MIN_STEPS = 50;
const MAX_STEPS = 100;
const STEP_LENGTH = STROKE_WEIGHT + 1;

const NOISE_ZOOM = 0.0005;

/* Slap a circle on it! */
const CLIP_CONTENT = true;
const CLIP_RADIUS = 405;

/* Enable for very straight angles */
const ROUNDED_ANGLES = false;
const ANGLE_STEP = Math.PI / 3;

/* Enable for location-based coloring */
const NOISED_STROKE = false;
const STROKE_NOISE_ZOOM = 0.005;

/* Noise will trend toward an angle, enable to randomize it */
const RANDOM_ANGLE_BIAS = true;
let ANGLE_BIAS = Math.PI / 2; // if not random, choose a bias

/* Enable for adding anti-walkers that erase from the canvas */
const ERASERS_ENABLED = true;
const ERASER_SPAWN_CHANCE = 0.5;

/* Instead of lines, draw strings of dots */
const DOT_LINES = false;

/**
 *
 *
 *
 * CONF-O-RAMA ENDS HERE
 *
 *
 *
 */

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  //pixelDensity(1);

  const cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BACKGROUNDS = PALETTE["bg"].map((col) => color(col));
  BG = random(BACKGROUNDS);

  shuffleArray(COLORS);

  for (let c = 0; c < COLORS.length; c++) {
    COLORS[c].setAlpha(OPACITY);
  }

  STROKE = random(COLORS);

  background(BG);
  strokeWeight(STROKE_WEIGHT);

  noiseDetail(3, 0.75);

  if (RANDOM_ANGLE_BIAS) ANGLE_BIAS = random(TWO_PI);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

function draw() {
  for (let i = 0; i < WALKER_COUNT; i++) {
    if (frameCount == 1) {
      setWalker(i);
    }

    const walker = ACTIVE_WALKERS[i];

    if (walker.steps > walker.step_cap) {
      setWalker(i);
    } else {
      let a = noise(walker.x * NOISE_ZOOM, walker.y * NOISE_ZOOM) * TWO_PI;

      if (ROUNDED_ANGLES) a = round(a / ANGLE_STEP) * ANGLE_STEP;

      a += PI + ANGLE_BIAS;

      stroke(walker.color);
      const x2 = walker.x + STEP_LENGTH * cos(a);
      const y2 = walker.y + STEP_LENGTH * sin(a);

      if (DOT_LINES) point(walker.x, walker.y);
      else line(walker.x, walker.y, x2, y2);

      walker.x = x2;
      walker.y = y2;

      if (walker.x > width) walker.x = 0;
      if (walker.x < 0) walker.x = width;
      if (walker.y > height) walker.y = 0;
      if (walker.y < 0) walker.y = height;

      walker.steps++;
    }
  }
  if (CLIP_CONTENT) drawClipCircle();
}

function setWalker(i) {
  let x = CLIP_CONTENT
    ? random(width / 2 - CLIP_RADIUS, width / 2 + CLIP_RADIUS)
    : random(0, width);
  let y = CLIP_CONTENT
    ? random(height / 2 - CLIP_RADIUS, height / 2 + CLIP_RADIUS)
    : random(0, height);

  ACTIVE_WALKERS[i] = {
    x: x,
    y: y,
    steps: 0,
    step_cap: random(MIN_STEPS, MAX_STEPS),
    color: selectWalkerColor(x, y),
  };
}

function drawClipCircle() {
  const CLIP_STROKE = width + CLIP_RADIUS * 2;
  noFill();
  stroke(BG);
  strokeWeight(CLIP_STROKE);
  circle(width / 2, height / 2, CLIP_STROKE + CLIP_RADIUS * 2);
  strokeWeight(STROKE_WEIGHT);
}

function selectWalkerColor(x, y) {
  if (ERASERS_ENABLED && random() < ERASER_SPAWN_CHANCE) {
    return BG;
  }
  if (NOISED_STROKE) {
    const colorNoise = noise(x * STROKE_NOISE_ZOOM, y * STROKE_NOISE_ZOOM);
    const maxIndex = COLORS.length - 1;
    let noisedIndex = round(colorNoise * maxIndex);

    if (noisedIndex > maxIndex) {
      noisedIndex = maxIndex;
    }
    return COLORS[noisedIndex];
  } else {
    return random(COLORS);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function clickOnSave() {
  saveCanvas();
}
