import p5 from "p5";
import palettesData from "../../../palettes.json";

let cnv: any;
let PALETTE: any;
let COLORS: any;
let BG: any;
let STROKE: any;

const PALETTE_NAME = "genesis";

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
const STATE_STACK: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = palettesData[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettesData);
    // PALETTE = palettesData[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);
    STROKE = p.color(p.random(COLORS));

    p.background(BG);
    //BG.setAlpha(63);
    p.fill(BG);
    //p.noFill();
    p.stroke(STROKE);
    p.strokeWeight(STROKE_WEIGHT);

    (p as any).rectMode((p as any).CENTER);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = p.random(COLORS);

    for (let i = 0; i < DEPTH; i++) {
      SYSTEM = construct(SYSTEM);
      console.log(SYSTEM);
    }
  };

  p.draw = () => {
    p.stroke(COLORS[0]);
    p.translate(p.width / 2, p.height);
    //p.circle(x, y, 100);
    //p.circle(x, y, STEP * 2);
    //p.rect(x, y, STEP, STEP);
    const SYMBOL = SYSTEM[POS];
    //p.point(x, y);

    if (SYMBOL === "F") {
      let x1 = x + STEP * p.cos(angle);
      let y1 = y + STEP * p.sin(angle);
      p.line(x, y, x1, y1);
      x = x1;
      y = y1;
    } else if (SYMBOL === "+") {
      angle += p.random(ANGLE_STEP * 0.9, ANGLE_STEP * 1.1);
    } else if (SYMBOL === "-") {
      angle -= p.random(ANGLE_STEP * 0.9, ANGLE_STEP * 1.1);
    } else if (SYMBOL === "[") {
      STATE_STACK.push({
        x,
        y,
        angle,
      });
    } else if (SYMBOL === "]") {
      p.stroke(p.random(COLORS));
      p.circle(x, y, STEP / 2);
      const pop = STATE_STACK.pop();
      x = pop.x;
      y = pop.y;
      angle = pop.angle;
    }

    POS++;
    if (POS >= SYSTEM.length) {
      p.noLoop();
      POS = 0;
    }
  };

  const construct = (system: string) => {
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
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
