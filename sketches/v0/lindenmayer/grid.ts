import p5 from "p5";
import palettesData from "../../../palettes.json";

let cnv: any;
let PALETTE: any;
let COLORS: any;
let BG: any;
let STROKE: any;

const PALETTE_NAME = "onom";

const STROKE_WEIGHT = 2;
const ANGLE_STEP = Math.PI / 2;
const STEP = 1080 / 32;
const DEPTH = 5;
let SYSTEM = "A";
const RULES = [
  {
    symbol: "A",
    rule: "-BF+AFA+FB-",
  },
  {
    symbol: "B",
    rule: "+AF-BFB-FA+",
  },
];

let x = 0;
let y = 0;
let angle = 0;
let POS = 0;

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
    BG.setAlpha(63);
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
    p.translate(STEP / 2, p.height - STEP / 2);
    //p.circle(x, y, 100);
    //p.circle(x, y, STEP * 2);
    //p.rect(x, y, STEP, STEP);
    const SYMBOL = SYSTEM[POS];
    p.point(x, y);

    if (SYMBOL === "F") {
      let x1 = x + STEP * p.cos(angle);
      let y1 = y + STEP * p.sin(angle);
      //p.line(x, y, x1, y1);
      p.line(x, y, x1, y1);
      x = x1;
      y = y1;
    } else if (SYMBOL === "+") {
      angle += ANGLE_STEP;
    } else if (SYMBOL === "-") {
      angle -= ANGLE_STEP;
    } else if (SYMBOL === "A") {
      //p.circle(x, y, 10);
      //angle += p.PI;
    } else if (SYMBOL === "B") {
      //p.rect(x, y, 10, 10);
      //angle -= p.PI;
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
