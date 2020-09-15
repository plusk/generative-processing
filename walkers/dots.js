let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

// sydney
// redcent
// symmeblu
// termos
// vintage
const PALETTE_NAME = "termos";
const FRAME_LIMIT = 35;
const SPEED = 50;
const STROKE_WEIGHT = 1;
const STROKE_WEIGHT_START = 50; // higher = more background circles
const THREAD_COUNT = 500;
const NOISE_GRANULARITY = 0.005;
//const NOISE_EVOLUTION = 0.0001;
const OPACITY = 255;

const STROKE_WEIGHT_DIFF = (STROKE_WEIGHT_START - STROKE_WEIGHT) / FRAME_LIMIT;
const FADE_IN = OPACITY / FRAME_LIMIT;
let fade = 0;
let noize = 0;
const THREADS = [];

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(2400, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  const keys = Object.keys(palettes);
  //palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = color(palette["bg"]);
  background(colors_bg);
  strokeWeight(STROKE_WEIGHT);
  fill(colors_bg);

  const squirtle = sqrt(THREAD_COUNT);
  for (let t = 0; t < THREAD_COUNT; t++) {
    const collie = color(random(colors));
    if (OPACITY >= fade) collie.setAlpha(fade);
    THREADS.push({
      x: ((width / squirtle) * t) % width,
      y: ((height / squirtle) * ceil(t / squirtle)) % height,
      angle: PI / 2,
      color: collie,
      strokeWeight: random(STROKE_WEIGHT_START * 0.5, STROKE_WEIGHT_START),
    });
  }
}

let timer = 0;

function draw() {
  fade += FADE_IN;
  //noize += NOISE_EVOLUTION;
  //background(colors_bg);

  for (let t = 0; t < THREADS.length; t++) {
    const thread = THREADS[t];
    if (OPACITY >= fade) thread.color.setAlpha(fade);
    strokeWeight(thread.strokeWeight);
    if (thread.strokeWeight - STROKE_WEIGHT_DIFF >= STROKE_WEIGHT) {
      thread.strokeWeight -= STROKE_WEIGHT_DIFF;
    } else {
      thread.strokeWeight = STROKE_WEIGHT;
    }
    //fill(thread.color);
    stroke(thread.color);
    updateThread(thread);
  }
  timer++;
  if (timer > FRAME_LIMIT) {
    noLoop();
  }
}

function updateThread(thread) {
  let noisebois = noise(
    thread.x * NOISE_GRANULARITY,
    thread.y * NOISE_GRANULARITY,
    noize
  );
  let xOld = thread.x;
  let yOld = thread.y;
  let xNew = xOld + cos(thread.angle * noisebois) * SPEED;
  let yNew = yOld + sin(thread.angle * noisebois) * SPEED;
  if (xNew <= 0) {
    xOld = width;
    xNew = width - xNew;
  } else if (xNew >= width) {
    xOld = 0;
    xNew = xNew % width;
  }
  if (yNew <= 0) {
    yOld = height;
    yNew = height - yNew;
  } else if (yNew >= height) {
    yOld = 0;
    yNew = yNew % height;
  }
  //line(xOld, yOld, xNew, yNew);
  //circle(thread.x, thread.y, thread.strokeWeight / 2);
  //rect(thread.x, thread.y, thread.strokeWeight / 2, thread.strokeWeight / 2);
  point(thread.x, thread.y);

  thread.x = xNew;
  thread.y = yNew;
}

function clickOnSave() {
  saveCanvas();
}
