let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const EXPORT = false;

const PALETTE_NAME = "mello";

const STROKE_WEIGHT = 2;
const OPACITY = 1;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  if (EXPORT) frameRate(5);
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  PALETTE = PALETTES[PALETTE_NAME];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  background(BG);
  fill(BG);
  STROKE.setAlpha(OPACITY);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;

  drawBackground();
  drawSun();
}

function drawBackground() {
  const c1 = color("#FFB88D");
  const c2 = color("#FF5B5B");
  for (var y = 0; y < height; y++) {
    const inter = y / height;
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawSun() {
  const x = random(0, width);
  const y = random(0, height / 4);
  const c3 = color("#FFF2AD");
}

function draw() {
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  //saveCanvas();
}
