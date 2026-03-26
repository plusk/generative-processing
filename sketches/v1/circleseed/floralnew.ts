import p5 from "p5";
import palettesData from "../../../palettes.json";

const PALETTE_NAME = "genesis"; // retro

const STROKE_WEIGHT = 2;
const POLY_COUNT = 6;
const MIN_SIDES = 3;
const MAX_SIDES = 9;
const MIN_RADIUS = 60;
const MAX_RADIUS = 440;
const ANGLE_STEP = 2.25;
const NOISE_DETAIL = 0.0075;
const LINE_FACTOR = 2;

const FRAME_LIMIT = 120;

const STEP = STROKE_WEIGHT;

let cnv: any;
let PALETTE: any;
let COLORS: any[];
let BG: any;

const RINGS: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = (palettesData as any)[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(palettesData);
    // PALETTE = (palettesData as any)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);

    p.background(BG);
    p.fill(BG);
    p.strokeWeight(STROKE_WEIGHT);

    p.colorMode(p.HSL);
    p.drawingContext.shadowBlur = STROKE_WEIGHT;

    const xCenter = p.width / 2;
    const yCenter = p.height / 2;

    for (let r = 0; r < POLY_COUNT; r++) {
      const RING: any[] = [];
      const t = (r + 1) / POLY_COUNT;
      const radius = MIN_RADIUS + (MAX_RADIUS - MIN_RADIUS) * t;
      const sides = Math.floor(p.random(MIN_SIDES, MAX_SIDES + 1));
      const coleur = p.color(p.random(COLORS));

      const totalPoints = Math.floor(radius * LINE_FACTOR);
      for (let i = 0; i < totalPoints; i++) {
        const frac = i / totalPoints;
        const edgePos = frac * sides;
        const edgeIndex = Math.floor(edgePos);
        const edgeFrac = edgePos - edgeIndex;

        const a1 = (edgeIndex / sides) * p.TWO_PI;
        const a2 = ((edgeIndex + 1) / sides) * p.TWO_PI;

        const x = p.lerp(
          xCenter + radius * p.cos(a1),
          xCenter + radius * p.cos(a2),
          edgeFrac,
        );
        const y = p.lerp(
          yCenter + radius * p.sin(a1),
          yCenter + radius * p.sin(a2),
          edgeFrac,
        );
        const a = p.lerp(a1, a2, edgeFrac);

        RING.push({
          x,
          y,
          a,
          color: coleur,
          step: p.random(STEP * 0.5, STEP * 1),
        });
      }
      RINGS.push(RING);
    }
  };

  p.draw = () => {
    for (let r = 0; r < RINGS.length; r++) {
      const RING = RINGS[r];
      const HUE = p.hue(RING[0].color);
      const SATURATION = p.saturation(RING[0].color);
      const LIGHTNESS = p.lightness(RING[0].color);
      const coleur = p.color(
        HUE,
        (SATURATION / FRAME_LIMIT) * p.frameCount,
        (LIGHTNESS / FRAME_LIMIT) * p.frameCount,
        (5 / FRAME_LIMIT) * p.frameCount,
      );
      p.stroke(coleur);
      //p.drawingContext.shadowColor = coleur;

      for (let l = 0; l < RING.length; l++) {
        const LINE = RING[l];
        drawLine(LINE);
      }
    }
    if (p.frameCount > FRAME_LIMIT) {
      p.noLoop();
    }
  };

  const drawLine = (LINE: any) => {
    const noyzed = p.noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
    const angle = LINE.a * noyzed * ANGLE_STEP;

    const x = LINE.x + LINE.step * p.cos(p.HALF_PI + angle);
    const y = LINE.y + LINE.step * p.sin(p.HALF_PI + angle);
    p.line(LINE.x, LINE.y, x, y);
    LINE.x = x;
    LINE.y = y;
    LINE.a = angle;
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
