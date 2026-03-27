import p5 from "p5";
import { palettes } from "../../palettes";

/* Enable to make a canvas suitable for A2 paper */
const PRINT_MODE = false;

/* Set a palette */
const PALETTE_NAME = "onom";

/* Choose a random color from the palette for each line */
const RANDOM_STROKE = false;

/* Each line has its own color from the palette */
const PALETTED_STROKE = false;

/* How big the circle will be */
const RADIUS = 400;

/* How many independent lines will be drawn each frame */
const LINE_COUNT = 2;

/* How swiftly the lines will move around (lower is slower) */
const NOISE_SPEED = 0.0015;

/* How opaque the lines will be, lower means more transparent */
/* Lower will be smoother, but also takes longer to fill the circle */
const OPACITY = 0.5;
const STROKE_WEIGHT = 1;

/* Enable to use randomness instead of noise to select line locations */
/* This effectively overrides the remaining config */
const IS_RANDOM = false;

/* Experimental: mirrors lines through the center */
const IS_SYMMETRICAL = true;

/* If not IS_RANDOM: noise will naturally lean towards an angle */
/* Enable this to vary where the angle is, or disable and specify your own */
const RANDOM_BIASED_ANGLE = true;
let BIASED_ANGLE = Math.PI / 2;

/* If not IS_RANDOM: this value effectively says how strong the bias is */
/* A lower value means the bias is strong, higher means near-random lines */
const NOISE_RANDOMNESS = 0.75;

/*

  CONFIG END

*/

let COLORS: p5.Color[], STROKE: any, BG: p5.Color;

new p5((p: p5) => {
  p.setup = () => {
    const cnv = PRINT_MODE ? p.createCanvas(4960, 7016) : p.createCanvas(1080, 1350);
    cnv.mouseClicked(clickOnSave);
    p.pixelDensity(1);

    const PALETTE = palettes[PALETTE_NAME];

    p.colorMode(p.HSL);
    COLORS = PALETTE.colors.map((col: string) => p.color(col));
    BG = p.color(PALETTE.bg);

    /* Sketch-specific setup */
    p.strokeWeight(STROKE_WEIGHT);
    STROKE = p.random(COLORS);
    STROKE.setAlpha(OPACITY * 255);
    p.stroke(STROKE);
    p.background(BG);

    if (RANDOM_BIASED_ANGLE) BIASED_ANGLE = p.random(p.TWO_PI);
    p.noiseDetail(4, NOISE_RANDOMNESS);
  };

  p.draw = () => {
    /* Moves the origin of the coordinate system to the center of the canvas */
    /* Rotate based on the bias angle, be that random or not */
    p.translate(p.width / 2, p.height / 2);
    p.rotate(BIASED_ANGLE);

    /* For every line to be rendered each frame */
    for (let i = 0; i < LINE_COUNT; i++) {
      /* Select two random or noised angles on the circle */
      let a1, a2;
      if (IS_RANDOM) {
        a1 = p.random(p.TWO_PI);
        a2 = p.random(p.TWO_PI);
      } else if (IS_SYMMETRICAL) {
        a1 = p.TWO_PI * p.noise(0, p.frameCount * NOISE_SPEED) + (i * p.TWO_PI) / LINE_COUNT;
        a2 = p.TWO_PI * p.noise(1, p.frameCount * NOISE_SPEED) + (i * p.TWO_PI) / LINE_COUNT;
      } else {
        a1 = p.TWO_PI * p.noise(i, p.frameCount * NOISE_SPEED);
        a2 = p.TWO_PI * p.noise(i + LINE_COUNT, p.frameCount * NOISE_SPEED);
      }

      /* Use the two angles to determine two points on the circle */
      const x1 = RADIUS * p.cos(a1);
      const y1 = RADIUS * p.sin(a1);
      const x2 = RADIUS * p.cos(a2);
      const y2 = RADIUS * p.sin(a2);

      /* If random, choose a new color for each line */
      if (RANDOM_STROKE) {
        const randomColor = p.random(COLORS);
        randomColor.setAlpha(OPACITY * 255);
        p.stroke(randomColor);
      } else if (PALETTED_STROKE) {
        const palettedColor = COLORS[i % COLORS.length];
        palettedColor.setAlpha(OPACITY * 255);
        p.stroke(palettedColor);
      }

      /* Draw a line between the two points */
      p.line(x1, y1, x2, y2);
    }
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
