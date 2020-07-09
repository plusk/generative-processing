let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "sydney";

function preload() {
  palettes = loadJSON("palettes.json");
}

const threads = [];
let collie;
let ANGLE = Math.random() * 360;
let ANGLE_STEP = 15;

const STROKE_WEIGHT = 4;
const THREAD_COUNT = 16;
const RADIUS_SPREAD = STROKE_WEIGHT * 1.5;
const OPACITY_DIFF = 0.015;

const RADIUS_STEP = 0.003 * RADIUS_SPREAD * THREAD_COUNT;

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  //const keys = Object.keys(palettes);
  //palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  drawingContext.shadowBlur = 10;

  angleMode(DEGREES);

  background(colors_bg);
  strokeWeight(STROKE_WEIGHT);
  fill(colors_bg);

  for (let t = 0; t < THREAD_COUNT; t++) {
    collie = color(random(colors));
    const opacity = (127 / THREAD_COUNT) * (THREAD_COUNT - t);
    collie.setAlpha(255);
    //collie = colors[t % colors.length];

    threads.push({
      prevX: t * RADIUS_SPREAD * cos(0),
      prevY: t * RADIUS_SPREAD * sin(0),
      color: collie,
    });
  }
}

let ticker = 0;

function draw() {
  ticker += 0.005;

  translate(width / 2, height / 2);

  const noyze = noise(ticker) * random(-1, 1);
  const angleDiff = ANGLE_STEP * noyze;
  ANGLE += ANGLE_STEP * noyze;

  push();

  for (let t = 0; t < threads.length; t++) {
    const thread = threads[t];

    rotate(angleDiff);

    const prevX = thread["prevX"];
    const prevY = thread["prevY"];
    const x = prevX + cos(ANGLE);
    const y = prevY + sin(ANGLE);

    thread["prevX"] = x;
    thread["prevY"] = y;

    stroke(thread["color"]);
    line(prevX, prevY, x, y);
    //point(x, y);
  }

  pop();
}

function updateThread(thread) {}

function clickOnSave() {
  //saveCanvas();
}
