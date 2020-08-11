let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const processing = new p5();

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 1;
const CENTER_SIZE = STROKE_WEIGHT * 20;
const OPACITY = 0.5;
const COUNT = 7500;
const VERTICES = 100;
const SPAWN_RADIUS = 500;
const CENTER_RADIUS = 250;
const MAX_VELOCITY = 7.5;
const ACCELERATION = 0.2;
const TIMEWALK = 0.02;

let center;
const particles = [];
const vertices = [];
const path = [];

let walkindex = 0;

class Particle {
  constructor(x, y, i) {
    this.location = createVector(x, y);
    this.velocity = createVector(center.x, center.y);
    this.color = color(COLORS[i % COLORS.length]);
    this.accfactor = random(0.5, 1.5);
  }

  update() {
    const direction = p5.Vector.sub(center, this.location);
    direction.normalize();
    direction.mult(ACCELERATION ** 0.75 * this.accfactor);
    this.velocity.add(direction);
    this.velocity.limit(MAX_VELOCITY);
    this.location.add(this.velocity);
  }
}

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  background(BG);
  fill(BG);
  BG.setAlpha(1);
  STROKE.setAlpha(OPACITY);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;

  vertices.push(createVector(0, height / 2));
  vertices.push(createVector(0, height / 2));
  for (let i = 0; i < VERTICES; i++) {
    vertices.push(
      createVector(
        random(-width / 5, width / 5),
        random(-height / 5, height / 5)
      )
    );
  }

  for (let i = 0; i < vertices.length - 3; i++) {
    const a = vertices[i];
    const b = vertices[i + 1];
    const c = vertices[i + 2];
    const d = vertices[i + 3];
    for (let bla = 0; bla < 1; bla += 1 * TIMEWALK) {
      const x = curvePoint(a.x, b.x, c.x, d.x, bla);
      const y = curvePoint(a.y, b.y, c.y, d.y, bla);
      path.push(createVector(x, y));
    }
  }
  center = path[0];

  for (let i = 0; i < COUNT; i++) {
    const a = (i * TWO_PI) / COUNT;
    const randy = random(SPAWN_RADIUS);
    const x = randy * cos(a);
    const y = randy * sin(a);
    particles.push(new Particle(x, y, i));
  }
  frameRate(30);
}

function draw() {
  background(BG);
  translate(width / 2, height / 2);
  /*

  strokeWeight(STROKE_WEIGHT * 0.5);
  beginShape();
  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    curveVertex(v.x, v.y);
  }
  endShape();

  for (let i = 0; i < path.length; i++) {
    strokeWeight(STROKE_WEIGHT * 5);
    point(path[i].x, path[i].y);
    strokeWeight(STROKE_WEIGHT);
  }
*/
  updateCenter();
  drawCenter();
  strokeWeight(STROKE_WEIGHT);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    stroke(p.color);
    point(p.location.x, p.location.y);
    p.update();
  }

  if (walkindex >= path.length) noLoop();
}

function drawCenter() {
  strokeWeight(CENTER_SIZE);
  stroke(0, 0, 100);
  point(center.x, center.y);
}

function updateCenter() {
  center.x = path[walkindex].x;
  center.y = path[walkindex].y;
  walkindex++;
}

function clickOnSave() {
  //saveCanvas();
}
