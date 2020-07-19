let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const COUNT_X = 50;
const COUNT_Y = 50;

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
  const xEnd = random(width);
  const yEnd = random(height);
  const xAnchor0 = random(width);
  const yAnchor0 = random(height);
  const xAnchor1 = random(width);
  const yAnchor1 = random(height);
  for (let x = 0; x <= width; x += width / COUNT_X) {
    for (let y = 0; y <= height; y += height / COUNT_Y) {
      bezier(xEnd, yEnd, xAnchor0, yAnchor0, xAnchor1, yAnchor1, x, y);
    }
  }
  noLoop();
}

function clickOnSave() {
  //saveCanvas();
}
