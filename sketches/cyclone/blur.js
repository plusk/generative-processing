let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "pastella";

const FRAME_CYCLE = 10;
const WALKER_COUNT = 100;
const STROKE_WEIGHT = 2;
const STEP = 50;
const ANGLE_STEP = 10;
const NOISE_FACTOR = 0.05;
const ANGLE_OFFSET = 270;

const WALKERS = [];

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  // const keys = Object.keys(palettes);
  // palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  background(colors_bg);
  strokeWeight(STROKE_WEIGHT);
  fill(colors_bg);
  stroke(random(colors));
  angleMode(DEGREES);

  for (let i = 0; i < WALKER_COUNT; i++) {
    WALKERS.push({
      x: random(-STEP, STEP),
      y: random(-STEP, STEP),
      angle: 0,
      color: color(random(colors)),
    });
  }
}

let frame = 0;
let x = 0;
let y = 0;

const TIGHTNESS = 100;
const AMP = 50;

function draw() {
  //background(colors_bg);
  //translate(-width / 2, height / 2);
  //translate(width / 2, height / 2);

  for (let i = 0; i < WALKERS.length; i++) {
    const w = WALKERS[i];
    w.color.setAlpha(
      Math.exp(2 * ((((w.angle + ANGLE_OFFSET) % 360) - 180) / TIGHTNESS) ** 2)
    );
    strokeWeight(
      STROKE_WEIGHT *
        Math.exp(
          -1 * ((((w.angle + ANGLE_OFFSET) % 360) - 180) / TIGHTNESS) ** 2
        ) *
        AMP
    );
    stroke(w.color);
    w.angle += ANGLE_STEP * noise(w.x * NOISE_FACTOR, w.y * NOISE_FACTOR);
    w.x += STEP * cos(w.angle);
    w.y += STEP * sin(w.angle);
    point(w.x, w.y);
  }
}

function clickOnSave() {
  //saveCanvas();
}
