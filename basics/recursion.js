let PALETTES, COLORS, STROKE, BACKGROUNDS, BG;

const EXPORT = false;

const PALETTE_NAME = "symmeblu";
const HAS_STROKE = true;

const STROKE_WEIGHT = 5;
const OPACITY = 1;

const SIZE = 400;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  if (EXPORT) frameRate(4);
  if (EXPORT) pixelDensity(1);

  frameRate(2);

  const cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BACKGROUNDS = PALETTE["bg"].map((col) => color(col));

  STROKE = random(COLORS);
  BG = random(BACKGROUNDS);

  STROKE.setAlpha(OPACITY);

  background(BG);
  strokeWeight(STROKE_WEIGHT);

  rectMode(CENTER);
  strokeJoin(BEVEL);
  stroke(BG);

  !HAS_STROKE && noStroke();

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

function draw() {
  background(BG);
  step(0, width / 2, height / 2, SIZE * 2);

  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
}

function step(currentDepth, x, y, radius) {
  fill(random(COLORS));

  if (currentDepth != 0 && (random() > 0.75 || radius <= STROKE_WEIGHT * 8)) {
    const shape = random(["SQUARE", "CIRCLE", "TRIANGLE"]);
    if (shape === "SQUARE") {
      random() > 0.5 && rect(x, y, radius);
      return;
    }
    if (shape === "CIRCLE") {
      random() > 0.5 && rect(x, y, radius);
      fill(random(COLORS));
      circle(x, y, radius);
      return;
    }
    if (shape === "TRIANGLE") {
      random() > 0.5 && rect(x, y, radius);
      fill(random(COLORS));

      const excludedCorner = random([
        "TOPLEFT",
        "TOPRIGHT",
        "BOTLEFT",
        "BOTRIGHT",
      ]);
      if (excludedCorner == "TOPLEFT") {
        triangle(
          x - radius / 2,
          y + radius / 2,
          x + radius / 2,
          y - radius / 2,
          x + radius / 2,
          y + radius / 2
        );
      } else if (excludedCorner == "TOPRIGHT") {
        triangle(
          x - radius / 2,
          y - radius / 2,
          x + radius / 2,
          y + radius / 2,
          x - radius / 2,
          y + radius / 2
        );
      } else if (excludedCorner == "BOTLEFT") {
        triangle(
          x - radius / 2,
          y - radius / 2,
          x + radius / 2,
          y + radius / 2,
          x + radius / 2,
          y - radius / 2
        );
      } else if (excludedCorner == "BOTRIGHT") {
        triangle(
          x - radius / 2,
          y - radius / 2,
          x - radius / 2,
          y + radius / 2,
          x + radius / 2,
          y - radius / 2
        );
      }
      return;
    }
  }
  step(currentDepth + 1, x - radius / 4, y - radius / 4, radius / 2);
  step(currentDepth + 1, x + radius / 4, y - radius / 4, radius / 2);
  step(currentDepth + 1, x - radius / 4, y + radius / 4, radius / 2);
  step(currentDepth + 1, x + radius / 4, y + radius / 4, radius / 2);
}

function clickOnSave() {
  saveCanvas();
}
