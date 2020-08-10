let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const processing = new p5();

const PALETTE_NAME = "speis";

const STROKE_WEIGHT = 1;
const OPACITY = 1;
const COUNT = 5000;
const SPAWN_RADIUS = 500;
const CENTER_RADIUS = 250;
const MAX_VELOCITY = 10;
const ACCELERATION = 0.25;

const particles = [];
const center = processing.createVector(0, 0);
let centerAngle = 0;
const centerAngleStep = 0.01;

class Particle {
  constructor(x, y) {
    this.location = createVector(x, y);
    this.velocity = createVector(center.x, center.y);
  }

  update() {
    const direction = p5.Vector.sub(center, this.location);
    direction.normalize();
    direction.mult(ACCELERATION);
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
  STROKE.setAlpha(1);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;

  for (let i = 0; i < COUNT; i++) {
    const a = (i * TWO_PI) / COUNT;
    const x = random(SPAWN_RADIUS) * cos(a);
    const y = random(SPAWN_RADIUS) * sin(a);
    particles.push(new Particle(x, y));
  }
}

function draw() {
  background(BG);
  translate(width / 2, height / 2);
  drawCenter();
  strokeWeight(STROKE_WEIGHT);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const randy = random(COLORS);
    const speedness = p.velocity.mag() / MAX_VELOCITY;
    const coleur = color(
      hue(randy),
      saturation(randy),
      lightness(randy),
      1 - speedness
    );
    stroke(coleur);
    point(p.location.x, p.location.y);
    p.update();
  }
  updateCenter();
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function drawCenter() {
  strokeWeight(STROKE_WEIGHT * 10);
  stroke(0, 0, 100);
  point(center.x, center.y);
}

function updateCenter() {
  center.x = CENTER_RADIUS * cos(centerAngle);
  center.y = CENTER_RADIUS * sin(centerAngle);
  centerAngle += centerAngleStep;
}

function clickOnSave() {
  //saveCanvas();
}
