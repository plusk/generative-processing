let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "genesis"; // retro

const STROKE_WEIGHT = 1;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
const SPREAD = 15;
const OPACITY = 0.5;
const MIN_LIGHTNESS = 0.15;

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

let TICK_RATE = 1;
let ticker = 0;
const FRAME_LIMIT = 300;

function draw() {
  translate(width / 2, height / 2);
  TICK_RATE += 0.075;
  for (let i = 0; i < TICK_RATE; i++) {
    stroke(
      hue(STROKE),
      saturation(STROKE),
      (lightness(STROKE) / FRAME_LIMIT) * (FRAME_LIMIT * (1 + MIN_LIGHTNESS) - frameCount),
      OPACITY
    );
    const a = ANGLE * ticker;
    rotate(a);
    const r = SPREAD * sqrt(ticker);
    const x1 = r * cos(a);
    const y1 = r * sin(a);
    if (ticker > 1) {
      line(x0, y0, x1, y1);
    }
    x0 = x1;
    y0 = y1;
    ticker++;
  }
  //saveCanvas();
  if (frameCount > FRAME_LIMIT) {
    noLoop();
  }

  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  saveCanvas();
}
