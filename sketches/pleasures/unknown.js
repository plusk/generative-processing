let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "symmeblu";

const STROKE_WEIGHT = 2;
const WAVE_COUNT = 100;
const PADDING = 200;
const AMP = 100;
const TIGHTNESS = 150;
const EVO = 0.01;

let z = 0;

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
  stroke(random(colors));
}

function draw() {
  z += EVO;
  background(colors_bg);

  for (let y = PADDING; y < height - PADDING; y += height / WAVE_COUNT) {
    beginShape();
    fill(colors[Math.round(y) % colors.length]);
    for (let x = PADDING; x < width - PADDING; x += 5) {
      let noisebois = noise(x * 0.01, y * 0.01, z) * AMP;
      let yohann = Math.exp(-1 * ((x - width / 2) / TIGHTNESS) ** 2);
      const yNew = y - noisebois * yohann;
      vertex(x, yNew);
    }
    endShape(CLOSE);
  }
}

function clickOnSave() {
  //saveCanvas();
}
