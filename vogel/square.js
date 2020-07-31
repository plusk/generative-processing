let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "redcent"; // retro

const STROKE_WEIGHT = 1;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
let SPREAD = 75;
const OPACITY = 1;

const NUCOLOR = [];

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
  noFill();
  strokeWeight(STROKE_WEIGHT);
  rectMode(CENTER);

  for (let c = 0; c < COLORS.length; c++) {
    const coleur = color(COLORS[c]);
    coleur.setAlpha(OPACITY);
    NUCOLOR.push(coleur);
  }
}

let x0 = 0;
let y0 = 0;

let TICK_RATE = 0.0225;
let ticker = 0;
const FRAME_LIMIT = 300;

let coleur;

function draw() {
  translate(width / 2, height / 2);
  rotate(ANGLE * 0.825);
  for (let i = 0; i < TICK_RATE; i++) {
    TICK_RATE += 0.0225;
    const a = ANGLE * ticker;
    const r = SPREAD * sqrt(ticker);
    const x1 = r * cos(a);
    const y1 = r * sin(a);
    //circle(x1, y1, 10);
    //line(x0, y0, x1, y1);
    coleur = random(NUCOLOR);
    stroke(
      hue(coleur),
      saturation(coleur),
      (lightness(coleur) / FRAME_LIMIT) * frameCount
    );
    const xdiff = abs(x0 - x1);
    const ydiff = abs(y0 - y1);
    let meh = 0;
    if (xdiff > ydiff) meh = xdiff;
    else meh = ydiff;
    circle(x0, y0, meh);
    x0 = x1;
    y0 = y1;
    ticker++;
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
