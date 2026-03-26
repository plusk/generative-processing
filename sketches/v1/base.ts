import p5 from "p5";
import palettesData from "../../palettes.json";

const EXPORT = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "termos";

const STROKE_WEIGHT = 10;
const OPACITY = 1;

let COLORS: any[], STROKE: any, BG: any;

new p5((p: p5) => {
  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);
    if (EXPORT) p.pixelDensity(1);
    if (EXPORT) p.frameRate(4);

    /* Get colors from the palettes */
    const PALETTE_KEYS = Object.keys(palettesData);
    const PALETTE = !RANDOM_PALETTE
      ? (palettesData as any)[PALETTE_NAME]
      : (palettesData as any)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];

    p.colorMode(p.HSL);
    COLORS = PALETTE["colors"].map((col: string) => p.color(col));
    BG = p.color(PALETTE.bg);

    /* Sketch-specific setup */
    p.strokeWeight(STROKE_WEIGHT);
    STROKE = p.random(COLORS);
    STROKE.setAlpha(OPACITY);
    p.stroke(STROKE);
    p.background(BG);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = STROKE;
  };

  p.draw = () => {
    p.circle(p.width / 2, p.height / 2, 200);
    // p.beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
