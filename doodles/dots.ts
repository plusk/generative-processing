import p5 from "p5";
import { palettes } from "../palettes";

new p5((p: p5) => {
  let COLORS: any, BG: any;

  const EXPORT = false;

  const RANDOM_PALETTE = false;
  const PALETTE_NAME = "termos";

  const STROKE_WEIGHT = 5;

  const ROWS = 15;
  const COLS = 40;
  const PAD = 200;
  const ZOOM = 0.05;
  const LINE = true;
  const GRADIENT = true;

  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);
    if (EXPORT) p.pixelDensity(1);
    if (EXPORT) p.frameRate(4);

    /* Get colors from the palettes */
    const PALETTE_KEYS = Object.keys(palettes);
    const PALETTE = !RANDOM_PALETTE
      ? palettes[PALETTE_NAME]
      : palettes[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];

    p.colorMode(p.HSL);
    COLORS = PALETTE["colors"].map((col: any) => p.color(col));
    BG = p.color(PALETTE.bg);

    p.noStroke();
    /* Sketch-specific setup */
    p.strokeWeight(STROKE_WEIGHT);

    p.background(BG);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = STROKE;
  };

  p.draw = () => {
    p.background(BG);

    const ul = p.color(p.random(360), 100, 75);
    const ur = p.color(p.random(360), 100, 75);
    const ll = p.color(p.random(360), 100, 75);
    const lr = p.color(p.random(360), 100, 75);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        p.stroke(p.random(COLORS));
        const x = PAD + (c / (COLS - 1)) * (p.width - PAD * 2);
        const y = PAD + (r / (ROWS - 1)) * (p.height - PAD * 2);

        const randy = 8 * p.noise(x * ZOOM, y * ZOOM);

        if (GRADIENT) {
          const u = p.lerpColor(ul, ur, x / (p.width - PAD * 2));
          const l = p.lerpColor(ll, lr, x / (p.width - PAD * 2));
          p.stroke(p.lerpColor(u, l, y / (p.height - PAD * 2)));
        }

        if (LINE) {
          p.line(x, y, x, y - randy * STROKE_WEIGHT * 1.5);
        } else {
          for (let z = 0; z < randy; z++) {
            const realy = y - z * (STROKE_WEIGHT * 1.5);
            p.point(x, realy);
          }
        }
      }
    }
    p.noLoop();
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
