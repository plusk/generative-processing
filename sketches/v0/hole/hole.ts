import p5 from "p5";
import palettesData from "../../../palettes.json";

let cnv: any;
let PALETTE: any;
let COLORS: any;
let BG: any;
let STROKE: any;

const PALETTE_NAME = "symmeblu";

const STROKE_WEIGHT = 2;
const ANGLE_STEP = 0.1;
const ANGLE_AMP = 5;
const RADIUS_STEP = 2;
const RADIUS_AMP = 0.01;
const MIN_RADIUS = 100;
const MAX_RADIUS = 1080; //1080 * 0.75
const COUNT = 10000;

const POINTS_ARR: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = palettesData[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettesData);
    // PALETTE = palettesData[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));

    p.background(BG);
    p.fill(BG);
    //STROKE.setAlpha(5);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLORS);
    p.translate(p.width / 2, p.height / 2);
    for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / COUNT) {
      const randy = p.random(MIN_RADIUS, MAX_RADIUS);
      const x = randy * p.cos(a);
      const y = randy * p.sin(a);
      POINTS_ARR.push({
        radius: randy,
        angle: a,
        stroke: p.random(COLORS),
        weight: p.random(STROKE_WEIGHT * 0.5, STROKE_WEIGHT * 4),
      });
    }
    //p.circle(0, 0, 200);
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
        p.strokeWeight(STROKE_WEIGHT / 2 + poi.weight * factor ** 5);
        const xNew = poi.radius * p.cos(poi.angle);
        const yNew = poi.radius * p.sin(poi.angle);
        p.line(x, y, xNew, yNew);
      }
    }
    //p.circle(0, 0, MIN_RADIUS * 2);
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
