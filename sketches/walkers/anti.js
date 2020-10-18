let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "onom";
const STROKE_WEIGHT = 2;
const THREAD_COUNT = 1000;
const SPEED = 10;

const THREADS = [];

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

  for (let t = 0; t < THREAD_COUNT; t++) {
    THREADS.push({
      x: width / 2,
      y: height / 2,
      xSpeed: random(-SPEED, SPEED),
      ySpeed: random(-SPEED, SPEED),
    });
  }
}

function draw() {
  for (let t = 0; t < THREADS.length; t++) {
    const thread = THREADS[t];
    point(thread["x"], thread["y"]);

    updateThread(t, thread);
  }
  circle(width / 2, height / 2, 100);
}

function updateThread(t, thread) {
  thread.x += thread.xSpeed;
  thread.y += thread.ySpeed;
  THREADS[t] = thread;
}

function clickOnSave() {
  //saveCanvas();
}
