let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 2;
const LINE_COUNT = 100;
const STEP = STROKE_WEIGHT * 2;
const RADIUS = 50;
const REPETITIONS = 50;
const NOISE_DETAIL = 0.00375;
const NOISE_EVO = 0.01;

const OPACITY = 255;
const BG_OPACITY = 5;

const LOD = 2;
const FALLBACK = 0.5;

let SATURATION;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

const RING = [];

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  colorMode(HSL);

  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  HUE = hue(STROKE);
  SATURATION = saturation(STROKE);
  LIGHTNESS = lightness(STROKE);

  background(BG);
  fill(BG);
  STROKE.setAlpha(OPACITY);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);

  const xCenter = width / 2;
  const yCenter = height / 2;
  const angle = HALF_PI;
  for (let a = 0; a < TWO_PI; a += TWO_PI / LINE_COUNT) {
    const x = xCenter + RADIUS * cos(a);
    const y = yCenter + RADIUS * sin(a);
    RING.push({
      x,
      y,
      a,
      angle,
    });
  }
  noiseDetail(LOD, FALLBACK);
}

function draw() {
  resetDraw();
  for (let i = 0; i < REPETITIONS; i++) {
    stroke(HUE, (SATURATION / REPETITIONS) * i, LIGHTNESS);
    beginShape();
    for (let l = 0; l < RING.length; l++) {
      const LINE = RING[l];
      drawLine(LINE);
    }
    endShape(CLOSE);
  }
}

function resetDraw() {
  BG.setAlpha(255);
  background(BG);
  BG.setAlpha(BG_OPACITY);
  fill(BG);
  translate(width / 2, height / 2);
  for (let i = 0; i < RING.length; i++) {
    const LINE = RING[i];
    LINE.x = RADIUS * cos(LINE.a);
    LINE.y = RADIUS * sin(LINE.a);
  }
}

function drawLine(LINE) {
  const noyze =
    noise(
      LINE.x * NOISE_DETAIL,
      LINE.y * NOISE_DETAIL,
      frameCount * NOISE_EVO
    ) - 0.5;
  const x = LINE.x + STEP * cos(LINE.angle + TWO_PI * noyze);
  const y = LINE.y + STEP * sin(LINE.angle + TWO_PI * noyze);
  //line(LINE.x, LINE.y, x, y);
  vertex(x, y);
  LINE.x = x;
  LINE.y = y;
}

function clickOnSave() {
  //saveCanvas();
}
