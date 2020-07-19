let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "mono";

const STROKE_WEIGHT = 1;
const COUNT = 100;
const RADIUS = 1080 / 4;

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  // const keys = Object.keys(palettes);
  // palette = palettes[keys[(keys.length * Math.random()) << 0]];
  COLOR_PALETTE = palette["colors"];
  COLOR_BG = color(palette["bg"]);
  COLOR_STROKE = color(random(COLOR_PALETTE));

  background(COLOR_BG);
  fill(COLOR_BG);
  noFill();
  COLOR_STROKE.setAlpha(63);
  stroke(COLOR_STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLOR_PALETTE);
}

function draw() {
  translate(width / 2, height / 2);
  const xEnd = random(-width / 4, width / 4);
  const yEnd = random(-height / 4, height / 4);
  const xAnchor0 = random(-width / 2, width / 2);
  const yAnchor0 = random(-height / 2, height / 2);
  const xAnchor1 = random(-width / 2, width / 2);
  const yAnchor1 = random(-height / 2, height / 2);

  for (let a = 0; a < TWO_PI; a += TWO_PI / COUNT) {
    const xStart = RADIUS * cos(a);
    const yStart = RADIUS * sin(a);

    bezier(xStart, yStart, xAnchor0, yAnchor0, xAnchor1, yAnchor1, xEnd, yEnd);
  }

  noLoop();
}

function clickOnSave() {
  //saveCanvas();
}
