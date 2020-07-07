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
  stroke(colors_stroke);
}

function draw() {
  circle(width / 2, height / 2, 100);
}

function clickOnSave() {
  //saveCanvas();
}
