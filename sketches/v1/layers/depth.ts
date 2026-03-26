import p5 from "p5";
import palettesData from "../../../palettes.json";

/* Enable to make a canvas suitable for A2 paper */
const PRINT_MODE = false;

/* Get a random palette or choose a specific one from palettes.json */
const RANDOM_PALETTE = false;
const PALETTE_NAME = "stronk";

const LAYER_COUNT = 50;

/* The average radius of the full shape */
const MEAN_RADIUS = 1350; // 675 or 1350 are my favorites

/* Enable strokes on the border of each layer, specify weight if enabled */
const HAS_STROKE = false;
const STROKE_WEIGHT = 1;

/* Layers are light to dark (from the center), enable to reverse it */
const INVERTED_GRADIENT = true;

/* Instead of gradient from light to dark, go from the fill color to dark */
const CAP_LIGHTNESS = true;

/* The degree to which noise affects the layers */
/* Low values are blobby, high values are spikey */
const NOISE_MULTIPLIER = 0.15;

/* The speed at which the layers */
const NOISE_SPEED = 0.005;

/* Mirror the layers on either axis */
const SYMMETRICAL_X = false;
const SYMMETRICAL_Y = false;

/* Background is determined by the gradient, but these flags may override it */
/* If both flags are true, palette background will be used */
const USE_FILL_AS_BACKGROUND = true;
const USE_PALETTE_BACKGROUND = false;

/* The amount of points that make up each layer, lower means "pointier" */
/* For example 3 points mean triangular layers, 4 means squares */
/* Higher might not be noticable, but will make for smoother borders */
const POINT_COUNT = 500;

/* Mild rotation, negative speed rotates counter-clockwise */
const ROTATION_SPEED = 0;

/*

  CONFIG END

*/

let COLORS: any[], FILL: any, BG: any;

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
    FILL = p.random(COLORS);
    HAS_STROKE ? p.stroke(FILL) : p.noStroke();
  };

  p.draw = () => {
    /* Move coordinate system to center of canvas for easier trigonometry */
    p.translate(p.width / 2, p.height / 2);

    /* Home-made helper function to select background based on config */
    drawBackground();

    /* Because layers are drawn in sequence, draw large layers on bottom first */
    for (let i = LAYER_COUNT; i > 0; i--) {
      drawLayer((MEAN_RADIUS / LAYER_COUNT) * i, i);
    }
  };

  const drawBackground = () => {
    if (INVERTED_GRADIENT) {
      CAP_LIGHTNESS ? p.background(FILL) : p.background(255);
    } else {
      p.background(0);
    }
    USE_FILL_AS_BACKGROUND && p.background(FILL);
    USE_PALETTE_BACKGROUND && p.background(BG);
  };

  const drawLayer = (r: any, i: any) => {
    /* A number from 0 to 1, where the middle layer would have 0.5 */
    const layerColorFactor = INVERTED_GRADIENT
      ? i / LAYER_COUNT
      : 1 - i / LAYER_COUNT;

    /* Adjust saturation and lightness based on the layer factor */
    const fillColor = p.color(
      p.hue(FILL),
      layerColorFactor * p.saturation(FILL),
      layerColorFactor * (CAP_LIGHTNESS ? p.lightness(FILL) : 100)
    );
    p.fill(fillColor);

    /* Iterate through a full circle of angles to make a layer */
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / POINT_COUNT) {
      /* Maybe overcomplicated way of getting x and y coordinate in noise field */
      const xOff = SYMMETRICAL_Y
        ? p.cos(a * NOISE_MULTIPLIER)
        : p.map(i * p.cos(a) + 1, -1, 1, 1, 1 + NOISE_MULTIPLIER);
      const yOff = SYMMETRICAL_X
        ? p.sin(a * NOISE_MULTIPLIER)
        : p.map(i * p.sin(a) + 1, -1, 1, 1, 1 + NOISE_MULTIPLIER);

      /* Get noise based on x, y, and the "time" */
      const noised = p.noise(xOff, yOff, p.frameCount * NOISE_SPEED);

      /* Compute the final x and y and set a vertex there for the shape */
      const x = noised * r * p.cos(a + p.frameCount * ROTATION_SPEED);
      const y = noised * r * p.sin(a + p.frameCount * ROTATION_SPEED);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
