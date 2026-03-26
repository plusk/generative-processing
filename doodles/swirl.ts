import p5 from "p5";
import palettesData from "../palettes.json";

new p5((p: p5) => {
  let cnv: any;
  let PALETTE: any;
  let COLORS: any;
  let BG: any;
  let STROKE: any;

  const PALETTE_NAME = "pastella"; // symmeblu, termos, vintage, pastella

  const STROKE_WEIGHT = 2;

  const COUNT = 7;
  const LOOPS = 1;
  const ANGLE_STEP = Math.PI / 100;
  const spirals: any[] = [];

  p.setup = () => {
    cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    p.colorMode(p.HSL);
    PALETTE = (palettesData as any)[PALETTE_NAME];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));

    p.background(BG);
    p.fill(BG);
    STROKE.setAlpha(1);
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    const offset = p.round(p.random(COLORS.length - 1));
    for (let i = 0; i < COUNT; i++) {
      spirals.push({
        x: p.width * 0.5,
        y: (-0 * (p.height * ANGLE_STEP)) / p.TWO_PI / LOOPS,
        a: 0,
        step: p.random(ANGLE_STEP * 0.75, ANGLE_STEP),
        color: COLORS[(offset + i) % COLORS.length],
      });
    }
  };

  p.draw = () => {
    p.beginShape((p as any).TRIANGLE_FAN);
    for (let i = 0; i < spirals.length; i++) {
      const s = spirals[i];
      s.a += s.step * (i + 1);
      s.y += (p.height * s.step) / p.TWO_PI / LOOPS;
      s.x += 10 * p.cos(s.a);
      drawSpiral(s);
    }
    p.endShape();
  };

  const drawSpiral = (s: any) => {
    p.stroke(s.color);
    p.vertex(s.x, s.y);
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
