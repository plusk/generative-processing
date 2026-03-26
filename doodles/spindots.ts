import p5 from "p5";
import palettesData from "../palettes.json";

new p5((p: p5) => {
  let cnv: any;
  let palette: any;
  let _colors: any;
  let colors_bg: any;

  const PALETTE_NAME = "pastella";

  const STROKE_WEIGHT = 7.5;
  const RING_COUNT = 10;
  const BALL_COUNT = 20;
  const RADIUS = 400;
  const SPEED = 0.25;

  // const ANGLE_STEP = 1;

  let ticker = 0;

  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = (palettesData as any)[PALETTE_NAME];
    // const keys = Object.keys(palettesData);
    // palette = (palettesData as any)[keys[(keys.length * Math.random()) << 0]];
    _colors = palette["colors"];
    colors_bg = palette["bg"];

    p.background(colors_bg);
    p.noFill();
    p.colorMode(p.HSL);
    (p as any).angleMode((p as any).DEGREES);
    p.strokeWeight(STROKE_WEIGHT);
  };

  p.draw = () => {
    ticker++;
    p.translate(p.width / 2, p.height / 2);
    p.background(colors_bg);

    for (let r = 1; r <= RING_COUNT; r++) {
      for (let b = 1; b <= BALL_COUNT; b++) {
        p.strokeWeight(STROKE_WEIGHT * r ** 0.5);
        p.stroke((360 / BALL_COUNT) * b, 75, 75);
        const a = ((b / r ** 0.5) * SPEED * ticker) % 360;
        const x = (RADIUS / RING_COUNT) * r * p.cos(a);
        const y = (RADIUS / RING_COUNT) * r * p.sin(a);
        p.point(x, y);
        //p.strokeWeight(2);
        //p.circle(x, y, 200);
      }
    }
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
