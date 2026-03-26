import p5 from "p5";
import palettesData from "../../../palettes.json";

/* Enable to make a canvas suitable for A2 paper */
const PRINT_MODE = false;

/* Get a random palette or choose a specific one from palettes.json */
const RANDOM_PALETTE = false;
const PALETTE_NAME = "onom";

/* Choose a random color from the palette for each line */
const RANDOM_STROKE = false;

/* Each line has its own color from the palette */
const PALETTED_STROKE = false;

/* How big the circle will be */
const RADIUS = 400;

/* How many independent lines will be drawn each frame */
const LINE_COUNT = 1;

/* How swiftly the lines will move around (lower is slower) */
const NOISE_SPEED = 0.0015;

/* How opaque the lines will be, lower means more transparent */
/* Lower will be smoother, but also takes longer to fill the circle */
const OPACITY = 1;
const STROKE_WEIGHT = 1;

/* Enable to use randomness instead of noise to select line locations */
/* This effectively overrides the remaining config */
const IS_RANDOM = false;

/* Experimental: mirrors lines through the center */
const IS_SYMMETRICAL = false;

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

let COLORS: any[], STROKE: any, BG: any;

new p5((p: p5) => {
  p.setup = () => {
    const cnv = PRINT_MODE ? p.createCanvas(4960, 7016) : p.createCanvas(1080, 1350);
    cnv.mouseClicked(clickOnSave);
    p.pixelDensity(1);

    /* Get colors from the palettes */
    const PALETTE_KEYS = Object.keys(palettesData);
    const RANDOM_PALETTE_NAME =
      PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0];
    const PALETTE = !RANDOM_PALETTE
      ? (palettesData as any)[PALETTE_NAME]
      : (palettesData as any)[RANDOM_PALETTE_NAME];
    console.log("Palette name: ", RANDOM_PALETTE_NAME);

    p.colorMode(p.HSL);
    COLORS = PALETTE["colors"].map((col: string) => p.color(col));
    BG = p.color(PALETTE.bg);

    /* Sketch-specific setup */
    p.strokeWeight(STROKE_WEIGHT);
    STROKE = p.random(COLORS);
    STROKE.setAlpha(OPACITY);
    p.stroke(STROKE);
    p.background(BG);

    RANDOM_BIASED_ANGLE && (BIASED_ANGLE = p.random(p.TWO_PI));
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
        a1 =
          p.TWO_PI * p.noise(0, p.frameCount * NOISE_SPEED) + (i * p.TWO_PI) / LINE_COUNT;
        a2 =
          p.TWO_PI * p.noise(1, p.frameCount * NOISE_SPEED) + (i * p.TWO_PI) / LINE_COUNT;
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
        randomColor.setAlpha(OPACITY);
        p.stroke(randomColor);
      } else if (PALETTED_STROKE) {
        const palettedColor = COLORS[i % COLORS.length];
        palettedColor.setAlpha(OPACITY);
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
