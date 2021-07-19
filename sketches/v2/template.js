import palettes from "./palettes.js";
import configBuilder from "./utils.js";

new p5((p) => {
  const { c, menu } = configBuilder(p, {
    palette: "stronk",
    randomSeed: 1,
    strokeWeight: 10,
  });

  let bg, colors;

  menu.on("change", (e) => {
    p.setup();
  });

  p.setup = () => {
    bg = palettes[c.palette].bg;
    colors = palettes[c.palette].colors;
    p.createCanvas(1080, 1350);
    p.pixelDensity(1);
    p.noStroke();
    p.rectMode(p.CENTER);
    p.randomSeed(c.randomSeed);
    p.random(); // get rid of some pseudo-random nastiness

    p.background(bg);
    p.noFill();
    p.strokeWeight(c.strokeWeight);
  };

  p.draw = () => {
    p.stroke(p.random(colors));
    p.point(p.random(p.width), p.random(p.height));
  };
});
