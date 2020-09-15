const STROKE_WEIGHT = 3;
const PADDING = 216;
const SHAPE_COUNT = 7;

function setup() {
  createCanvas(1080, 1350);

  background(color("#ff7b7b"));

  noFill();
  strokeWeight(STROKE_WEIGHT);

  const Y_STEP = (height - PADDING * 2) / (SHAPE_COUNT - 1);
  const X_STEP = (width - PADDING * 2) / (SHAPE_COUNT - 1);

  for (let y = PADDING; y <= height - PADDING; y += Y_STEP) {
    for (let x = PADDING; x <= width - PADDING; x += X_STEP) {
      circle(x, y, 75);
    }
  }
}
