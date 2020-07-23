let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "retro";

const STROKE_WEIGHT = 1;
const COUNT = 50;
const RADIUS = 400;

const POINTS = [];

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  background(BG);
  fill(BG);
  STROKE.setAlpha(63);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);
  translate(width / 2, height / 2);
  rotate(-HALF_PI);
  circle(0, 0, RADIUS * 2);
  strokeWeight(STROKE_WEIGHT * 5);
  for (let a = 0; a < TWO_PI; a += TWO_PI / COUNT) {
    const x = RADIUS * cos(a);
    const y = RADIUS * sin(a);
    POINTS.push({
      x,
      y,
    });
    //point(x, y);
  }
  strokeWeight(STROKE_WEIGHT);
  colorMode(HSL);
}

function draw() {
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  background(BG);
  translate(width / 2, height / 2);
  rotate(-HALF_PI);
  for (let p = 0; p < POINTS.length; p++) {
    const point = POINTS[p];
    for (let op = 0; op < POINTS.length; op++) {
      stroke(color((360 / COUNT) * op, 75, 75));
      const otherpoint = POINTS[op];
      line(point.x, point.y, otherpoint.x, otherpoint.y);
    }
  }
}

function clickOnSave() {
  //saveCanvas();
}
