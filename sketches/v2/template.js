import palettes from "./palettes.js";
import configBuilder, { baseSetup } from "./utils.js";

new p5((p) => {
  let bg, colors;

  const c = configBuilder(p, {
    palette: "sirkul",
    strokeWeight: 50,
  });

  p.setup = () => {
    baseSetup(p, c);

    bg = palettes[c.palette].bg;
    colors = palettes[c.palette].colors;
    p.background(bg);
    p.strokeWeight(c.strokeWeight);
  };

  p.draw = () => {
    p.stroke(colors[p.frameCount % colors.length]);
    p.point(p.random(p.width), p.random(p.height));
  };
});
