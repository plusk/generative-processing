let PALETTES, COLORS, STROKE, BG;

const EXPORT = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "termos";

const STROKE_WEIGHT = 10;
const OPACITY = 1;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  const cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  if (EXPORT) pixelDensity(1);
  if (EXPORT) frameRate(4);

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

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

function draw() {
  circle(width / 2, height / 2, 200);
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  saveCanvas();
}
