let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

const PALETTE_NAME = "retro";

const STROKE_WEIGHT = 5;
const ANGLE_STEP = Math.PI / 8;
const STEP = 25;
const DEPTH = 3;
let SYSTEM = "F";
const RULES = [
  {
    symbol: "F",
    rule: "FF+[+F-F-F]-[-F+F+F]",
  },
];

let x = 0;
let y = 0;
let angle = -Math.PI / 2;
let POS = 0;
const STATE_STACK = [];

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  PALETTE = PALETTES[PALETTE_NAME];
  // const PALETTE_KEYS = Object.keys(PALETTES);
  // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BG = color(PALETTE["bg"]);
  STROKE = color(random(COLORS));

  background(BG);
  //BG.setAlpha(63);
  fill(BG);
  //noFill();
  stroke(STROKE);
  strokeWeight(STROKE_WEIGHT);

  rectMode(CENTER);

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = random(COLORS);

  for (let i = 0; i < DEPTH; i++) {
    SYSTEM = construct(SYSTEM);
    console.log(SYSTEM);
  }
}

function draw() {
  stroke(COLORS[0]);
  translate(width / 2, height);
  //circle(x, y, 100);
  //circle(x, y, STEP * 2);
  //rect(x, y, STEP, STEP);
  const SYMBOL = SYSTEM[POS];
  //point(x, y);

  if (SYMBOL === "F") {
    let x1 = x + STEP * cos(angle);
    let y1 = y + STEP * sin(angle);
    line(x, y, x1, y1);
    x = x1;
    y = y1;
  } else if (SYMBOL === "+") {
    angle += random(ANGLE_STEP * 0.9, ANGLE_STEP * 1.1);
  } else if (SYMBOL === "-") {
    angle -= random(ANGLE_STEP * 0.9, ANGLE_STEP * 1.1);
  } else if (SYMBOL === "[") {
    STATE_STACK.push({
      x,
      y,
      angle,
    });
  } else if (SYMBOL === "]") {
    stroke(random(COLORS));
    circle(x, y, STEP / 2);
    const pop = STATE_STACK.pop();
    x = pop.x;
    y = pop.y;
    angle = pop.angle;
  }

  POS++;
  if (POS >= SYSTEM.length) {
    noLoop();
    POS = 0;
  }
}

function construct(system) {
  let constructed = "";
  for (let i = 0; i < system.length; i++) {
    const symbol = system[i];
    let match = false;
    for (let r = 0; r < RULES.length; r++) {
      const rule = RULES[r];
      if (symbol === rule.symbol) {
        constructed += rule.rule;
        match = true;
        break;
      }
    }
    if (!match) constructed += symbol;
  }
  return constructed;
}

function clickOnSave() {
  //saveCanvas();
}
