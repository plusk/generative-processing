let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 4;
const BALL_WEIGHT = 20;
const COUNT = 10;
const RADIUS = 250;

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
}

let ticker = 0;

function draw() {
  ticker++;
  translate(width / 2, height / 2);
  beginShape(TRIANGLE_STRIP);
  for (let a = 0; a < 360; a++) {
    strokeWeight(STROKE_WEIGHT);
    const x = RADIUS * cos(a);
    const y = RADIUS * sin(a);
    stroke(a, 75, 75);
    vertex(x, y);
  }
  endShape(CLOSE);
  for (let b = 0; b < COUNT; b++) {
    const angle = (b * 360) / COUNT;
    const radius = 50;
    const x = radius * cos(angle);
    const y = radius * sin(angle);
    strokeWeight(BALL_WEIGHT);
    point(x, y);
  }
}

function clickOnSave() {
  //saveCanvas();
}
