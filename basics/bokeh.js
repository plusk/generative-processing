let PALETTES, COLORS, STROKE, BACKGROUNDS, BG;

const EXPORT = false;

const PALETTE_NAME = "speis";

const STROKE_WEIGHT = 2;

const MIN_OPACITY = 0.1;
const MAX_OPACITY = 1;

const MIN_SIZE = 1;
const MAX_SIZE = 100;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  if (EXPORT) frameRate(4);
  if (EXPORT) pixelDensity(1);

  const cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BACKGROUNDS = PALETTE["bg"].map((col) => color(col));

  STROKE = random(COLORS);
  BG = random(BACKGROUNDS);

  background(BG);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

function draw() {
  const pointSize = random(MIN_SIZE, MAX_SIZE);
  strokeWeight(pointSize);

  const pointColor = random(COLORS);
  pointColor.setAlpha(1 + MIN_OPACITY - pointSize / MAX_SIZE);
  stroke(pointColor);

  point(random(width), random(height));
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  saveCanvas();
}
