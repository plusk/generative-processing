let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 1;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
const SPREAD = 14;
const OPACITY = 0.25;

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
  STROKE = color(random(COLORS));

  background(BG);
  fill(BG);
  STROKE.setAlpha(OPACITY);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);
}

let x0;
let y0;

let TICK_RATE = 100;
let ticker = 0;
const FRAME_LIMIT = 300;

function draw() {
  //saveCanvas();

  translate(width / 2, height / 2);
  for (let i = 0; i < TICK_RATE; i++) {
    const a = ANGLE * ticker;
    const r = SPREAD * sqrt(ticker);
    const x1 = r * cos(a);
    const y1 = r * sin(a);
    //circle(x1, y1, 10);
    if (ticker != 0) {
      line(x0, y0, x1, y1);
    }
    x0 = x1;
    y0 = y1;
    ticker++;
  }

  if (frameCount >= FRAME_LIMIT) {
    console.log(frameCount);
    noLoop();
  }

  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  saveCanvas();
}
