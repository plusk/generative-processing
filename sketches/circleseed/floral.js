let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "retro"; // retro

const STROKE_WEIGHT = 2;
const RING_COUNT = 50;
const ANGLE_STEP = 2.25;
const RADIUS_MIN = 25;
const RADIUS = 100;
const NOISE_DETAIL = 0.015;
const LINE_FACTOR = 2;

const FRAME_LIMIT = 180;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

const STEP = STROKE_WEIGHT;
const RINGS = [];

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);

  background(BG);
  fill(BG);
  strokeWeight(STROKE_WEIGHT);

  colorMode(HSL);
  drawingContext.shadowBlur = STROKE_WEIGHT;

  for (let r = 0; r < RING_COUNT; r++) {
    const RING = [];
    const xCenter = random(width);
    const yCenter = random(RADIUS / 2, height);
    const coleur = color(COLORS[r % COLORS.length]);
    const raddy = random(RADIUS_MIN, RADIUS);
    for (
      let a = TWO_PI / (raddy * LINE_FACTOR);
      a < TWO_PI;
      a += TWO_PI / (raddy * LINE_FACTOR)
    ) {
      const x = xCenter + random(raddy / 4, raddy) * cos(a);
      const y = yCenter + random(raddy / 4, raddy) * sin(a);
      RING.push({
        x,
        y,
        a,
        color: coleur,
        step: random(STEP * 0.75, STEP * 1.25),
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
      (LIGHTNESS / FRAME_LIMIT) * frameCount
    );
    stroke(coleur);
    //drawingContext.shadowColor = coleur;

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
  const angle = LINE.a * noyzed * ANGLE_STEP;

  const x = LINE.x + LINE.step * cos(HALF_PI + angle);
  const y = LINE.y + LINE.step * sin(HALF_PI + angle);
  line(LINE.x, LINE.y, x, y);
  LINE.x = x;
  LINE.y = y;
  LINE.a = angle;
}

function clickOnSave() {
  saveCanvas();
}
