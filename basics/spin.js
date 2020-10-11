let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 7.5;
const RING_COUNT = 10;
const BALL_COUNT = 20;
const RADIUS = 400;
const SPEED = 1;

// const ANGLE_STEP = 1;

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  // const keys = Object.keys(palettes);
  // palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  background(colors_bg);
  noFill();
  colorMode(HSL);
  angleMode(DEGREES);
  strokeWeight(STROKE_WEIGHT);
}

let ticker = 0;

function draw() {
  ticker++;
  translate(width / 2, height / 2);
  background(colors_bg);

  for (let r = 1; r <= RING_COUNT; r++) {
    for (let b = 1; b <= BALL_COUNT; b++) {
      strokeWeight(STROKE_WEIGHT * r ** 0.5);
      stroke((360 / BALL_COUNT) * b, 75, 75);
      const a = ((b / r ** 0.5) * SPEED * ticker) % 360;
      const x = (RADIUS / RING_COUNT) * r * cos(a);
      const y = (RADIUS / RING_COUNT) * r * sin(a);
      point(x, y);
      //strokeWeight(2);
      //circle(x, y, 200);
    }
  }
}

function clickOnSave() {
  //saveCanvas();
}
