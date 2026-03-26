import p5 from "p5";
import palettesData from "../../../palettes.json";

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 1;
const CENTER_SIZE = STROKE_WEIGHT * 20;
const OPACITY = 0.5;
const COUNT = 5000;
const VERTICES = 10;
const SPAWN_RADIUS = 200;
const MAX_VELOCITY = 7.5;
const ACCELERATION = 0.2;
const TIMEWALK = 0.01;

let COLORS: any[];
let BG: any;
let STROKE: any;

let center: any;
const particles: any[] = [];
const vertices: any[] = [];
const path: any[] = [];

let walkindex = 0;

new p5((p: p5) => {
  class Particle {
    location: any;
    velocity: any;
    color: any;
    accfactor: number;

    constructor(x: number, y: number, i: number) {
      this.location = p.createVector(x, y);
      this.velocity = p.createVector(center.x, center.y);
      this.color = COLORS[i % COLORS.length];
      this.accfactor = p.random(0.5, 1);
    }

    update() {
      const direction = p5.Vector.sub(center, this.location);
      if (direction.mag() < CENTER_SIZE / 2) {
        const r = p.random(CENTER_SIZE / 4);
        const a = p.random(p.TWO_PI);
        this.location = p.createVector(r * p.cos(a), r * p.sin(a));
        p.line(center.x, center.y, 0, 0);
        this.velocity = p.createVector(-center.x, -center.y);
      } else {
        direction.normalize();
        direction.mult(ACCELERATION ** 0.75 * this.accfactor);
        this.velocity.add(direction);
        this.velocity.limit(MAX_VELOCITY);
        this.location.add(this.velocity);
      }
    }
  }

  p.setup = () => {
    const cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    p.colorMode(p.HSL);
    const PALETTE = (palettesData as any)[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettesData);
    // PALETTE = (palettesData as any)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));

    p.background(BG);
    p.fill(BG);
    BG.setAlpha(1);
    STROKE.setAlpha(OPACITY);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = STROKE;

    for (let i = 0; i < VERTICES; i++) {
      vertices.push(
        p.createVector(p.random(-p.width / 4, p.width / 4), p.random(-p.height / 4, p.height / 4)),
      );
    }

    for (let i = 0; i < vertices.length - 3; i++) {
      const a = vertices[i];
      const b = vertices[i + 1];
      const c = vertices[i + 2];
      const d = vertices[i + 3];
      for (let bla = 0; bla < 1; bla += 1 * TIMEWALK) {
        const x = (p as any).curvePoint(a.x, b.x, c.x, d.x, bla);
        const y = (p as any).curvePoint(a.y, b.y, c.y, d.y, bla);
        path.push(p.createVector(x, y));
      }
    }
    center = path[0];

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
    /*

    p.strokeWeight(STROKE_WEIGHT * 0.5);
    p.beginShape();
    for (let i = 0; i < vertices.length; i++) {
      const v = vertices[i];
      p.curveVertex(v.x, v.y);
    }
    p.endShape();

    for (let i = 0; i < path.length; i++) {
      p.strokeWeight(STROKE_WEIGHT * 5);
      p.point(path[i].x, path[i].y);
      p.strokeWeight(STROKE_WEIGHT);
    }
*/
    p.strokeWeight(STROKE_WEIGHT);

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      p.stroke(particle.color);
      p.point(particle.location.x, particle.location.y);
      particle.update();
    }
    updateCenter();
    drawCenter();
    if (walkindex >= path.length) p.noLoop();
  };

  const drawCenter = () => {
    p.strokeWeight(CENTER_SIZE);
    p.stroke(0, 0, 100);
    p.point(center.x, center.y);
    p.point(0, 0);
  };

  const updateCenter = () => {
    center.x = path[walkindex].x;
    center.y = path[walkindex].y;
    walkindex++;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
