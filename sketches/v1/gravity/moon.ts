import p5 from "p5";
import { palettes } from "../../../palettes";

const PALETTE_NAME = "speis";

const STROKE_WEIGHT = 1;
const COUNT = 5000;
const SPAWN_RADIUS = 500;
const PLANET_RADIUS = 250;
const MOON_RADIUS = 100;
const MAX_VELOCITY = 10;
const PLANET_GRAVITY = 0.5;
const MOON_GRAVITY = 0.1;
const ANGLE_STEP_PLANET = 0.02;
const ANGLE_STEP_MOON = 0.05;

let COLORS: any[];
let BG: any;
let STROKE: any;

const particles: any[] = [];
let planetAngle = Math.PI / 2;
let moonAngle = Math.PI / 2;
let planet: any;
let moon: any;

new p5((p: p5) => {
  planet = p.createVector();
  moon = p.createVector();

  class Particle {
    location: any;
    velocity: any;

    constructor(x: number, y: number) {
      this.location = p.createVector(x, y);
      this.velocity = p.createVector(planet.x, planet.y);
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

  p.setup = () => {
    const cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    p.colorMode(p.HSL);
    const PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = (palettes)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));

    p.background(BG);
    p.fill(BG);
    STROKE.setAlpha(255);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = STROKE;

    for (let i = 0; i < COUNT; i++) {
      const a = (i * p.TWO_PI) / COUNT;
      const x = p.random(SPAWN_RADIUS) * p.cos(a);
      const y = p.random(SPAWN_RADIUS) * p.sin(a);
      particles.push(new Particle(x, y));
    }
  };

  p.draw = () => {
    p.background(BG);
    p.translate(p.width / 2, p.height / 2);
    updatePlanet();
    updateMoon();
    drawPlanet();
    drawMoon();
    p.strokeWeight(STROKE_WEIGHT);
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      const randy = p.random(COLORS);
      //const speedness = particle.velocity.mag() / MAX_VELOCITY;
      const coleur = p.color(
        p.hue(randy),
        p.saturation(randy),
        p.lightness(randy),
        //1 - speedness
      );
      p.stroke(coleur);
      p.point(particle.location.x, particle.location.y);
      particle.update();
    }
    // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  };

  const updatePlanet = () => {
    planet.x = PLANET_RADIUS * p.cos(planetAngle);
    planet.y = PLANET_RADIUS * p.sin(planetAngle);
    planetAngle += ANGLE_STEP_PLANET;
  };

  const updateMoon = () => {
    moon.x = planet.x + MOON_RADIUS * p.cos(moonAngle);
    moon.y = planet.y + MOON_RADIUS * p.sin(moonAngle);
    moonAngle += ANGLE_STEP_MOON;
  };

  const drawPlanet = () => {
    p.strokeWeight(STROKE_WEIGHT * 50);
    p.stroke(0, 0, 100);
    p.point(planet.x, planet.y);
  };

  const drawMoon = () => {
    p.strokeWeight(STROKE_WEIGHT * 10);
    p.stroke(0, 0, 100);
    p.point(moon.x, moon.y);
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
