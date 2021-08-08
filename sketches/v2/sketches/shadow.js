import palettes from "../palettes.js";
import configBuilder, { baseSetup, ConfigValue } from "../utils.js";

new p5((p) => {
  let bg, colors, tickr, phase;
  let coords = [];

  const c = configBuilder(p, {
    palette: "sirkul",
    diameter: 50,
    strokeWeight: 2,
    limit: 250,
    outline: new ConfigValue({ value: 1, min: 1, max: 2, step: 0.05 }),
    fillAmp: new ConfigValue({ value: 1, min: 1, max: 1.25, step: 0.005 }),
    shadowAmp: new ConfigValue({ value: 1.025, min: 1, max: 1.25, step: 0.005 }),
    outlineAmp: new ConfigValue({ value: 1, min: 1, max: 1.25, step: 0.005 }),
    seed: p.random(10000),
  });

  p.setup = () => {
    baseSetup(p, c);

    bg = palettes[c.palette].bg;
    colors = palettes[c.palette].colors;
    p.background(bg);
    p.strokeWeight(c.diameter);
    p.noFill();

    tickr = 0;
    phase = 1;
  };

  const getCoords = ({ r, a }, amp) => {
    const ramp = r * amp;
    return {
      x: ramp * p.cos(a),
      y: ramp * p.sin(a),
    };
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    const rmax = p.max(p.width, p.height) / 2;
    if (phase === 1) {
      coords.push({
        r: p.random(-rmax, rmax),
        a: p.random(p.TAU),
      });
      const { x, y } = getCoords(coords[tickr], c.shadowAmp);
      p.stroke("#222");
      p.point(x, y);
    } else if (phase === 2) {
      p.strokeWeight(c.strokeWeight);
      p.stroke(colors[tickr % colors.length]);
      const { x, y } = getCoords(coords[tickr], c.outlineAmp);
      p.circle(x, y, c.diameter * c.outline);
    } else if (phase === 3) {
      p.strokeWeight(c.diameter);
      p.stroke(colors[tickr % colors.length]);
      const { x, y } = getCoords(coords[tickr], c.fillAmp);
      p.point(x, y);
    }
    if (tickr === c.limit) {
      phase++;
      tickr = 0;
    } else {
      tickr++;
    }
  };
});
