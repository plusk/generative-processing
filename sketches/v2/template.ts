import p5 from "p5";
import { palettes } from "../../palettes";
import configBuilder, { baseSetup } from "./utils";

new p5((p: p5) => {
  let bg: string, colors: string[];

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
