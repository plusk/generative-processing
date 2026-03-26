import p5 from "p5";
import palettesData from "../../../palettes.json";

let cnv: any;
let PALETTE: any;
let COLORS: any;
let BG: any;
let STROKE: any;

const PALETTE_NAME = "symmeblu"; //mono, onom, redrange

const MAX_FRAMES = 450;
const STROKE_WEIGHT = 1;
let ANGLE_STEP = 0.05;
const ANGLE_AMP = 10;
const ALPHA = 255;
let RADIUS_STEP = 1;
const RADIUS_AMP = 0.01;
const WEIGHT_AMP = 5;
const MIN_RADIUS = 100;
const MAX_RADIUS = 1080 * 0.5; //1080 * 0.75
const COUNT = 10000;

const POINTS_ARR: any[] = [];

let frame = 0;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, (1350/720)
    cnv.mouseClicked(clickOnSave);

    PALETTE = palettesData[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettesData);
    // PALETTE = palettesData[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));
    p.background(BG);
    p.fill(BG);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);
    for (let i = 0; i < COLORS.length; i++) {
      const collie = p.color(COLORS[i]);
      collie.setAlpha(ALPHA);
      COLORS[i] = collie;
    }
    p.translate(p.width / 2, p.height / 2);
    for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / COUNT) {
      const randy = p.random(MIN_RADIUS, MAX_RADIUS);
      POINTS_ARR.push({
        radius: randy,
        angle: a,
        stroke: p.random(COLORS),
        weight: p.random(STROKE_WEIGHT * 0.5, STROKE_WEIGHT * 2),
      });
    }
    //p.circle(0, 0, 200);
    //p.frameRate(4);
  };

  p.draw = () => {
    p.background(BG);
    p.translate(p.width / 2, p.height / 2);
    for (let pt = 0; pt < POINTS_ARR.length; pt++) {
      const poi = POINTS_ARR[pt];
      p.stroke(poi.stroke);
      const x = poi.radius * p.cos(poi.angle);
      const y = poi.radius * p.sin(poi.angle);
      if (poi.radius <= MIN_RADIUS) {
        poi.radius = MAX_RADIUS;
        p.strokeWeight(poi.weight);
      } else {
        const factor = (MAX_RADIUS + MIN_RADIUS - poi.radius) / MAX_RADIUS;
        poi.angle += ANGLE_STEP * factor ** ANGLE_AMP;
        poi.radius -= RADIUS_STEP * factor ** RADIUS_AMP;
        p.strokeWeight(STROKE_WEIGHT / 2 + poi.weight * factor ** WEIGHT_AMP);
        const xNew = poi.radius * p.cos(poi.angle);
        const yNew = poi.radius * p.sin(poi.angle);
        let factorini = (factor ** 0.5 * 0.5 * MAX_FRAMES) / frame;
        if (frame >= MAX_FRAMES / 2) {
          factorini = factor ** 0.5;
        }
        //p.line(x * factorini, y * factorini, xNew * factorini, yNew * factorini);
        p.line(x * factorini, y * factorini, xNew, yNew);
      }
    }
    //p.circle(0, 0, MIN_RADIUS * 2);
    //p.saveCanvas();
    if (frame >= MAX_FRAMES) {
      p.noLoop();
    }
    frame++;
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
