let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const RADIUS = 1080 / 4;
const ANGLE_STEP = 0.1;

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  // const keys = Object.keys(palettes);
  // palette = palettes[keys[(keys.length * Math.random()) << 0]];
  COLOR_PALETTE = palette["colors"];
  COLOR_BG = color(palette["bg"]);
  COLOR_STROKE = color(random(COLOR_PALETTE));

  background(COLOR_BG);
  fill(COLOR_BG);
  //COLOR_STROKE.setAlpha(4);
  stroke(COLOR_STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(colors);
}

function draw() {
  translate(width / 2, height / 2);
  for (let r = 0; r < RADIUS; r += STROKE_WEIGHT * 2) {
    for (let a = 0; a < TWO_PI; a += ANGLE_STEP) {
      const x = r * cos(a);
      const y = r * sin(a);
      //point(x, y);
      //bezier(0, 0, 25, 50, 50, 25, 100, 100);
      bezier(0, 0, -width / 2, -height / 2, width / 2, height / 2, x, y);
      //bezier(0, 0, x, y, 0, height, height / 2);
      //circle(x, y, r);
    }
  }
  noLoop();
}

function clickOnSave() {
  //saveCanvas();
}
