let PALETTES, COLORS, STROKE, BG;

const EXPORT = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "termos";

const STROKE_WEIGHT = 5;
const OPACITY = 1;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  const cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  if (EXPORT) pixelDensity(1);
  if (EXPORT) frameRate(4);

  /* Get colors from the palettes */
  const PALETTE_KEYS = Object.keys(PALETTES);
  const PALETTE = !RANDOM_PALETTE
    ? PALETTES[PALETTE_NAME]
    : PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];

  colorMode(HSL);
  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = color(PALETTE.bg);

  noStroke();
  /* Sketch-specific setup */
  strokeWeight(STROKE_WEIGHT);
  
  background(BG);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

const ROWS = 15;
const COLS = 40;
const PAD = 200;
const ZOOM = 0.05;
const LINE = true;
const GRADIENT = true;

function draw() {

  background(BG);

  const ul = color(random(360), 100, 75);
  const ur = color(random(360), 100, 75);
  const ll = color(random(360), 100, 75);
  const lr = color(random(360), 100, 75);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {

      stroke(random(COLORS));
      const x = PAD + c / (COLS - 1) * (width - PAD * 2);
      const y = PAD + r / (ROWS - 1) * (height - PAD * 2);

      const randy = 8 * noise(x * ZOOM, y * ZOOM);

      if(GRADIENT) {
        const u = lerpColor(ul, ur, x / (width - PAD * 2));
        const l = lerpColor(ll, lr, x / (width - PAD * 2));
        stroke(lerpColor(u, l, y / (height - PAD * 2)));
      }

      if(LINE) {
        line(x, y, x, y - randy * STROKE_WEIGHT * 1.5)
      } else {
        for (let z = 0; z < randy; z++) {
          const realy = y - z * (STROKE_WEIGHT * 1.5);
          point(x, realy);
        }
      }
    }
  }
  noLoop();
}

function clickOnSave() {
  saveCanvas();
}
