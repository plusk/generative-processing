let symmetry = 64;

let symangle = 360 / symmetry;

let frame = 0;
let x, y;

let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "parchment";

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  // const keys = Object.keys(palettes);
  // palette = palettes[keys[(keys.length * Math.random()) << 0]];

  colors = palette["colors"];
  colors_bg = palette["bg"];
  colors_stroke = palette["stroke"];

  background(colors_bg);
  angleMode(DEGREES);

  strokeWeight(3);
  x = width / 2;
  y = height / 2;
}

const STEP = 1.5;

let angle = 0;
let anglestep = 1;
let anglesign = 1;

function draw() {
  translate(width / 2, height / 2);
  frame += 0.5;

  if (x > 0 && x < width && y > 0 && y < height) {
    let startx = x;
    let starty = y;

    let noised = noise(x, y) - 0.5;

    anglestep = random(2);
    if (angle > 180 || angle < 0) anglesign *= -1;
    angle += anglestep * anglesign + noised * 2;
    console.log(angle);

    x += cos(angle) * STEP;
    y += sin(angle) * STEP;

    for (let i = 0; i < symmetry; i++) {
      stroke(colors[i % colors.length]);
      rotate(symangle);
      line(
        startx - width / 2,
        starty - height / 2,
        x - width / 2,
        y - height / 2
      );
      push();
      scale(1, -1);
      line(
        startx - width / 2,
        starty - height / 2,
        x - width / 2,
        y - height / 2
      );
      pop();
    }
  }
}

function clickOnSave() {
  //saveCanvas();
}
