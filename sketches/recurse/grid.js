let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "symmeblu"; // redrange, redcent, symmeblu, termos, vintage

const STROKE_WEIGHT = 8;
const MAX_DEPTH = 4;
const PADDING = 200;

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
  strokeWeight(STROKE_WEIGHT);
  stroke(colors_bg);
  rectMode(CENTER);
  frameRate(1);
}

let frame = 0;

function draw() {
  frame++;
  background(colors_bg);
  translate(width / 2, height / 2);
  drawSquare(0, 0, width - PADDING * 2);
}

function drawSquare(x, y, radius) {
  fill(random(colors));
  //stroke(random(colors));

  if (random() > 0.75) {
    //vertex(x, y);
    rect(x, y, radius);
    //circle(x, y, radius);
  }
  if (radius > STROKE_WEIGHT * 4) {
    if (random() > 0.25) drawSquare(x - radius / 4, y - radius / 4, radius / 2);
    if (random() > 0.25) drawSquare(x + radius / 4, y - radius / 4, radius / 2);
    if (random() > 0.25) drawSquare(x - radius / 4, y + radius / 4, radius / 2);
    if (random() > 0.25) drawSquare(x + radius / 4, y + radius / 4, radius / 2);
  }
}

function clickOnSave() {
  //saveCanvas();
}
