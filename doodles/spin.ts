import p5 from "p5";
import { palettes } from "../palettes";

new p5((p: p5) => {
  let COLORS: any, STROKE: any, BG: any;

  const EXPORT = false;

  const RANDOM_PALETTE = false;
  const PALETTE_NAME = "termos";

  const STROKE_WEIGHT = 1;
  const OPACITY = 1;

  const COUNT = 100;

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

    /* Sketch-specific setup */
    p.strokeWeight(STROKE_WEIGHT);
    STROKE = p.random(COLORS);
    STROKE.setAlpha(OPACITY);
    p.stroke(STROKE);
    p.background(BG);

    p.rectMode(p.CENTER);
    p.stroke("white");

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = STROKE;
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    const angie = (p.frameCount * p.TWO_PI) / -50000;
    p.rotate(angie);
    p.background(BG);
    p.fill("white");
    p.rect(0, 0, 80);

    const collie = p.color(p.hue(BG), p.saturation(BG), p.lightness(BG), 0.001);
    p.fill(collie);
    p.rect(0, 0, 100);

    for (let i = 1; i < COUNT; i++) {
      const a = p.TWO_PI / COUNT;
      p.rotate(a + angie);
      p.rect(0, 0, 100 + ((p.height * 1.5) / COUNT) * i);
    }

    // p.beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
