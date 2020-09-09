const STROKE_WEIGHT = 3;

function setup() {
  const cnv = createCanvas(1080, 1350);
  cnv.mouseClicked(clickOnSave);

  strokeWeight(STROKE_WEIGHT);
}

function draw() {
  background(color("#ff7b7b"));
  circle(width / 2, height / 2, 250);
}

function clickOnSave() {
  saveCanvas();
}
