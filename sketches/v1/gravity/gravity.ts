import p5 from "p5";
import { palettes } from "../../../palettes";

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 1;
const CENTER_SIZE = STROKE_WEIGHT * 20;
const OPACITY = 0.5;
const COUNT = 5000;
const SPAWN_RADIUS = 250;
const CENTER_RADIUS = 250;
const MAX_VELOCITY = 5;
const ACCELERATION = 0.1;

let COLORS: any[];
let BG: any;
let STROKE: any;

const particles: any[] = [];
let center: any;
let centerAngle = Math.PI / 2;
const centerAngleStep = 0.01;

new p5((p: p5) => {
  center = p.createVector(0, 0);

  class Particle {
    location: any;
    velocity: any;
    color: any;
    accfactor: number;

    constructor(x: number, y: number, i: number) {
      this.location = p.createVector(x, y);
      this.velocity = p.createVector(center.x, center.y);
      this.color = COLORS[i % COLORS.length];
      this.accfactor = p.random(0.75, 1);
    }

    update() {
      const direction = p5.Vector.sub(center, this.location);
      direction.normalize();
      direction.mult(ACCELERATION * this.accfactor);
      this.velocity.add(direction);
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
    BG.setAlpha(0.75);
    STROKE.setAlpha(OPACITY);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //(p.drawingContext as CanvasRenderingContext2D).shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = STROKE;

    for (let i = 0; i < COUNT; i++) {
      const a = (i * p.TWO_PI) / COUNT;
      const randy = p.random(SPAWN_RADIUS);
      const x = randy * p.cos(a);
      const y = randy * p.sin(a);
      particles.push(new Particle(x, y, i));
    }
  };

  p.draw = () => {
    p.background(BG);
    p.translate(p.width / 2, p.height / 2);
    drawCenter();
    p.strokeWeight(STROKE_WEIGHT);
    (p.drawingContext as CanvasRenderingContext2D).shadowBlur = 0;
    p.stroke(0, 0, 100, OPACITY);
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      p.stroke(particle.color);
      p.point(particle.location.x, particle.location.y);
      particle.update();
    }
    updateCenter();
    // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  };

  const drawCenter = () => {
    const coleur = p.color(0, 0, 100);
    p.strokeWeight(CENTER_SIZE);
    p.stroke(coleur);
    p.point(center.x, center.y);
  };

  const updateCenter = () => {
    center.x = CENTER_RADIUS * p.cos(centerAngle);
    center.y = CENTER_RADIUS * p.sin(centerAngle);
    centerAngle += centerAngleStep;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
