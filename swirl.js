let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "pastella"; // symmeblu, termos, vintage, pastella

const STROKE_WEIGHT = 2;
const OPACITY = 1;
const COUNT = 7;
const LOOPS = 1;
const ANGLE_STEP = Math.PI / 100;
const spirals = [];

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  PALETTE = PALETTES[PALETTE_NAME];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  background(BG);
  fill(BG);
  STROKE.setAlpha(1);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  const offset = round(random(COLORS.length - 1));
  for (let i = 0; i < COUNT; i++) {
    spirals.push({
      x: width * 0.5,
      y: (-0 * (height * ANGLE_STEP)) / TWO_PI / LOOPS,
      a: 0,
      step: random(ANGLE_STEP * 0.75, ANGLE_STEP),
      color: COLORS[round(random(COLORS.length - 1))],
      color: COLORS[(offset + i) % COLORS.length],
    });
  }
}

function draw() {
  beginShape(TRIANGLE_FAN);
  for (let i = 0; i < spirals.length; i++) {
    const s = spirals[i];
    s.a += s.step * (i + 1);
    s.y += (height * s.step) / TWO_PI / LOOPS;
    s.x += 10 * cos(s.a);
    drawSpiral(s);
  }
  endShape();
}

function drawSpiral(s) {
  stroke(s.color);
  vertex(s.x, s.y);
}

function clickOnSave() {
  saveCanvas();
}
