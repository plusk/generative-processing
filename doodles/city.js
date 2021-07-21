import palettes from "./palettes.js";
import configBuilder, { baseSetup } from "./utils.js";

new p5((p) => {
  let bg, colors, frame;

  const c = configBuilder(p, {
    palette: "monowild",
    limit: 100,
    min: 75,
    max: 150,
  });

  p.setup = () => {
    baseSetup(p, c);
    bg = p.color(palettes[c.palette].bg);
    colors = palettes[c.palette].colors.map((collie) => p.color(collie));
    p.background(bg);

    frame = 0;
    p.loop();
  };

  p.draw = () => {
    drawTower();

    frame++;
    console.log(frame);
    if (frame == c.limit) {
      p.noLoop();
    }
  };

  const drawTower = () => {
    const color = p.random(colors);
    const x = p.random(p.width);
    const y = p.random(p.height * 0.1, p.height);
    const w = p.random(c.min, c.max);
    const h = p.height - y;

    for (let i = y; i < p.height; i++) {
      const stroke = p.lerpColor(color, bg, i / h);
      p.stroke(stroke);
      p.line(x, i, x + w, i);
    }
  };
});
