import palettes from "../palettes.js";
import configBuilder, { baseSetup } from "../utils.js";

new p5((p) => {
  let bg, colors, frame;

  const c = configBuilder(p, {
    palette: "stronk",
    limit: 50,
    min: 75,
    max: 150,
    padding: 0.1,
  });

  p.setup = () => {
    baseSetup(p, c);
    bg = palettes[c.palette].bg;
    colors = palettes[c.palette].colors;
    p.background(bg);

    frame = 0;
    p.loop();
  };

  p.draw = () => {
    drawTower();

    frame++;
    if (frame > c.limit) {
      p.noLoop();
    }
  };

  const drawTower = () => {
    const color = p.random(colors);
    const x = p.random(p.width);
    const y = p.random(p.height * c.padding, p.height - p.height * c.padding);
    const w = p.random(c.min, c.max);
    const h = p.height - y;

    const scale = chroma.scale([color, bg]).colors(h);

    for (let i = 0; i < h; i++) {
      p.stroke(scale[i]);
      p.line(x, y + i, x + w, y + i);
    }
  };
});
