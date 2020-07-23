let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "termos";

const STROKE_WEIGHT = 2;
const COUNT = 2000;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080, WEBGL); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  background(BG);
  fill(BG);
  noFill();
  //STROKE.setAlpha(5);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);
  rectMode(CENTER);
}

function draw() {
  translate(0, 0, -1000);
  for (let i = 0; i < COUNT; i++) {
    rect(0, 0, 100, 100);
    translate(0, 0, (1000 / COUNT) * i);
    rotateZ((TWO_PI / COUNT) * (i - 1));
  }
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  //saveCanvas();
}
