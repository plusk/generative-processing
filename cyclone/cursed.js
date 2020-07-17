let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "mono";
const STROKE_WEIGHT = 2;
const COUNT = 10000;
const ANGLE_STEP = 0.7; // variance speed (frequency)
const AMP = 50; // variance at center
const EDGE_AMP = 0.15;
const TIGHTNESS = 150;

const beads = [];

function preload() {
  palettes = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  palette = palettes[PALETTE_NAME];
  // const keys = Object.keys(palettes);
  // palette = palettes[keys[(keys.length * Math.random()) << 0]];
  colors = palette["colors"];
  colors_bg = palette["bg"];

  background(colors_bg);
  strokeWeight(STROKE_WEIGHT);
  fill(colors_bg);
  stroke(random(colors));

  for (let i = 0; i < COUNT; i++) {
    beads.push({
      x: 0,
      y: i * 2,
      angle: i * ANGLE_STEP,
      color: color(colors[i % colors.length]),
    });
  }
}

function draw() {
  translate(width / 2, 0);
  for (let i = 0; i < beads.length; i++) {
    const bead = beads[i];
    updateBead(bead);
    drawBead(bead);
  }
}

function drawBead(bead) {
  stroke(bead.color);
  point(bead.x, bead.y);
  //circle(bead.x, bead.y, 100);
}

function updateBead(bead) {
  const yoyo = Math.exp(EDGE_AMP * ((bead.y - height / 2) / TIGHTNESS) ** 2);
  bead.angle += ANGLE_STEP;
  bead.x = sin(bead.angle) * AMP * yoyo;
  bead.y++;
}

function clickOnSave() {
  //saveCanvas();
}
