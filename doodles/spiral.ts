import p5 from "p5";
import palettesData from "../palettes.json";

new p5((p: p5) => {
  let cnv: any;
  let palette: any;
  let colors: any;
  let colors_bg: any;

  const PALETTE_NAME = "pastella";

  const threads: any[] = [];
  let collie: any;

  const STROKE_WEIGHT = 4;
  const THREAD_COUNT = 16;
  const RADIUS_SPREAD = STROKE_WEIGHT * 1.5;
  let ANGLE_DIFF = 1;
  const OPACITY_DIFF = 0.015;

  const RADIUS_DIFF = 0.003 * RADIUS_SPREAD * THREAD_COUNT;

  let ticker = 0;

  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = (palettesData as any)[PALETTE_NAME];
    //const keys = Object.keys(palettesData);
    //palette = (palettesData as any)[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = palette["bg"];

    (p as any).angleMode((p as any).DEGREES);

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);

    for (let t = 0; t < THREAD_COUNT; t++) {
      collie = p.random(colors);
      //collie = colors[t % colors.length];

      threads.push({
        radius: t * RADIUS_SPREAD,
        angle: 0,
        prevX: 0,
        prevY: 0,
        opacity: OPACITY_DIFF * (THREAD_COUNT - t),
        color: collie,
      });
    }
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);

    ticker += 0.03;
    let noyze = p.noise(ticker);
    noyze *= RADIUS_DIFF * 5;
    noyze *= p.random(-1, 1);

    for (let t = 0; t < threads.length; t++) {
      const thread = threads[t];

      const prevX = thread["prevX"];
      const prevY = thread["prevY"];
      const x = thread["radius"] * p.cos(thread["angle"]);
      const y = thread["radius"] * p.sin(thread["angle"]);

      thread["radius"] += RADIUS_DIFF + noyze;
      thread["angle"] += ANGLE_DIFF;
      let opacity = thread["opacity"] + OPACITY_DIFF * (THREAD_COUNT - t);

      thread["prevX"] = x;
      thread["prevY"] = y;
      thread["opacity"] = opacity;

      const cololo = p.color(thread["color"]);
      cololo.setAlpha(opacity);
      thread["color"] = cololo;
      p.stroke(cololo);
      p.line(prevX, prevY, x, y);
      //p.point(x, y);
    }
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
