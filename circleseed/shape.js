let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 2;
const RING_COUNT = 5;
const LINE_COUNT = 1000;
const STEP = 4;
const RADIUS = 150;
const NOISE_DETAIL = 0.005;

const OPACITY = 255;

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
  BG.setAlpha(15);
  fill(BG);
  //STROKE.setAlpha(15);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);

  for (let r = 0; r < RING_COUNT; r++) {
    const RING = [];
    const xCenter = random(width);
    const yCenter = random(height / 2);
    const collie = color(COLORS[r % COLORS.length]);
    collie.setAlpha(OPACITY);
    const angle = random(QUARTER_PI, TWO_PI - QUARTER_PI);
    for (let a = 0; a < TWO_PI; a += TWO_PI / LINE_COUNT) {
      const x = xCenter + RADIUS * cos(a);
      const y = yCenter + RADIUS * sin(a);
      RING.push({
        x,
        y,
        angle,
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
    beginShape();
    for (let l = 0; l < RING.length; l++) {
      const LINE = RING[l];
      drawLine(LINE);
    }
    endShape(CLOSE);
  }
}

function drawLine(LINE) {
  const noyze = noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
  const x = LINE.x + STEP * cos(LINE.angle * noyze);
  const y = LINE.y + STEP * sin(LINE.angle * noyze);
  //line(LINE.x, LINE.y, x, y);
  vertex(x, y);
  LINE.x = x;
  LINE.y = y;
}

function clickOnSave() {
  //saveCanvas();
}
