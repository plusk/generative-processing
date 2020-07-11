let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "pastella";
const STROKE_WEIGHT = 2;
const THREAD_COUNT = 100;
const SPEED = 10;
const SPEED_DIFF = 1;
const OPACITY = 255;

const THREADS = [];

let collie;

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

  collie = color(random(colors));

  collie.setAlpha(OPACITY);

  stroke(collie);

  const xRandy = random(-SPEED, SPEED);
  const yRandy = random(-SPEED, SPEED);

  const squirtle = sqrt(THREAD_COUNT);

  for (let t = 0; t < THREAD_COUNT; t++) {
    THREADS.push({
      x: ((width / squirtle) * (t + 0.5)) % width,
      y: ((height / squirtle) * floor((t + 0.5) / squirtle)) % height,
      xSpeed: xRandy,
      ySpeed: yRandy,
    });
  }
}

function draw() {
  for (let t = 0; t < THREADS.length; t++) {
    const thread = THREADS[t];
    //point(thread["x"], thread["y"]);
    circle(thread.x, thread.y, 100);

    updateThread(t, thread);
  }
}

function updateThread(t, thread) {
  thread.xSpeed += random(-SPEED_DIFF, SPEED_DIFF);
  thread.ySpeed += random(-SPEED_DIFF, SPEED_DIFF);
  const xNew = thread.x + thread.xSpeed;
  const yNew = thread.y + thread.ySpeed;
  line(thread.x, thread.y, xNew, yNew);
  thread.x = xNew;
  thread.y = yNew;
}

function clickOnSave() {
  //saveCanvas();
}
