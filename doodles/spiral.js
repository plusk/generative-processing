let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "pastella";

function preload() {
  palettes = loadJSON("palettes.json");
}

const threads = [];
let collie;

const STROKE_WEIGHT = 4;
const THREAD_COUNT = 16;
const RADIUS_SPREAD = STROKE_WEIGHT * 1.5;
let ANGLE_DIFF = 1;
const OPACITY_DIFF = 0.015;

const RADIUS_DIFF = 0.003 * RADIUS_SPREAD * THREAD_COUNT;

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  //const keys = Object.keys(palettes);
  //palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  angleMode(DEGREES);

  background(colors_bg);
  strokeWeight(STROKE_WEIGHT);
  fill(colors_bg);

  for (let t = 0; t < THREAD_COUNT; t++) {
    collie = random(colors);
    //collie = colors[t % colors.length];

    threads.push({
      radius: t * RADIUS_SPREAD,
      angle: 0,
      prevX: 0,
      prevY: 0,
      opacity: OPACITY_DIFF * (THREAD_COUNT - t),
      color: collie,
    });
  }
}

let ticker = 0;

function draw() {
  translate(width / 2, height / 2);

  ticker += 0.03;
  let noyze = noise(ticker);
  noyze *= RADIUS_DIFF * 5;
  noyze *= random(-1, 1);

  for (let t = 0; t < threads.length; t++) {
    const thread = threads[t];

    const prevX = thread["prevX"];
    const prevY = thread["prevY"];
    const x = thread["radius"] * cos(thread["angle"]);
    const y = thread["radius"] * sin(thread["angle"]);

    thread["radius"] += RADIUS_DIFF + noyze;
    thread["angle"] += ANGLE_DIFF;
    let opacity = thread["opacity"] + OPACITY_DIFF * (THREAD_COUNT - t);

    thread["prevX"] = x;
    thread["prevY"] = y;
    thread["opacity"] = opacity;

    const cololo = color(thread["color"]);
    cololo.setAlpha(opacity);
    thread["color"] = cololo;
    stroke(cololo);
    line(prevX, prevY, x, y);
    //point(x, y);
  }
}

function updateThread(thread) {}

function clickOnSave() {
  //saveCanvas();
}
