let PALETTES, COLORS, BG;

const PRINT_MODE = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "speis";

const MIN_OPACITY = 0.1;
const MAX_OPACITY = 1;

const MIN_SIZE = 2;
const MAX_SIZE = 100;

/* Shapes are weighed in relation to eachother, whole numbers only */
/* Example: the weights 1 2 3 will be the same as 2 4 6 */
const SHAPE_WEIGHTS = [
  { type: "CIRCLE", weight: 1 },
  { type: "TRIANGLE", weight: 0 },
  { type: "SQUARE", weight: 0 },
];
const WEIGHTED_SHAPES = [];

/*

  CONFIG END

*/

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  const cnv = PRINT_MODE ? createCanvas(4960, 7016) : createCanvas(1080, 1350);
  cnv.mouseClicked(clickOnSave);
  pixelDensity(1);

  /* Get colors from the palettes */
  const PALETTE_KEYS = Object.keys(PALETTES);
  const PALETTE = !RANDOM_PALETTE
    ? PALETTES[PALETTE_NAME]
    : PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];

  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = color(PALETTE.bg);
  colorMode(HSL);

  /* Sketch-specific setup */
  background(BG);
  noStroke();

  /* Initialize weighted shapes */
  for (let s = 0; s < SHAPE_WEIGHTS.length; s++) {
    const shape = SHAPE_WEIGHTS[s];
    for (let w = 0; w < shape.weight; w++) {
      WEIGHTED_SHAPES.push(shape.type);
    }
  }
}

function draw() {
  const size = random(MIN_SIZE, MAX_SIZE);
  const fillColor = random(COLORS);
  fillColor.setAlpha(1 + MIN_OPACITY - size / MAX_SIZE);
  fill(fillColor);

  drawRandomShape(random(width), random(height), size);
}

function drawRandomShape(x, y, size) {
  translate(x, y);
  rotate(random(TWO_PI));

  const shape = random(WEIGHTED_SHAPES);
  if (shape == "CIRCLE") {
    circle(x, y, size);
  } else if (shape == "TRIANGLE") {
    drawTriangle(x, y, size);
  } else if (shape == "SQUARE") {
    square(x, y, size);
  }
}

function drawTriangle(x, y, size) {
  const x1 = x + (cos((1 * TWO_PI) / 3) * size) / 2;
  const y1 = y + (sin((1 * TWO_PI) / 3) * size) / 2;
  const x2 = x + (cos((2 * TWO_PI) / 3) * size) / 2;
  const y2 = y + (sin((2 * TWO_PI) / 3) * size) / 2;
  const x3 = x + (cos((3 * TWO_PI) / 3) * size) / 2;
  const y3 = y + (sin((3 * TWO_PI) / 3) * size) / 2;
  triangle(x1, y1, x2, y2, x3, y3);
}

function clickOnSave() {
  saveCanvas();
}
