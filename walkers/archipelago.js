let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "warm";
const STROKE_WEIGHT = 2;
const THREAD_COUNT = 10 * 10;
const SPEED = 10;
const SPEED_DIFF = 5;
const NOISE_GRANULARITY = 0.005;
const OPACITY = 255;

const THREADS = [];

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  //const keys = Object.keys(palettes);
  //palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  background(colors_bg);
  strokeWeight(STROKE_WEIGHT);
  fill(colors_bg);

  const angRandy = random(TWO_PI);

  const squirtle = sqrt(THREAD_COUNT);

  for (let t = 0; t < THREAD_COUNT; t++) {
    const collie = color(random(colors));
    collie.setAlpha(OPACITY);

    THREADS.push({
      x: ((width / squirtle) * (t + 0.5)) % width,
      y: ((height / squirtle) * (0.5 + ceil(t / squirtle))) % height,
      angle: angRandy,
      color: collie,
    });
  }
}

function draw() {
  //background(colors_bg);

  for (let t = 0; t < THREADS.length; t++) {
    const thread = THREADS[t];
    stroke(thread.color);
    //circle(thread.x, thread.y, 100);
    //point(thread["x"], thread["y"]);
    updateThread(thread);
  }
}

function updateThread(thread) {
  let noize = noise(thread.x * NOISE_GRANULARITY, thread.y * NOISE_GRANULARITY);
  noize -= noize / 2;
  const xNew =
    thread.x + cos(thread.angle * noize) * SPEED_DIFF * random(-1, 1);
  const yNew =
    thread.y + sin(thread.angle * noize) * SPEED_DIFF * random(-1, 1);
  line(thread.x, thread.y, xNew, yNew);
  thread.x = xNew;
  thread.y = yNew;
}

function clickOnSave() {
  //saveCanvas();
}
