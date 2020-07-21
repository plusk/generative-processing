let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 10;
const UNIT = 1080 / 3;

const MAGIC = 4.75;

let scroll = 0;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  background(BG);
  fill(BG);
  //STROKE.setAlpha(5);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);
}

function draw() {
  //circle(width / 2, height / 2, 100);
  // beginShape(); POINTS, LINES, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, QUADS, QUAD_STRIP
  let odd = false;
  const HEIGHT = height + UNIT;
  for (let y = scroll; y <= HEIGHT; y += UNIT / 4) {
    for (let x = 0; x <= width; x += UNIT) {
      if (odd) x += UNIT * 0.5;
      const LAYERS = 4;

      for (let l = 0; l < LAYERS; l++) {
        beginShape(POINTS);
        const diameter = (UNIT * (LAYERS - l + 1)) / LAYERS;
        stroke(BG);
        //stroke("#ff0000");
        arc(x, y, diameter, diameter, PI, TWO_PI);
        stroke(STROKE);
        //const MAGIQUE = [28.8, 20, 15.2, 11.4];
        const MAGIQUE = [28.8, 20, 15.2, 11.4];
        for (let a = 0; a <= PI / 2; a += (0.5 * PI) / MAGIQUE[l]) {
          const angle = (TWO_PI / 4) * 3 + a;
          const xDot = x + (diameter * cos(angle)) / 2;
          const yDot = y + (diameter * sin(angle)) / 2;
          vertex(xDot, yDot);
          const xDottwo = x - (diameter * cos(-angle)) / 2;
          const yDottwo = y - (diameter * sin(-angle)) / 2;
          vertex(xDottwo, yDottwo);
          //line(x, y, xDot, yDot);
        }
        endShape(CLOSE);
      }
      if (odd) x -= UNIT * 0.5;
    }
    odd = !odd;
  }
  //scroll--;
}

function clickOnSave() {
  //saveCanvas();
}
