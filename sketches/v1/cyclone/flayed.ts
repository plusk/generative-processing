import p5 from "p5";
import { palettes } from "../../../palettes";

const PALETTE_NAME = "termos";
const STROKE_WEIGHT = 2;
const COUNT = 100;
const AMP = 100; // variance at center
const EDGE_AMP = 0.15;
const TIGHTNESS = 150;

let cnv: any;
let palette: any;
let colors: any[];
let colors_bg: any;

const beads: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettes[PALETTE_NAME];
    // const keys = Object.keys(palettes);
    // palette = (palettes)[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = palette["bg"];

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);
    p.stroke(p.random(colors));

    for (let i = 0; i < COUNT; i++) {
      beads.push({
        x: 0,
        y: i * 2,
        angle: (p.QUARTER_PI / COUNT) * i,
        color: p.color(colors[i % colors.length]),
      });
    }
  };

  p.draw = () => {
    p.translate(p.width / 2, 0);
    for (let i = 0; i < beads.length; i++) {
      const bead = beads[i];
      updateBead(bead);
      drawBead(bead);
      if (bead.y > p.height) {
        p.noLoop();
      }
    }
  };

  const drawBead = (bead: any) => {
    p.stroke(bead.color);
    p.point(bead.x, bead.y);
    //p.circle(bead.x, bead.y, 100);
  };

  const updateBead = (bead: any) => {
    const yoyo = Math.exp(EDGE_AMP * ((bead.y - p.height / 2) / TIGHTNESS) ** 2);
    bead.angle += p.PI;
    bead.x = p.sin(bead.angle) * AMP * yoyo;
    bead.y++;
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
