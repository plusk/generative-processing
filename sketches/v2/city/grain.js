import palettes from "../palettes.js";
import configBuilder, { baseSetup } from "../utils.js";

new p5((p) => {
  let bg, colors, frame, scales;

  const c = configBuilder(p, {
    palette: "onom",
    limit: 50,
    min: 75,
    max: 150,
    padding: 0.1,
    strokeWeight: 1,
    smooth: false,
    pointSpacing: 2,
  });

  p.setup = () => {
    baseSetup(p, c);
    bg = palettes[c.palette].bg;
    colors = palettes[c.palette].colors;
    p.background(bg);

    frame = 0;
    p.loop();

    p.strokeWeight(c.strokeWeight);

    scales = [];
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      scales.push(chroma.scale([color, bg]).colors(p.height));
    }
  };

  p.draw = () => {
    drawTower();

    frame++;
    if (frame > c.limit) {
      p.noLoop();
    }
  };

  const drawTower = () => {
    const scale = p.random(scales);
    const x = p.random(p.width);
    const y = p.random(p.height * c.padding, p.height - p.height * c.padding);
    const w = p.random(c.min, c.max);
    const h = p.height - y;

    for (let i = 0; i < h; i++) {
      p.stroke(scale[i]);

      const chance = i / h;
      if(c.smooth) {
        p.line(x, y + i, x + w, y + i);
      } else {
        for (let j = 0; j < w; j += c.strokeWeight * c.pointSpacing) {
          if (p.random() > chance) p.point(x + j, y + i);
        }
      }
    }
  };
});
