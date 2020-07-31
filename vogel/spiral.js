let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "retro"; // retro

const STROKE_WEIGHT = 10;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
const SPREAD = 10;
const MIN_LIGHTNESS = 0.15;
const OPACITY = 1;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  frameRate(30);

  colorMode(HSL);
  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);

  background(BG);
  fill(BG);
  //noFill();
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);
}

let x0;
let y0;

let TICK_RATE = 50;
let ticker = 7000;
const FRAME_LIMIT = 300;

function draw() {
  translate(width / 2, height / 2);
  rotate(ANGLE);
  TICK_RATE *= 0.9939;
  for (let i = 0; i < TICK_RATE; i++) {
    const coleur = color(COLORS[round(ticker) % COLORS.length]);
    stroke(coleur);
    const a = ANGLE * ticker;
    const r = SPREAD * sqrt(ticker);
    const x1 = r * cos(a);
    const y1 = r * sin(a);
    strokeWeight(STROKE_WEIGHT + 0.005 * ticker ** 1.1);
    //circle(x1, y1, 10);
    point(x0, y0);
    x0 = x1;
    y0 = y1;
    if (ticker > 1) ticker--;
  }
  //saveCanvas();
  if (frameCount > FRAME_LIMIT) {
    console.log("donezo");
    noLoop();
  }
}

function clickOnSave() {
  saveCanvas();
}
