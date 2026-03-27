import p5 from "p5";

new p5((p: p5) => {
  const STROKE_WEIGHT = 3;
  const PADDING = 216;
  const SHAPE_COUNT = 7;

  p.setup = () => {
    p.createCanvas(1080, 1350);

    p.background(p.color("#ff7b7b"));

    p.noFill();
    p.strokeWeight(STROKE_WEIGHT);

    const Y_STEP = (p.height - PADDING * 2) / (SHAPE_COUNT - 1);
    const X_STEP = (p.width - PADDING * 2) / (SHAPE_COUNT - 1);

    for (let y = PADDING; y <= p.height - PADDING; y += Y_STEP) {
      for (let x = PADDING; x <= p.width - PADDING; x += X_STEP) {
        p.circle(x, y, 75);
      }
    }
  };
});
