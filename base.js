let PALETTES, COLORS, STROKE, BACKGROUNDS, BG;

const EXPORT = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const OPACITY = 1;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  if (EXPORT) frameRate(4);
  if (EXPORT) pixelDensity(1);

  const cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE_KEYS = Object.keys(PALETTES);
  const PALETTE = !RANDOM_PALETTE
    ? PALETTES[PALETTE_NAME]
    : PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BACKGROUNDS = color(PALETTE.bg);

  STROKE = random(COLORS);
  BG = random(BACKGROUNDS);

  STROKE.setAlpha(OPACITY);

  background(BG);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

function draw() {
  circle(width / 2, height / 2, 100);
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  //saveCanvas();
}
