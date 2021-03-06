let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "mono";

const STROKE_WEIGHT = 2;
const RING_COUNT = 10;
const LINE_COUNT = 1000;
const STEP = 5;
const ANGLE_STEP = 0.1;
const RADIUS = 100;
const NOISE_DETAIL = 0.005;

const OPACITY = 63;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

const RINGS = [];

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  background(BG);
  fill(BG);
  //STROKE.setAlpha(15);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);

  for (let r = 0; r < RING_COUNT; r++) {
    const RING = [];
    const xCenter = random(width);
    const yCenter = random(height);
    const collie = color(COLORS[r % COLORS.length]);
    collie.setAlpha(OPACITY);
    for (let a = 0; a < TWO_PI; a += TWO_PI / LINE_COUNT) {
      const x = xCenter + RADIUS * cos(a);
      const y = yCenter + RADIUS * sin(a);
      RING.push({
        x,
        y,
        color: collie,
      });
    }
    RINGS.push(RING);
  }
}

function draw() {
  for (let r = 0; r < RINGS.length; r++) {
    const RING = RINGS[r];
    stroke(RING[0].color);
    for (let l = 0; l < RING.length; l++) {
      const LINE = RING[l];
      drawLine(LINE);
    }
  }
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function drawLine(LINE) {
  const noyze = noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
  const x = LINE.x + STEP * cos(TWO_PI * noyze);
  const y = LINE.y + STEP * sin(TWO_PI * noyze);
  line(LINE.x, LINE.y, x, y);
  LINE.x = x;
  LINE.y = y;
}

function clickOnSave() {
  //saveCanvas();
}
