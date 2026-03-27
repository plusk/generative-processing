import p5 from "p5";
import { palettes } from "../../palettes";

let PALETTE: any;
let COLORS: any;
let BG: p5.Color;
let STROKE: any;

const PALETTE_NAME = "mono";

const STROKE_WEIGHT = 2;
const MIN_RADIUS = 100;
const MAX_RADIUS = 1080 * 0.5; //1080 * 0.75
const COUNT = 10000;

const POINTS_ARR: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    const cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = palettes[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettes);
    // PALETTE = palettes[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE.colors;
    BG = p.color(PALETTE.bg);
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
      POINTS_ARR.push({
        radius: randy,
        angle: a,
      });
    }
    //p.circle(0, 0, 200);
  };

  p.draw = () => {
    p.background(BG);
    p.translate(p.width / 2, p.height / 2);
    for (let pt = 0; pt < POINTS_ARR.length; pt++) {
      const poi = POINTS_ARR[pt];
      const x = poi.radius * p.cos(poi.angle);
      const y = poi.radius * p.sin(poi.angle);
      p.point(x, y);
      if (poi.radius <= MIN_RADIUS) {
        poi.radius = MAX_RADIUS;
      } else {
        poi.radius -= MIN_RADIUS * Math.exp((-1 / MIN_RADIUS) * (poi.radius - MIN_RADIUS));
      }
    }
    // p.beginShape(); p.POINTS, p.LINES, p.TRIANGLES, p.TRIANGLE_FAN, p.TRIANGLE_STRIP, p.QUADS, p.QUAD_STRIP
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
