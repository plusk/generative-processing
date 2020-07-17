let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "termos";
const STROKE_WEIGHT = 4; // 2-4 optimal for 5 count?
const COUNT = 1350 / 2;
const ANGLE_STEP = 0.2; // frequency
const AMP = 100; // variance at center
const EDGE_AMP = 0.15;
const TIGHTNESS = 150;
const OPACITY_CENTER = 300; // higher than 255 means higher on edges
const BEAD_OFFSET_Y = 2; // min 1, avoid matching stroke weight?

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
      x: 0, //overriden by formula regardless
      y: i * BEAD_OFFSET_Y,
      angle: random(TWO_PI),
      //angleStep: random(ANGLE_STEP_MIN, ANGLE_STEP_MAX),
      color: color(colors[i % colors.length]), // alt: color(random(colors))
    });
  }
}

function draw() {
  translate(width / 2, 0);
  for (let i = 0; i < beads.length; i++) {
    const bead = beads[i];
    updateBead(bead);
    if (bead.y > height) {
      noLoop();
      //saveCanvas();
    }
  }
}

function updateBead(bead) {
  const yoyo = Math.exp(EDGE_AMP * ((bead.y - height / 2) / TIGHTNESS) ** 2);
  const yoyangle = Math.exp(
    EDGE_AMP * ((bead.y - height / 2) / (TIGHTNESS * 0.75)) ** 2
  );
  bead.angle += ANGLE_STEP * yoyangle; // changes everything
  bead.x = sin(bead.angle) * AMP * yoyo;
  bead.y++;

  bead.color.setAlpha(OPACITY_CENTER / yoyo);
  stroke(bead.color);
  strokeWeight(STROKE_WEIGHT * yoyo);
  point(bead.x, bead.y);
  //circle(bead.x, bead.y, 100);
}

function clickOnSave() {
  saveCanvas();
}
