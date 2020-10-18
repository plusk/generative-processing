let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 10;
const WAVE_COUNT = 50;
const AMP = 1000;
const GRAN = 0.0005;
const EVO = 0.005;

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

  for (let y = 0; y <= height; y += height / WAVE_COUNT) {
    stroke(colors[y % colors.length]);
    beginShape(POINTS);
    for (let x = 0; x <= width; x += STROKE_WEIGHT * 2) {
      let noisebois = (noise(x * GRAN, y * GRAN, z) - 0.5) * AMP;
      const yNew = y + noisebois;
      vertex(x, yNew);
    }
    endShape();
  }
}

function clickOnSave() {
  //saveCanvas();
}
