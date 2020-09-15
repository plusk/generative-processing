let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "symmeblu";

const STROKE_WEIGHT = 2;
const ANGLE_STEP = 0.1;
const ANGLE_AMP = 5;
const RADIUS_STEP = 2;
const RADIUS_AMP = 0.01;
const MIN_RADIUS = 100;
const MAX_RADIUS = 1080; //1080 * 0.75
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
      stroke: random(COLORS),
      weight: random(STROKE_WEIGHT * 0.5, STROKE_WEIGHT * 4),
    });
  }
  //circle(0, 0, 200);
}

function draw() {
  background(BG);
  translate(width / 2, height / 2);

  for (let p = 0; p < POINTS.length; p++) {
    const poi = POINTS[p];
    stroke(poi.stroke);
    const x = poi.radius * cos(poi.angle);
    const y = poi.radius * sin(poi.angle);
    if (poi.radius <= MIN_RADIUS) {
      poi.radius = MAX_RADIUS;
      strokeWeight(poi.weight);
    } else {
      const factor = (MAX_RADIUS + MIN_RADIUS - poi.radius) / MAX_RADIUS;
      poi.angle += ANGLE_STEP * factor ** ANGLE_AMP;
      poi.radius -= RADIUS_STEP * factor ** RADIUS_AMP;
      strokeWeight(STROKE_WEIGHT / 2 + poi.weight * factor ** 5);
      const xNew = poi.radius * cos(poi.angle);
      const yNew = poi.radius * sin(poi.angle);
      line(x, y, xNew, yNew);
    }
  }
  //circle(0, 0, MIN_RADIUS * 2);
}

function clickOnSave() {
  saveCanvas();
}
