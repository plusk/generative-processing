let cnv;

const STROKE_WEIGHT = 3;
const PADDING = 216;
const SHAPE_COUNT = 7;

function setup() {
  cnv = createCanvas(1080, 1350);
  cnv.mouseClicked(clickOnSave);

  angleMode(DEGREES);

  strokeWeight(STROKE_WEIGHT);
}

function draw() {
  background(color("#ff7b7b"));

  const Y_STEP = (height - PADDING * 2) / (SHAPE_COUNT - 1);
  const X_STEP = (width - PADDING * 2) / (SHAPE_COUNT - 1);

  for (let y = PADDING; y <= height - PADDING; y += Y_STEP) {
    let col = 1;
    for (let x = PADDING; x <= width - PADDING; x += X_STEP) {
      push();
      translate(x, y);
      rotate(-90);
      polygon(0, 0, 37.5, col + 1);
      pop();
      col++;
    }
  }
}

function polygon(x, y, radius, count) {
  const vertices = [];
  for (let angle = 0; angle < 360; angle += 360 / count) {
    vertices.push({
      x: x + cos(angle) * radius,
      y: y + sin(angle) * radius,
    });
  }

  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    if (i === vertices.length - 1) {
      drawEdges(v, vertices[0]);
    } else {
      drawEdges(v, vertices[i + 1]);
    }
  }
}

function drawEdges(v1, v2) {
  line(v1.x, v1.y, v2.x, v2.y);
}

function clickOnSave() {
  saveCanvas();
}
