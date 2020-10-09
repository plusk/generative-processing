let PALETTES, COLORS, BG, STROKE;

const EXPORT = false;

const PALETTE_NAME = "gradient";

const STROKE_WEIGHT = 2;
const OPACITY = 1;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  if (EXPORT) frameRate(5);

  const cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = PALETTE["bg"].map((col) => color(col));
  STROKE = random(COLORS);

  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

function draw() {
  const AMOUNT = COLORS.length;
  drawBackground();
  drawSun();
  for (let i = 1; i < AMOUNT; i += 2) {
    drawRidge(
      ((i + 0) * height) / (AMOUNT + 1),
      ((i + 1) * height) / (AMOUNT + 1),
      height / (AMOUNT - 2),
      0.002,
      COLORS[i]
    );
    drawRidge(
      ((i + 2) * height) / (AMOUNT + 1),
      ((i + 1) * height) / (AMOUNT + 1),
      height / (AMOUNT - 2),
      0.002,
      COLORS[i + 1]
    );
  }
}

function drawBackground() {
  c1 = color("#FFB88D");
  c2 = color("#FF8034");
  for (var y = 0; y < height; y++) {
    const inter = y / height;
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
  stroke(STROKE);
}

function drawRidge(start, end, range, variability, filler) {
  stroke(filler);
  fill(filler);
  beginShape();
  const diff = end - start;
  for (let x = 0; x < width; x++) {
    const incline = x / width;
    const mean = start + incline * diff;
    const noised =
      noise(x * variability, mean * variability, frameCount * 0.01) - 0.5;
    vertex(x, mean + range * noised);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}

function drawSun() {
  stroke(color("#FFF02B"));
  fill(color("#FFF02B"));
  drawingContext.shadowBlur = 100;
  drawingContext.shadowColor = color("#FFF02B");
  circle(width / 2, 300, 500);
  drawingContext.shadowBlur = 0;
}

function clickOnSave() {
  saveCanvas();
}
