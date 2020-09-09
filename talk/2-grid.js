let cnv;

const STROKE_WEIGHT = 3;
const PADDING = 216;
const SHAPE_COUNT = 7;

function setup() {
  cnv = createCanvas(1080, 1350);
  cnv.mouseClicked(clickOnSave);

  strokeWeight(STROKE_WEIGHT);
}

function draw() {
  background(color("#ff7b7b"));

  const Y_STEP = (height - PADDING * 2) / (SHAPE_COUNT - 1);
  const X_STEP = (width - PADDING * 2) / (SHAPE_COUNT - 1);

  for (let y = PADDING; y <= height - PADDING; y += Y_STEP) {
    for (let x = PADDING; x <= width - PADDING; x += X_STEP) {
      circle(x, y, 75);
    }
  }
}

function clickOnSave() {
  saveCanvas();
}
