import p5 from "p5";

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(1080, 1350);

    p.background(p.color("#ff7b7b"));

    p.noFill();
    p.strokeWeight(3);

    p.circle(p.width / 2, p.height / 2, 250);
  };
});
