import p5 from "p5";
import palettesData from "../../../palettes.json";

const EXPORT = false;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const OPACITY = 1;

const COUNT = 10;
const ANGLE_STEP = 0.005;
const MAX_RADIUS = 500;

let RINGS: any[] = [];

let COLORS: any[], BG: any, STROKE: any;

new p5((p: p5) => {
  p.setup = () => {
    if (EXPORT) p.frameRate(5);

    const cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    p.colorMode(p.HSL);
    const PALETTE = (palettesData as any)[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettesData);
    // PALETTE = (palettesData as any)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"].map((col: string) => p.color(col));
    BG = p.color(PALETTE.bg);
    STROKE = p.random(COLORS);
    p.stroke(STROKE);
    p.background(BG);

    p.strokeWeight(STROKE_WEIGHT);
    const FILL = p.random(BG);
    FILL.setAlpha(0.05);
    p.fill(FILL);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = STROKE;

    for (let i = 0; i < COUNT; i++) {
      RINGS.push({
        a: 0,
        r: ((i + 1) * MAX_RADIUS) / COUNT,
      });
    }
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    p.rotate(-p.HALF_PI);
    p.beginShape();
    for (let i = 0; i < RINGS.length; i++) {
      const ring = RINGS[i];
      const x = ring.r * p.cos(ring.a);
      const y = ring.r * p.sin(ring.a);
      p.vertex(x, y);
      ring.a += i * ANGLE_STEP;
    }
    p.endShape();
    // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
