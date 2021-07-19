let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "speis"; // mono, sydney, pastella, speis

const STROKE_WEIGHT_START = 10;
let STROKE_WEIGHT = STROKE_WEIGHT_START;

const ANGLE = Math.PI * (3 - Math.sqrt(5));
let SPREAD = 20;
const MIN_LIGHTNESS = 0.15;
const OPACITY = 1;
const AMOUNT = 5;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  frameRate(30);

  colorMode(HSL);
  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);

  background(BG);
  fill(BG);
  noFill();
  strokeWeight(STROKE_WEIGHT);
}

let x0 = 0;
let y0 = 0;

let TICK_RATE = 1;
let ticker = 0;
const FRAME_LIMIT = 300;

const BACKLOG = [];

function draw() {
  translate(width / 2, height / 2);
  const FRAME_FACTOR = frameCount / FRAME_LIMIT;
  for (let i = 0; i < TICK_RATE; i++) {
    STROKE_WEIGHT = random(
      STROKE_WEIGHT_START - STROKE_WEIGHT_START * FRAME_FACTOR,
      STROKE_WEIGHT_START + 5 * STROKE_WEIGHT_START * FRAME_FACTOR
    );
    TICK_RATE += 0.01;
    SPREAD += 0.1;
    scale(random(1 - 0.5 * FRAME_FACTOR, 1));
    strokeWeight(STROKE_WEIGHT);
    const coleur = color(COLORS[ticker % COLORS.length]);
    const a = ANGLE * ticker;
    const r = SPREAD * sqrt(ticker);
    const x1 = r * cos(a);
    const y1 = r * sin(a);
    //circle(x1, y1, 10);
    //line(x0, y0, x1, y1);
    point(x0, y0);
    drawingContext.shadowColor = coleur;
    stroke(coleur);
    point(x1, y1);
    drawingContext.shadowBlur = STROKE_WEIGHT;
    strokeWeight(STROKE_WEIGHT / 5);
    BACKLOG[ticker % AMOUNT] = { x0, y0 };
    if (ticker > AMOUNT - 1) {
      const sx = BACKLOG[(ticker + 1) % AMOUNT].x0;
      const sy = BACKLOG[(ticker + 1) % AMOUNT].y0;
      //line(sx, sy, x1, y1);
      curveBetween(sx, sy, x1, y1, 0.25, 0.25, 0);
      point(sx, sy);
    }
    x0 = x1;
    y0 = y1;
    ticker++;
  }

  if (frameCount > FRAME_LIMIT) {
    console.log("donezo");
    noLoop();
    //saveCanvas();
  }
}

function curveBetween(x1, y1, x2, y2, d, h, flip) {
  //find two control points off this line
  var original = p5.Vector.sub(createVector(x2, y2), createVector(x1, y1));
  var inline = original
    .copy()
    .normalize()
    .mult(original.mag() * d);
  var rotated = inline
    .copy()
    .rotate(radians(90) + flip * radians(180))
    .normalize()
    .mult(original.mag() * h);
  var p1 = p5.Vector.add(p5.Vector.add(inline, rotated), createVector(x1, y1));
  //line(x1, y1, p1.x, p1.y); //show control line
  rotated.mult(-1);
  var p2 = p5.Vector.add(
    p5.Vector.add(inline, rotated).mult(-1),
    createVector(x2, y2)
  );
  //line(x2, y2, p2.x, p2.y); //show control line
  bezier(x1, y1, p1.x, p1.y, p2.x, p2.y, x2, y2);
}

function clickOnSave() {
  saveCanvas();
}
