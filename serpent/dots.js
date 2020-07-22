let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "monster";
const MIN_ALPHA = 63;
const MAX_ALPHA = 255;

const STROKE_WEIGHT = 15;
const UNIT = 1080 / 3;
const MAGIC = 4.75;
const ANGELS = [Math.PI / 3.9, Math.PI / 4.5, Math.PI / 5.9, Math.PI / 11];
const MAGIQUE = [15, 10, 6, 2];
const ODD = [true, false, false, false];

let scroll = 0;
const OFFSETS = [];

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  PALETTE = PALETTES[PALETTE_NAME];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  background(BG);
  fill(BG);
  STROKE.setAlpha(MIN_ALPHA);
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  for (let i = 0; i < MAXYNDEX; i++) {
    OFFSETS.push(round(random(DURATION)));
  }
}

let ticker = 0;
const LAYERS = 4;
const MAXNDEX = 3;
const MAXYNDEX = 16;
const DURATION = 120;
const HIGHLIGHTED = [];

function draw() {
  let odd = false;
  const HEIGHT = height + UNIT;
  let yndex = 0;
  for (let y = scroll; y <= HEIGHT; y += UNIT / 4) {
    const WAVE = [];
    if ((ticker + OFFSETS[yndex % MAXYNDEX]) % DURATION === 0) {
      HIGHLIGHTED[yndex] = Math.round((LAYERS - 1) * Math.random());
    }
    let xndex = 0;
    for (let x = 0; x <= width; x += UNIT) {
      const FAN = [];
      if (odd) x += UNIT * 0.5;
      for (let l = 0; l < LAYERS; l++) {
        const diameter = (UNIT * (LAYERS - l + 1)) / LAYERS;
        const stepper =
          (ANGELS[l] / (ODD[l] ? MAGIQUE[l] - 1 : MAGIQUE[l])) * 2;
        const starter = ODD[l] ? 0 : stepper / 2;
        const LAYER = [];
        for (let a = starter; a <= ANGELS[l]; a += stepper) {
          const angle = (TWO_PI / 4) * 3 + a;
          LAYER.push({
            x: x + (diameter * cos(angle)) / 2,
            y: y + (diameter * sin(angle)) / 2,
          });
          if (a != 0) {
            LAYER.push({
              x: x - (diameter * cos(-angle)) / 2,
              y: y - (diameter * sin(-angle)) / 2,
            });
          }
        }
        LAYER.sort((a, b) => a.x - b.x);
        drawDots(x, y, l, diameter, LAYER, HIGHLIGHTED[yndex], xndex, yndex);
        FAN.push(LAYER);
      }
      WAVE.push(FAN);
      if (odd) x -= UNIT * 0.5;
      xndex++;
    }
    odd = !odd;
    yndex++;
  }
  scroll--;
  ticker++;
  saveCanvas();
  if (ticker === 600) {
    noLoop();
  }
}

function drawDots(x, y, l, diameter, dots, HIGHLIGHTED, xndex, yndex) {
  drawingContext.shadowBlur = 0;
  stroke(BG);
  arc(x, y, diameter, diameter, PI, TWO_PI);

  const oddish = yndex % 2;

  const totallayerdots = dots.length * (MAXNDEX + oddish) * 2;
  const alphaRange = MAX_ALPHA - MIN_ALPHA;
  const dotoffset = (totallayerdots / (MAXNDEX + 1)) * xndex;
  const thisticker = ticker + OFFSETS[yndex % MAXYNDEX];

  const thisstroke = color(COLORS[yndex % COLORS.length]);

  beginShape(POINTS);
  for (let i = 0; i < dots.length; i++) {
    if (l === HIGHLIGHTED) {
      const timeFactor = (thisticker % DURATION) / DURATION;
      const timedot = totallayerdots * timeFactor;
      const thispos = dotoffset + i + totallayerdots / 2;
      const yootaro = (2.5067 / 1) * sqrt(TWO_PI);
      const eeek = Math.exp(
        -((thispos - timedot * 2) ** 2) / (0.25 * timedot) ** 2
      );
      //drawingContext.shadowColor = thisstroke;
      //drawingContext.shadowBlur = STROKE_WEIGHT;
      thisstroke.setAlpha(MIN_ALPHA + alphaRange * yootaro * eeek);
    } else {
      thisstroke.setAlpha(MIN_ALPHA);
    }
    stroke(thisstroke);
    const dot = dots[i];
    vertex(dot.x, dot.y);
  }
  endShape();
}

function clickOnSave() {
  //saveCanvas();
}
