let PALETTES, COLORS, BG, STROKE;

const EXPORT = false;

const PALETTE_NAME = "genesis";

const STROKE_WEIGHT = 2;

const COUNT = 25;
const OPACITY = 0.075;
const ANGLE_STEP = 0.005;
const MAX_RADIUS = (1080 / 4) * 3;

const FRAME_START = (Math.PI / ANGLE_STEP) * 2 - 1;
const FRAME_END = (Math.PI / ANGLE_STEP) * 4;

let RINGS = [];

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  if (EXPORT) frameRate(4);
  pixelDensity(1);

  const cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = color(PALETTE.bg);
  STROKE = random(COLORS);

  strokeWeight(STROKE_WEIGHT);

  stroke(STROKE);
  background(BG);
  BG.setAlpha(OPACITY);

  fill(BG);

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
  rotate(HALF_PI);
  beginShape();
  for (let i = 0; i < RINGS.length; i++) {
    const ring = RINGS[i];
    const x = ring.r * cos(ring.a);
    const y = ring.r * sin(ring.a);
    strokeWeight(STROKE_WEIGHT * 5);
    point(x, y);
    strokeWeight(STROKE_WEIGHT);
    vertex(x, y);
    ring.a += i * ANGLE_STEP;
  }
  endShape();

  if (EXPORT) {
    if (frameCount > FRAME_START && frameCount <= FRAME_END) {
      saveCanvas();
    }
    if (frameCount > FRAME_END) {
      noLoop();
    }
  }
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  saveCanvas();
}
