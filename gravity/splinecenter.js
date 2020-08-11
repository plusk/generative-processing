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
const COUNT = 5000;
const VERTICES = 10;
const SPAWN_RADIUS = 200;
const CENTER_RADIUS = 250;
const MAX_VELOCITY = 7.5;
const ACCELERATION = 0.2;
const TIMEWALK = 0.01;

let center;
const particles = [];
const vertices = [];
const path = [];

let walkindex = 0;

class Particle {
  constructor(x, y, i) {
    this.location = createVector(x, y);
    this.velocity = createVector(center.x, center.y);
    this.color = COLORS[i % COLORS.length];
    this.accfactor = random(0.5, 1);
  }

  update() {
    const direction = p5.Vector.sub(center, this.location);
    if (direction.mag() < CENTER_SIZE / 2) {
      const r = random(CENTER_SIZE / 4);
      const a = random(TWO_PI);
      this.location = createVector(r * cos(a), r * sin(a));
      line(center.x, center.y, 0, 0);
      this.velocity = createVector(-center.x, -center.y);
    } else {
      direction.normalize();
      direction.mult(ACCELERATION ** 0.75 * this.accfactor);
      this.velocity.add(direction);
      this.velocity.limit(MAX_VELOCITY);
      this.location.add(this.velocity);
    }
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

  for (let i = 0; i < VERTICES; i++) {
    vertices.push(
      createVector(
        random(-width / 4, width / 4),
        random(-height / 4, height / 4)
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
  strokeWeight(STROKE_WEIGHT);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    stroke(p.color);
    point(p.location.x, p.location.y);
    p.update();
  }
  updateCenter();
  drawCenter();
  if (walkindex >= path.length) noLoop();
}

function drawCenter() {
  strokeWeight(CENTER_SIZE);
  stroke(0, 0, 100);
  point(center.x, center.y);
  point(0, 0);
}

function updateCenter() {
  center.x = path[walkindex].x;
  center.y = path[walkindex].y;
  walkindex++;
}

function clickOnSave() {
  //saveCanvas();
}
