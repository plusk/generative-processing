let PALETTES, COLORS, STROKE, BG;

/* Enable to make a canvas suitable for A2 paper */
const PRINT_MODE = false;

/* Get a random palette or choose a specific one from palettes.json */
const RANDOM_PALETTE = false;
const PALETTE_NAME = "symmeblu";

const HAS_STROKE = true;
const STROKE_WEIGHT = 4;
const OPACITY = 1;

const SIZE = 400;

const SHAPE_CHANCE = 0.2;
const BACKGROUND_CHANCE = 0.5;

/* The shape will be randomly selected from the following object */
/* The random selection is weighted based on the integer values */
/* Example: 1 is a normal amount, 2 is double, 0 would be none of that type */
/* The values are weighed in relation to each other, so 1 2 3 4 = 2 4 6 8 */
const SHAPE_WEIGHTS = [
  { type: "SQUARE", weight: 1 },
  { type: "DIAMOND", weight: 1 },
  { type: "TRIANGLE", weight: 1 },
  { type: "CIRCLE", weight: 1 },
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
  frameRate(1);

  /* Get colors from the palettes */
  const PALETTE_KEYS = Object.keys(PALETTES);
  const PALETTE = !RANDOM_PALETTE
    ? PALETTES[PALETTE_NAME]
    : PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];

  colorMode(HSL);
  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = color(PALETTE.bg);

  /* Sketch-specific setup */
  STROKE = random(COLORS);

  background(BG);
  strokeWeight(STROKE_WEIGHT);

  rectMode(CENTER);
  strokeJoin(BEVEL);
  stroke(BG);

  !HAS_STROKE && noStroke();

  /* Initialize weighted shapes */
  for (let s = 0; s < SHAPE_WEIGHTS.length; s++) {
    const shape = SHAPE_WEIGHTS[s];
    for (let w = 0; w < shape.weight; w++) {
      WEIGHTED_SHAPES.push(shape.type);
    }
  }
}

function draw() {
  background(BG);
  step(0, width / 2, height / 2, SIZE * 2);
}

function step(currentDepth, x, y, r) {
  if (
    currentDepth != 0 &&
    (random() < SHAPE_CHANCE || r <= STROKE_WEIGHT * 8)
  ) {
    drawRandomShape(x, y, r);
    return;
  }
  const r2 = r / 2;
  step(currentDepth + 1, x - r2 / 2, y - r2 / 2, r2);
  step(currentDepth + 1, x + r2 / 2, y - r2 / 2, r2);
  step(currentDepth + 1, x - r2 / 2, y + r2 / 2, r2);
  step(currentDepth + 1, x + r2 / 2, y + r2 / 2, r2);
}

function drawBackgroundOrDont(x, y, r) {
  fill(random(COLORS));
  if (random() < BACKGROUND_CHANCE) {
    rect(x, y, r);
    fill(random(COLORS));
  }
}

function drawRandomShape(x, y, r) {
  drawBackgroundOrDont(x, y, r);
  const shape = random(WEIGHTED_SHAPES);

  if (shape == "DIAMOND") {
    drawDiamond(x, y, r);
  } else if (shape == "CIRCLE") {
    circle(x, y, r);
  } else if (shape == "TRIANGLE") {
    drawTriangle(x, y, r);
  } else if (shape == "SQUARE") {
    /* Drawing a background draws a square already */
    /* In other words, do nothing */
  }
}

function drawDiamond(x, y, r) {
  const r2 = r / 2;
  beginShape();
  vertex(x + r2, y);
  vertex(x, y + r2);
  vertex(x - r2, y);
  vertex(x, y - r2);
  endShape(CLOSE);
}

function drawTriangle(x, y, r) {
  const r2 = r / 2;
  const excludedCorner = random(["TOPLEFT", "TOPRIGHT", "BOTLEFT", "BOTRIGHT"]);

  if (excludedCorner == "TOPLEFT") {
    triangle(x - r2, y + r2, x + r2, y - r2, x + r2, y + r2);
  } else if (excludedCorner == "TOPRIGHT") {
    triangle(x - r2, y - r2, x + r2, y + r2, x - r2, y + r2);
  } else if (excludedCorner == "BOTLEFT") {
    triangle(x - r2, y - r2, x + r2, y + r2, x + r2, y - r2);
  } else if (excludedCorner == "BOTRIGHT") {
    triangle(x - r2, y - r2, x - r2, y + r2, x + r2, y - r2);
  }
}

function clickOnSave() {
  saveCanvas();
}
