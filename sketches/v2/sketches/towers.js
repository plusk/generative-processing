import palettes from "../palettes.js";
import configBuilder, { baseSetup, ConfigValue } from "../utils.js";

new p5((p) => {
  let bg, colors, frame, scales;

  const c = configBuilder(p, {
    palette: "onom",
    limit: new ConfigValue({ value: 100, min: 1, max: 100, step: 1}),
    minWidth: new ConfigValue({ value: 75, min: 50, max: 100, step: 5}),
    maxWidth: new ConfigValue({ value: 150, min: 100, max: 200, step: 5}),
    padding: new ConfigValue({ value: 0, min: 0, max: 0.5, step: 0.05}),
    grainy: true,
    strokeWeight: new ConfigValue({ value: 1, min: 0.1, max: 5, step: 0.1}),
    pointSpacing: new ConfigValue({ value: 2, min: 1, max: 5, step: 0.1 }),
    specks: new ConfigValue({ value: 20000, min: 0, max: 20000, step: 100 }),
    angleChance: new ConfigValue({ value: 0.25, min: 0, max: 1, step: 0.05 })
  });

  p.setup = () => {
    baseSetup(p, c);
    bg = palettes[c.palette].bg;
    colors = palettes[c.palette].colors;
    p.strokeWeight(c.strokeWeight);
    
    scales = [];
    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      scales.push(chroma.scale([color, bg]).colors(p.height));
    }

    drawBackground();

    frame = 0;
    p.loop();
  };

  p.draw = () => {
    drawTower();

    frame++;
    if (frame >= c.limit) {
      drawSpecks(true);
      p.noLoop();
    }
  };

  const drawTower = () => {
    const scale = p.random(scales);
    const w = p.random(c.minWidth, c.maxWidth);
    const x = p.random(-w, p.width);
    const y = p.random(p.height * c.padding, p.height - p.height * c.padding);
    const h = p.height - y;

    const isAngled = p.random() < c.angleChance;
    const angleUpwards = p.random([true, false]);

    for (let i = 0; i < h; i++) {
      p.stroke(scale[i]);

      const chance = i / h;
      if(c.grainy) {
        for (let j = 0; j < w; j += c.strokeWeight * c.pointSpacing) {
          if (p.random() > chance) {
            if(isAngled) {
              if(angleUpwards && w - i < j) p.point(x + j, y + i);
              if(!angleUpwards && i > j) p.point(x + j, y + i);
            } else {
              p.point(x + j, y + i);
            }
          }
        }
      } else {
        if(isAngled) {
          if(i < w) {
            if(angleUpwards) p.line(x + w - i, y + i, x + w, y + i);
            if(!angleUpwards) p.line(x, y + i, x + i, y + i);
          } else {
            p.line(x, y + i, x + w, y + i);
          }
        } else {
          p.line(x, y + i, x + w, y + i);
        }
      }
    }
  };

  const drawBackground = () => {
    p.background(bg);
    drawSpecks(false);
  }

  const drawSpecks = (contrast) => {
    for (let i = 0; i < c.specks; i++) {
      const scale = p.random(scales);
      const collie = contrast ? bg : scale[p.round(i / c.specks)]
      p.stroke(collie)
      const x = p.random(p.width);
      const y = p.random(p.height);
      p.point(x, y);
    }
  }
});
