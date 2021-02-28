let PALETTES, COLORS, STROKE, BG;

const EXPORT = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "termos";

const STROKE_WEIGHT = 1;
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

  rectMode(CENTER);
  stroke("white");

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

const COUNT = 100;

function draw() {
  translate(width / 2, height / 2);
  const angie = frameCount * TWO_PI / - 50000; 
  rotate(angie)
  background(BG)
  fill("white")
  rect(0, 0, 80);

  const collie = color(
    hue(BG),
    saturation(BG),
    lightness(BG),
    0.001
  )
  fill(collie)
  rect(0, 0, 100);

  for (let i = 1; i < COUNT; i++) {
    const a = TWO_PI / COUNT;
    rotate(a + angie)
    rect(0, 0, 100 + (height*1.5) / COUNT * i);
  }
  
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  saveCanvas();
}
