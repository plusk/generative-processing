import p5 from "p5";
import palettesData from "../../../palettes.json";

const PALETTE_NAME = "termos";
const STROKE_WEIGHT = 2; // 2-4 optimal for 5 count?
const COUNT = 100;
const SPEED = 10; // rate of y growth, about a tenth of COUNT works
const ANGLE_STEP = 0.05; // frequency
const AMP = 100; // variance at center
const EDGE_AMP = 0.15;
const TIGHTNESS = 150;
const OPACITY_CENTER = 255; // higher than 255 means higher on edges
const BEAD_OFFSET_Y = 2; // min 1, avoid matching stroke weight?

let cnv: any;
let palette: any;
let colors: any[];
let colors_bg: any;

const beads: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = (palettesData as any)[PALETTE_NAME];
    // const keys = Object.keys(palettesData);
    // palette = (palettesData as any)[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = palette["bg"];

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);
    p.stroke(p.random(colors));
    (p.drawingContext as CanvasRenderingContext2D).shadowBlur = STROKE_WEIGHT;

    const randy = p.random(p.TWO_PI);
    for (let i = 0; i < COUNT; i++) {
      beads.push({
        x: 0, //overriden by formula regardless
        y: i * BEAD_OFFSET_Y,
        angle: randy + i * p.random(ANGLE_STEP),
        color: p.color(colors[i % colors.length]),
        //color: p.color(p.random(colors)),
      });
    }
  };

  p.draw = () => {
    p.translate(p.width / 2, 0);
    for (let i = 0; i < beads.length; i++) {
      const bead = beads[i];
      updateBead(bead);
      if (bead.y > p.height) {
        p.noLoop();
        //p.saveCanvas();
      }
    }
  };

  const updateBead = (bead: any) => {
    const yoyo = Math.exp(EDGE_AMP * ((bead.y - p.height / 2) / TIGHTNESS) ** 2);
    const yoyangle = Math.exp(EDGE_AMP * ((bead.y - p.height / 2) / TIGHTNESS) ** 2);
    bead.angle += ANGLE_STEP * yoyangle; // changes everything
    bead.x = p.sin(bead.angle) * AMP * yoyo;

    bead.color.setAlpha(OPACITY_CENTER / yoyo);
    p.stroke(bead.color);
    (p.drawingContext as CanvasRenderingContext2D).shadowColor = bead.color;
    p.strokeWeight(STROKE_WEIGHT + p.random(STROKE_WEIGHT, STROKE_WEIGHT * 2) * yoyo);
    p.point(bead.x, bead.y);
    //p.circle(bead.x, bead.y, 100);
    bead.y += SPEED;
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
