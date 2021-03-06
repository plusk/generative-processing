let cnv;
let COLORS;

const STROKE_WEIGHT = 3;
const PADDING = 216;
const SHAPE_COUNT = 7;

const PALETTE = {
  bg: ["#ff7b7b"],
  colors: [
    "#A1F5E3",
    "#E7E7E7",
    "#FFFFFF",
    "#0e0e0e",
    "#0e0e0e",
    "#0e0e0e",
    "#0e0e0e",
    "#0e0e0e",
  ],
};

function setup() {
  cnv = createCanvas(1080, 1350);
  cnv.mouseClicked(clickOnSave);

  COLORS = PALETTE["colors"];

  angleMode(DEGREES);
  frameRate(1);

  strokeWeight(STROKE_WEIGHT);
}

function draw() {
  background(color("#ff7b7b"));

  const Y_STEP = (height - PADDING * 2) / (SHAPE_COUNT - 1);
  const X_STEP = (width - PADDING * 2) / (SHAPE_COUNT - 1);

  let row = 1;
  for (let y = PADDING; y <= height - PADDING; y += Y_STEP) {
    let col = 1;
    for (let x = PADDING; x <= width - PADDING; x += X_STEP) {
      push();
      translate(x, y);
      rotate(-90);
      polygon(0, 0, 37.5, col + 1, row);
      pop();
      col++;
    }
    row++;
  }
}

function polygon(x, y, radius, count, row) {
  const vertices = [];
  for (let angle = 0; angle < 360; angle += 360 / count) {
    vertices.push({
      x: x + cos(angle) * radius,
      y: y + sin(angle) * radius,
    });
  }

  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    stroke(random(COLORS));
    if (i === 0) {
      drawOrDont(v, vertices[vertices.length - 1], row);
      drawOrDont(v, { x, y }, row);
      drawOrDont(v, vertices[i + 1], row);
    } else if (i === vertices.length - 1) {
      drawOrDont(v, vertices[i - 1], row);
      drawOrDont(v, { x, y }, row);
      drawOrDont(v, vertices[0], row);
    } else {
      drawOrDont(v, vertices[i - 1], row);
      drawOrDont(v, { x, y }, row);
      drawOrDont(v, vertices[i + 1], row);
    }
  }
}

function drawOrDont(v1, v2, row) {
  const randy = 0.5 * exp(row - 1);
  if (random() < 0.5) {
    line(
      v1.x + random(-randy, randy),
      v1.y + random(-randy, randy),
      v2.x + random(-randy, randy),
      v2.y + random(-randy, randy)
    );
    strokeWeight(STROKE_WEIGHT * 3);
    point(v1.x + random(-randy, randy), v1.y + random(-randy, randy));
    point(v2.x + random(-randy, randy), v2.y + random(-randy, randy));
    strokeWeight(STROKE_WEIGHT);
  }
}

function clickOnSave() {
  saveCanvas();
}
