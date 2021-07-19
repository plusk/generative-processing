let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "genesis";

const STROKE_WEIGHT = 2;
const RING_COUNT = 1;
const LINE_COUNT = 1000;
const STEP = 4;
const ANGLE_STEP = 2;
const RADIUS = 250;
const NOISE_DETAIL = 0.0075;

const FRAME_LIMIT = 60;

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
  STROKE.setAlpha(15);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);
  colorMode(HSL);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);

  for (let r = 0; r < RING_COUNT; r++) {
    const RING = [];
    const xCenter = width / 2;
    const yCenter = width / 2;
    for (let a = 0; a < TWO_PI; a += TWO_PI / LINE_COUNT) {
      const x = xCenter + RADIUS * cos(a);
      const y = yCenter + RADIUS * sin(a);
      RING.push({
        x,
        y,
        a,
        color: random(COLORS),
      });
    }
    RINGS.push(RING);
  }
}

function draw() {
  for (let r = 0; r < RINGS.length; r++) {
    const RING = RINGS[r];
    const HUE = hue(RING[0].color);
    const SATURATION = saturation(RING[0].color);
    const LIGHTNESS = lightness(RING[0].color);
    const coleur = color(
      HUE,
      (SATURATION / FRAME_LIMIT) * frameCount,
      (LIGHTNESS / FRAME_LIMIT) * frameCount,
      (5 / FRAME_LIMIT) * frameCount
    );
    stroke(coleur);
    for (let l = 0; l < RING.length; l++) {
      const LINE = RING[l];
      drawLine(LINE);
    }
  }
  if (frameCount > FRAME_LIMIT) {
    noLoop();
  }
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function drawLine(LINE) {
  const noyzed = noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
  const angle = LINE.a * noyzed * ANGLE_STEP;
  const x = LINE.x + STEP * cos(angle + HALF_PI);
  const y = LINE.y + STEP * sin(angle + HALF_PI);
  line(LINE.x, LINE.y, x, y);
  LINE.x = x;
  LINE.y = y;
  LINE.a = angle;
}

function clickOnSave() {
  saveCanvas();
}
