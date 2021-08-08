import palettes from "../palettes.js";
import configBuilder, { baseSetup, ConfigValue } from "../utils.js";

new p5((p) => {
  let bg, colors;

  const c = configBuilder(p, {
    palette: "sirkul",
    padding: new ConfigValue({ value: 0.25, min: 0, max: 1, step: 0.005 }),
    diameter: 50,
    limit: 250,
    fillAmp: new ConfigValue({ value: 1, min: 1, max: 1.25, step: 0.005 }),
    shadowAmp: new ConfigValue({ value: 1.025, min: 1, max: 1.25, step: 0.005 }),
    outline: false,
    outlineAmp: new ConfigValue({ value: 1.05, min: 1, max: 1.25, step: 0.005 }),
    outlineOffset: new ConfigValue({ value: 1.1, min: 1, max: 2, step: 0.05 }),
    outlineWeight: 2,
    seed: p.random(10000),
  });

  const getCoords = ({ r, a }, amp) => {
    const ramp = r * amp;
    return {
      x: ramp * p.cos(a),
      y: ramp * p.sin(a),
    };
  };

  p.setup = () => {
    baseSetup(p, c);

    bg = palettes[c.palette].bg;
    colors = palettes[c.palette].colors;
    p.background(bg);
    p.strokeWeight(c.diameter);
    p.noFill();

    /* Now for the actual action */
    let coords = [];
    p.translate(p.width / 2, p.height / 2);
    const rmax = (p.max(p.width, p.height) / 2) * (1 - c.padding);

    /* Shadow */
    p.stroke("#222");
    for (let i = 0; i < c.limit; i++) {
      coords.push({
        r: p.random(-rmax, rmax),
        a: p.random(p.TAU),
      });
      const { x, y } = getCoords(coords[i], c.shadowAmp);
      p.point(x, y);
    }

    /* Outline */
    if (c.outline) {
      p.strokeWeight(c.outlineWeight);
      for (let i = 0; i < c.limit; i++) {
        p.stroke(colors[i % colors.length]);
        const { x, y } = getCoords(coords[i], c.outlineAmp);
        p.circle(x, y, c.diameter * c.outlineOffset);
      }
    }

    /* Fill */
    p.noStroke();
    p.drawingContext.shadowBlur = 2;
    p.drawingContext.shadowColor = "black";
    for (let i = 0; i < c.limit; i++) {
      p.fill(colors[i % colors.length]);
      const { x, y } = getCoords(coords[i], c.fillAmp);
      p.circle(x, y, c.diameter);
    }
  };
});
