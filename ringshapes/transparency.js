let PALETTES, COLORS, BG, STROKE;

const EXPORT = false;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const OPACITY = 1;

const COUNT = 10;
const ANGLE_STEP = 0.005;
const MAX_RADIUS = 500;

let RINGS = [];

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  if (EXPORT) frameRate(5);

  const cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = color(PALETTE.bg);
  STROKE = random(COLORS);
  stroke(STROKE);
  background(BG);

  strokeWeight(STROKE_WEIGHT);
  const FILL = random(BG);
  FILL.setAlpha(0.05);
  fill(FILL);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;

  for (let i = 0; i < COUNT; i++) {
    RINGS.push({
      a: 0,
      r: ((i + 1) * MAX_RADIUS) / COUNT,
    });
  }
}

function draw() {
  translate(width / 2, height / 2);
  rotate(-HALF_PI);
  beginShape();
  for (let i = 0; i < RINGS.length; i++) {
    const ring = RINGS[i];
    const x = ring.r * cos(ring.a);
    const y = ring.r * sin(ring.a);
    vertex(x, y);
    ring.a += i * ANGLE_STEP;
  }
  endShape();
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  //saveCanvas();
}
