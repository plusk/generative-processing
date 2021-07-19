let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "mono";

const STROKE_WEIGHT = 2;
const MIN_RADIUS = 100;
const MAX_RADIUS = 1080 * 0.5; //1080 * 0.75
const COUNT = 10000;

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
  //STROKE.setAlpha(5);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);
  translate(width / 2, height / 2);
  for (let a = 0; a < TWO_PI; a += TWO_PI / COUNT) {
    const randy = random(MIN_RADIUS, MAX_RADIUS);
    const x = randy * cos(a);
    const y = randy * sin(a);
    POINTS.push({
      radius: randy,
      angle: a,
    });
  }
  //circle(0, 0, 200);
}

function draw() {
  background(BG);
  translate(width / 2, height / 2);
  for (let p = 0; p < POINTS.length; p++) {
    const poi = POINTS[p];
    const x = poi.radius * cos(poi.angle);
    const y = poi.radius * sin(poi.angle);
    point(x, y);
    if (poi.radius <= MIN_RADIUS) {
      poi.radius = MAX_RADIUS;
    } else {
      poi.radius -=
        MIN_RADIUS * Math.exp((-1 / MIN_RADIUS) * (poi.radius - MIN_RADIUS));
    }
  }
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function clickOnSave() {
  //saveCanvas();
}
