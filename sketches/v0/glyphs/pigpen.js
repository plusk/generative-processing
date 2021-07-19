let cnv;
let palettes;
let palette;
let colors;
let colors_stroke;
let colors_bg;

const PALETTE_NAME = "pastella";

const STROKE_WEIGHT = 3;

const CODE = {
  A: { shape: "L", rotation: 0, hasDot: false },
  B: { shape: "U", rotation: 0, hasDot: false },
  C: { shape: "L", rotation: 90, hasDot: false },
  D: { shape: "U", rotation: -90, hasDot: false },
  E: { shape: "O", rotation: 0, hasDot: false },
  F: { shape: "U", rotation: 90, hasDot: false },
  G: { shape: "L", rotation: -90, hasDot: false },
  H: { shape: "U", rotation: 180, hasDot: false },
  I: { shape: "L", rotation: 180, hasDot: false },
  J: { shape: "L", rotation: 0, hasDot: true },
  K: { shape: "U", rotation: 0, hasDot: true },
  L: { shape: "L", rotation: 90, hasDot: true },
  M: { shape: "U", rotation: -90, hasDot: true },
  N: { shape: "O", rotation: 0, hasDot: true },
  O: { shape: "U", rotation: 90, hasDot: true },
  P: { shape: "L", rotation: -90, hasDot: true },
  Q: { shape: "U", rotation: 180, hasDot: true },
  R: { shape: "L", rotation: 180, hasDot: true },
  S: { shape: "V", rotation: 0, hasDot: false },
  T: { shape: "V", rotation: -90, hasDot: false },
  U: { shape: "V", rotation: 90, hasDot: false },
  V: { shape: "V", rotation: 180, hasDot: false },
  W: { shape: "V", rotation: 0, hasDot: true },
  X: { shape: "V", rotation: -90, hasDot: true },
  Y: { shape: "V", rotation: 90, hasDot: true },
  Z: { shape: "V", rotation: 180, hasDot: true },
  ",": { shape: "", rotation: 0, hasDot: true },
  ".": { shape: "", rotation: 0, hasDot: true },
  "'": { shape: "", rotation: 0, hasDot: true },
  "-": { shape: "", rotation: 0, hasDot: true },
  "(": { shape: "", rotation: 0, hasDot: true },
  ")": { shape: "", rotation: 0, hasDot: true },
  "?": { shape: "", rotation: 0, hasDot: true },
  " ": { shape: "", rotation: 0, hasDot: false },
  "": { shape: "", rotation: 0, hasDot: false },
};

let padding;

let areax;
let areay;

const PRECODES = [
  "The pigpen cipher (alternatively referred to as the masonic cipher, Freemason's cipher, Napoleon cipher, and tic-tac-toe cipher) is a geometric simple substitution cipher, which exchanges letters for symbols which are fragments of a grid. The example key shows one way the letters can be assigned to the grid. The use of symbols instead of letters is no impediment to cryptanalysis, and this system is identical to that of other simple monoalphabetic substitution schemes. Due to the simplicity of the cipher, it is often included in children's books on ciphers and secret writing.",
];

let PRECODED;

let GRIDCOUNT;

let gapfactor = 0.35375 * 1;

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

  background(colors_bg);
  strokeWeight(STROKE_WEIGHT);
  //fill(colors_bg);
  noFill();

  strokeCap(SQUARE);

  angleMode(DEGREES);

  frameRate(1);

  PRECODED = PRECODES[0].toUpperCase();

  padding = 1080 / 8;

  GRIDCOUNT = ceil(sqrt(PRECODED.length));

  jumpx = (width - padding * 2) / (GRIDCOUNT - 1);
  jumpy = (height - padding * 2) / (GRIDCOUNT - 1);
}

function draw() {
  let count = 0;
  let char = "";

  background(colors_bg);

  for (let y = padding; y <= height - padding; y += jumpy) {
    for (let x = padding; x <= width - padding; x += jumpx) {
      char = "";
      stroke(colors[count % colors.length]);
      if (count < PRECODED.length) {
        char = PRECODED[count];
      }
      const charobject = CODE[char];
      console.log(char);
      console.log(charobject);
      drawShape(x, y, jumpx * gapfactor, charobject["shape"], charobject["hasDot"], charobject["rotation"]);
      count++;
    }
  }
  //saveCanvas();
}

function drawShape(x, y, radius, shape, hasDot, rotation) {
  let angles = [];
  if (shape === "L") {
    angles = [45 + 90, 45, 45 - 90];
  } else if (shape === "U") {
    angles = [45 + 180, 45 + 90, 45, 45 - 90];
  } else if (shape === "O") {
    angles = [45 + 180, 45 + 90, 45, 45 - 90, 45 - 180];
  } else if (shape === "V") {
    angles = [45 + 180, [90, 45], 45 - 90];
  }
  push();
  translate(x, y);
  rotate(rotation);
  beginShape();
  for (let i = 0; i < angles.length; i++) {
    if (angles[i].length) {
      let sx = 0 + cos(angles[i][0]) * radius;
      let sy = 0 + sin(angles[i][1]) * radius;
      vertex(sx, sy);
    }
    const a = angles[i];
    let sx = 0 + cos(a) * radius;
    let sy = 0 + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape();
  if (hasDot) {
    strokeWeight(STROKE_WEIGHT * 1.5);
    if (shape === "V") {
      point(0, (sin(-45) * radius) / 2);
    } else {
      point(0, 0);
    }
    strokeWeight(STROKE_WEIGHT);
  }
  pop();
}

function clickOnSave() {
  saveCanvas();
}
