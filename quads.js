let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const OPACITY = 1;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

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

  background(BG);
  BG.setAlpha(0.5);
  fill(BG);
  STROKE.setAlpha(1);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

const ANGLE = 0.1;
const RADDY = 1;
let r = 0;
let a = -Math.PI / 2;

function draw() {
  translate(width / 2, height / 2);
  binarize(frameCount);
  r += RADDY;
  a += ANGLE;
}

function binarize(numb) {
  beginShape(QUAD_STRIP);
  for (let i = 0; i < numb; i++) {
    const x = (RADDY * i + r) * cos(ANGLE * i + a);
    const y = (RADDY * i + r) * sin(ANGLE * i + a);
    vertex(x, y);
  }
  endShape(CLOSE);
}

function clickOnSave() {
  //saveCanvas();
}
