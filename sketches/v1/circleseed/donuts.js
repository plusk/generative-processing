let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "genesis"; // retro, warm, sydney, symmeblu, termos, vintage, pastella

const STROKE_WEIGHT = 2;
const RING_COUNT = 10;
const LINE_COUNT = 200;
const STEP = 4;
const ANGLE_STEP = 0.1;
const RADIUS = 100;
const NOISE_DETAIL = 0.005;

const FRAME_LIMIT = 90;

const LOD = 4;
const FALL = 0.5;

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
  STROKE = color(COLORS[0]);

  background(BG);
  fill(BG);
  STROKE.setAlpha(127);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  colorMode(HSL);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);

  for (let r = 0; r < RING_COUNT; r++) {
    const RING = [];
    const xCenter = random(RADIUS, width - RADIUS);
    const yCenter = random(height);
    const coleur = color(COLORS[r % COLORS.length]);
    for (let a = 0; a < TWO_PI; a += TWO_PI / LINE_COUNT) {
      const x = xCenter + RADIUS * cos(a);
      const y = yCenter + RADIUS * sin(a);
      RING.push({
        x,
        y,
        a,
        color: coleur,
      });
    }
    RINGS.push(RING);
  }
  noiseDetail(LOD, FALL);
}

function draw() {
  for (let r = 0; r < RINGS.length; r++) {
    const RING = RINGS[r];
    const HUE = hue(RING[0].color);
    const SATURATION = saturation(RING[0].color);
    const LIGHTNESS = lightness(RING[0].color);
    stroke(HUE, (SATURATION / FRAME_LIMIT) * frameCount, (LIGHTNESS / FRAME_LIMIT) * frameCount);
    for (let l = 0; l < RING.length; l++) {
      const LINE = RING[l];
      drawLine(LINE);
    }
  }
  if (frameCount > FRAME_LIMIT) {
    noLoop();
  }
}

function drawLine(LINE) {
  const noyzed = noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
  const angle = LINE.a + noyzed * ANGLE_STEP;
  const x = LINE.x + STEP * cos(angle);
  const y = LINE.y + STEP * sin(angle);
  line(LINE.x, LINE.y, x, y);
  LINE.x = x;
  LINE.y = y;
  LINE.a = angle;
}

function clickOnSave() {
  //saveCanvas();
}
