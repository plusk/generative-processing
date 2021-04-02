import PALETTES from "./palettes.json";
import p5 from "p5";
import dat from "dat.gui";

const drawSketch = (id) => {
  new p5(s, id);
};

export default drawSketch;

const s = (p) => {
  const gui = new dat.GUI();
  let COLORS, FILL, BG;

  const c = {
    MEAN_RADIUS: 540,
    RANDOM_PALETTE: false,
    PALETTE_NAME: "stronk",
    LAYER_COUNT: 10,
    HAS_STROKE: false,
    STROKE_WEIGHT: 1,
    INVERTED_GRADIENT: true,
    CAP_LIGHTNESS: true,
    NOISE_MULTIPLIER: 0.2,
    NOISE_SPEED: 0.0025,
    SYMMETRICAL_X: false,
    SYMMETRICAL_Y: false,
    USE_FILL_AS_BACKGROUND: false,
    USE_PALETTE_BACKGROUND: true,
    POINT_COUNT: 400,
    ROTATION_SPEED: 0.001,
    Redraw: () => p.setup(),
  };

  gui.add(c, "MEAN_RADIUS", 0, 2160, 10);
  gui.add(c, "RANDOM_PALETTE");
  gui.add(c, "PALETTE_NAME");
  gui.add(c, "LAYER_COUNT", 1, 50);
  gui.add(c, "HAS_STROKE");
  gui.add(c, "STROKE_WEIGHT", 1, 10, 1);
  gui.add(c, "INVERTED_GRADIENT");
  gui.add(c, "CAP_LIGHTNESS");
  gui.add(c, "NOISE_MULTIPLIER", 0, 5);
  gui.add(c, "NOISE_SPEED", 0, 0.02);
  gui.add(c, "SYMMETRICAL_X");
  gui.add(c, "SYMMETRICAL_Y");
  gui.add(c, "USE_FILL_AS_BACKGROUND");
  gui.add(c, "USE_PALETTE_BACKGROUND");
  gui.add(c, "POINT_COUNT", 3, 400);
  gui.add(c, "ROTATION_SPEED", 0, 0.005);
  gui.add(c, "Redraw");

  /*

  CONFIG END

*/

  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350);
    cnv.mouseClicked(clickOnSave);

    /* Get colors from the palettes */
    const PALETTE_KEYS = Object.keys(PALETTES);
    const RANDOM_PALETTE_NAME =
      PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0];
    const PALETTE = !c.RANDOM_PALETTE
      ? PALETTES[c.PALETTE_NAME]
      : PALETTES[RANDOM_PALETTE_NAME];
    console.log("Palette name: ", RANDOM_PALETTE_NAME);

    p.colorMode(p.HSL);
    COLORS = PALETTE["colors"].map((col) => p.color(col));
    BG = p.color(PALETTE.bg);

    /* Sketch-specific setup */
    FILL = p.random(COLORS);
  };

  p.draw = () => {
    p.strokeWeight(c.STROKE_WEIGHT);
    c.HAS_STROKE ? p.stroke(FILL) : p.noStroke();

    /* Move coordinate system to center of canvas for easier trigonometry */
    p.translate(p.width / 2, p.height / 2);

    /* Home-made helper function to select background based on config */
    drawBackground();

    /* Because layers are drawn in sequence, draw large layers on bottom first */
    for (let i = c.LAYER_COUNT; i > 0; i--) {
      drawLayer((c.MEAN_RADIUS / c.LAYER_COUNT) * i, i);
    }
  };

  function drawBackground() {
    if (c.INVERTED_GRADIENT) {
      c.CAP_LIGHTNESS ? p.background(FILL) : p.background(255);
    } else {
      p.background(0);
    }
    c.USE_FILL_AS_BACKGROUND && p.background(FILL);
    c.USE_PALETTE_BACKGROUND && p.background(BG);
  }

  function drawLayer(r, i) {
    /* A number from 0 to 1, where the middle layer would have 0.5 */
    const layerColorFactor = c.INVERTED_GRADIENT
      ? i / c.LAYER_COUNT
      : 1 - i / c.LAYER_COUNT;

    /* Adjust saturation and lightness based on the layer factor */
    const fillColor = p.color(
      p.hue(FILL),
      layerColorFactor * p.saturation(FILL),
      layerColorFactor * (c.CAP_LIGHTNESS ? p.lightness(FILL) : 100)
    );
    p.fill(fillColor);

    /* Iterate through a full circle of angles to make a layer */
    p.beginShape();
    for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / c.POINT_COUNT) {
      /* Maybe overcomplicated way of getting x and y coordinate in noise field */
      const xOff = c.SYMMETRICAL_Y
        ? p.cos(a * c.NOISE_MULTIPLIER)
        : p.map(i * p.cos(a) + 1, -1, 1, 1, 1 + c.NOISE_MULTIPLIER);
      const yOff = c.SYMMETRICAL_X
        ? p.sin(a * c.NOISE_MULTIPLIER)
        : p.map(i * p.sin(a) + 1, -1, 1, 1, 1 + c.NOISE_MULTIPLIER);

      /* Get noise based on x, y, and the "time" */
      const noised = p.noise(xOff, yOff, p.frameCount * c.NOISE_SPEED);

      /* Compute the final x and y and set a vertex there for the shape */
      const x = noised * r * p.cos(a + p.frameCount * c.ROTATION_SPEED);
      const y = noised * r * p.sin(a + p.frameCount * c.ROTATION_SPEED);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  }

  function clickOnSave() {
    p.saveCanvas();
  }
};
