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
const PLANET_RADIUS = 250;
const MOON_RADIUS = 100;
const MAX_VELOCITY = 10;
const PLANET_GRAVITY = 0.5;
const MOON_GRAVITY = 0.1;
const ANGLE_STEP_PLANET = 0.02;
const ANGLE_STEP_MOON = 0.05;

const particles = [];
let planetAngle = Math.PI / 2;
let moonAngle = Math.PI / 2;
const planet = processing.createVector();
const moon = processing.createVector();

class Particle {
  constructor(x, y) {
    this.location = createVector(x, y);
    this.velocity = createVector(planet.x, planet.y);
  }

  update() {
    const planetGravity = p5.Vector.sub(planet, this.location);
    planetGravity.normalize();
    planetGravity.mult(PLANET_GRAVITY);
    this.velocity.add(planetGravity);
    this.velocity.limit(MAX_VELOCITY);
    this.location.add(this.velocity);

    const moonGravity = p5.Vector.sub(moon, this.location);
    moonGravity.normalize();
    moonGravity.mult(MOON_GRAVITY);
    this.velocity.add(moonGravity);
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
  updatePlanet();
  updateMoon();
  drawPlanet();
  drawMoon();
  strokeWeight(STROKE_WEIGHT);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const randy = random(COLORS);
    //const speedness = p.velocity.mag() / MAX_VELOCITY;
    const coleur = color(
      hue(randy),
      saturation(randy),
      lightness(randy)
      //1 - speedness
    );
    stroke(coleur);
    point(p.location.x, p.location.y);
    p.update();
  }
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function updatePlanet() {
  planet.x = PLANET_RADIUS * cos(planetAngle);
  planet.y = PLANET_RADIUS * sin(planetAngle);
  planetAngle += ANGLE_STEP_PLANET;
}

function updateMoon() {
  moon.x = planet.x + MOON_RADIUS * cos(moonAngle);
  moon.y = planet.y + MOON_RADIUS * sin(moonAngle);
  moonAngle += ANGLE_STEP_MOON;
}

function drawPlanet() {
  strokeWeight(STROKE_WEIGHT * 50);
  stroke(0, 0, 100);
  point(planet.x, planet.y);
}

function drawMoon() {
  strokeWeight(STROKE_WEIGHT * 10);
  stroke(0, 0, 100);
  point(moon.x, moon.y);
}

function clickOnSave() {
  //saveCanvas();
}
