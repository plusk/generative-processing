let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "termos";

const STROKE_WEIGHT = 1;
const WAVE_COUNT = 100;
const PADDING = 200;
const AMP = 100;
const TIGHTNESS = 150;
const EVO = 0.01;

let z = 0;

let WAVE_COLORS = [];

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  //const keys = Object.keys(palettes);
  //palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  background(colors_bg);
  strokeWeight(STROKE_WEIGHT);
  fill(colors_bg);
  stroke("white");

  for (let i = 0; i < WAVE_COUNT; i++) {
    WAVE_COLORS.push(random(colors));
  }
}

function draw() {
  z += EVO;
  background(colors_bg);

  let a = 0;

  for (let y = PADDING; y < height - PADDING; y += height / WAVE_COUNT) {
    beginShape();
    fill(WAVE_COLORS[a]);
    for (let x = PADDING; x < width - PADDING; x += 5) {
      let noisebois = noise(x * 0.01, y * 0.01, z) * AMP;
      let yohann = Math.exp(-1 * ((x - width / 2) / TIGHTNESS) ** 2);
      const yNew = y - noisebois * yohann;
      vertex(x, yNew);
    }
    endShape(CLOSE);
    a += 1;
  }
}

function clickOnSave() {
  //saveCanvas();
}
