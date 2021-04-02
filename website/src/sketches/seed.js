import PALETTES from "./palettes.json";
import p5 from "p5";

const drawSketch = (id) => {
  new p5(s, id);
};

export default drawSketch;

const s = (p) => {
  let cnv;
  let PALETTE;
  let COLORS;
  let BG;

  const PALETTE_NAME = "genesis";

  const STROKE_WEIGHT = 2;
  const RING_COUNT = 20;
  const ANGLE_STEP = 2.25;
  const RADIUS_MIN = 25;
  const RADIUS = 100;
  const NOISE_DETAIL = 0.015;
  const LINE_FACTOR = 2;

  const FRAME_LIMIT = 180;

  const STEP = STROKE_WEIGHT;
  const RINGS = [];

  p.setup = () => {
    cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    PALETTE = PALETTES[PALETTE_NAME];
    // const PALETTE_KEYS = Object.keys(PALETTES);
    // PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    COLORS = PALETTE["colors"];
    BG = p.color(PALETTE["bg"]);

    p.background(BG);
    p.fill(BG);
    p.strokeWeight(STROKE_WEIGHT);

    p.colorMode(p.HSL);
    p.drawingContext.shadowBlur = STROKE_WEIGHT;

    for (let r = 0; r < RING_COUNT; r++) {
      const RING = [];
      const xCenter = p.random(p.width);
      const yCenter = p.random(RADIUS / 2, p.height);
      const coleur = p.color(COLORS[r % COLORS.length]);
      const raddy = p.random(RADIUS_MIN, RADIUS);
      for (
        let a = p.TWO_PI / (raddy * LINE_FACTOR);
        a < p.TWO_PI;
        a += p.TWO_PI / (raddy * LINE_FACTOR)
      ) {
        const x = xCenter + p.random(raddy / 4, raddy) * p.cos(a);
        const y = yCenter + p.random(raddy / 4, raddy) * p.sin(a);
        RING.push({
          x,
          y,
          a,
          color: coleur,
          step: p.random(STEP * 0.75, STEP * 1.25),
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
        (LIGHTNESS / FRAME_LIMIT) * p.frameCount
      );
      p.stroke(coleur);
      //drawingContext.shadowColor = coleur;

      for (let l = 0; l < RING.length; l++) {
        const LINE = RING[l];
        drawLine(LINE);
      }
    }
    if (p.frameCount > FRAME_LIMIT) {
      p.noLoop();
    }
  };

  function drawLine(LINE) {
    const noyzed = p.noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
    const angle = LINE.a * noyzed * ANGLE_STEP;

    const x = LINE.x + LINE.step * p.cos(p.HALF_PI + angle);
    const y = LINE.y + LINE.step * p.sin(p.HALF_PI + angle);
    p.line(LINE.x, LINE.y, x, y);
    LINE.x = x;
    LINE.y = y;
    LINE.a = angle;
  }

  function clickOnSave() {
    p.saveCanvas();
  }
};
