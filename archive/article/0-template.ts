import p5 from "p5";
import palettesData from "../../palettes.json";

new p5((p: p5) => {
  // Will run once when the sketch is opened
  p.setup = () => {
    p.createCanvas(1080, 1350);
    p.background("brown");
  };

  // Will run every frame (refreshes many times per second)
  p.draw = () => {
    p.circle(p.width / 2, p.height / 2, 100);
  };
});
