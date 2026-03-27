import p5 from "p5";
import { palettes } from "../../../palettes";

/* Enable to make a canvas suitable for A2 paper */
const PRINT_MODE = false;

/* Get a random palette or choose a specific one from palettes */
const RANDOM_PALETTE = false;
const PALETTE_NAME = "symmeblu";

/* The size of the recursion field */
const SIZE = 800;

/* In addition to the thickness of spacing, adjusts maximum recursion depth */
/* Scaling up the stroke weight would result in larger shapes overall */
const STROKE_WEIGHT = 4;

/* Enable to set a stroke on each shape based on the background color */
const HAS_STROKE = true;

/* Keep in mind that spawning shape means no subdivision/recursion in the slot */
const SHAPE_CHANCE = 0.2;

/* Lower chance means more empty space in the field */
const BACKGROUND_CHANCE = 0.5;

/* Will clear the canvas each frame if enabled, disabling leads to overlap */
const CLEAR_EACH_FRAME = true;

/* The shape will be randomly selected from the following object */
/* The random selection is weighted based on the integer values */
/* Example: 1 is a normal amount, 2 is double, 0 would be none of that type */
/* The values are weighed in relation to each other, so 1 2 3 4 = 2 4 6 8 */
const SHAPE_WEIGHTS = [
  { type: "SQUARE", weight: 1 },
  { type: "DIAMOND", weight: 1 },
  { type: "TRIANGLE", weight: 1 },
  { type: "CIRCLE", weight: 1 },
];
const WEIGHTED_SHAPES: string[] = [];

/*

  CONFIG END

*/

let COLORS: any[], BG: any;

new p5((p: p5) => {
  p.setup = () => {
    const cnv = PRINT_MODE ? p.createCanvas(4960, 7016) : p.createCanvas(1080, 1350);
    cnv.mouseClicked(clickOnSave);
    p.pixelDensity(1);
    p.frameRate(1);

    /* Get colors from the palettes */
    const PALETTE_KEYS = Object.keys(palettes);
    const RANDOM_PALETTE_NAME = PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0];
    const PALETTE = !RANDOM_PALETTE ? palettes[PALETTE_NAME] : palettes[RANDOM_PALETTE_NAME];
    console.log("Palette name: ", RANDOM_PALETTE_NAME);

    p.colorMode(p.HSL);
    COLORS = PALETTE["colors"].map((col: string) => p.color(col));
    BG = p.color(PALETTE.bg);

    /* Sketch-specific setup */
    p.strokeWeight(STROKE_WEIGHT);
    (p as any).strokeJoin((p as any).BEVEL);
    if (HAS_STROKE) p.stroke(BG);
    else p.noStroke();

    p.background(BG);
    (p as any).rectMode(p.CENTER);

    /* Initialize weighted shapes */
    for (let s = 0; s < SHAPE_WEIGHTS.length; s++) {
      const shape = SHAPE_WEIGHTS[s];
      for (let w = 0; w < shape.weight; w++) {
        WEIGHTED_SHAPES.push(shape.type);
      }
    }
  };

  p.draw = () => {
    if (CLEAR_EACH_FRAME) p.background(BG);

    /* Start the recursion field */
    /* More fields can be placed by duplicating this line and changing positions */
    step(0, p.width / 2, p.height / 2, SIZE);
  };

  const step = (currentDepth: number, x: number, y: number, r: number) => {
    /* Based on chance to spawn shape, stop recursion for the tile */
    /* If the max depth has been met, all tiles will draw a shape */
    if (currentDepth != 0 && (p.random() < SHAPE_CHANCE || r <= STROKE_WEIGHT * 8)) {
      drawRandomShape(x, y, r);
      return;
    }

    /* If no shape this tile, divide recursion field into four smaller tiles */
    const r2 = r / 2;
    step(currentDepth + 1, x - r2 / 2, y - r2 / 2, r2);
    step(currentDepth + 1, x + r2 / 2, y - r2 / 2, r2);
    step(currentDepth + 1, x - r2 / 2, y + r2 / 2, r2);
    step(currentDepth + 1, x + r2 / 2, y + r2 / 2, r2);
  };

  const drawRandomShape = (x: number, y: number, r: number) => {
    drawBackgroundOrDont(x, y, r);

    /* Select a shape based on shape weights, then draw it */
    const shape = p.random(WEIGHTED_SHAPES);
    if (shape == "DIAMOND") {
      drawDiamond(x, y, r);
    } else if (shape == "CIRCLE") {
      p.circle(x, y, r);
    } else if (shape == "TRIANGLE") {
      drawTriangle(x, y, r);
    } else if (shape == "SQUARE") {
      /* Drawing a background draws a square already */
      /* In other words, do nothing */
    }
  };

  /* Set a random background and foreground color for new shape */
  const drawBackgroundOrDont = (x: number, y: number, r: number) => {
    p.fill(p.random(COLORS));
    if (p.random() < BACKGROUND_CHANCE) {
      (p as any).rect(x, y, r);
      p.fill(p.random(COLORS));
    }
  };

  /* Draw what is basically a rotated square */
  const drawDiamond = (x: number, y: number, r: number) => {
    const r2 = r / 2;
    p.beginShape();
    p.vertex(x + r2, y);
    p.vertex(x, y + r2);
    p.vertex(x - r2, y);
    p.vertex(x, y - r2);
    p.endShape(p.CLOSE);
  };

  /* Draw a triangle in one of the four possible orientations*/
  const drawTriangle = (x: number, y: number, r: number) => {
    const r2 = r / 2;
    const excludedCorner = p.random(["TOPLEFT", "TOPRIGHT", "BOTLEFT", "BOTRIGHT"]);
    if (excludedCorner == "TOPLEFT") {
      p.triangle(x - r2, y + r2, x + r2, y - r2, x + r2, y + r2);
    } else if (excludedCorner == "TOPRIGHT") {
      p.triangle(x - r2, y - r2, x + r2, y + r2, x - r2, y + r2);
    } else if (excludedCorner == "BOTLEFT") {
      p.triangle(x - r2, y - r2, x + r2, y + r2, x + r2, y - r2);
    } else if (excludedCorner == "BOTRIGHT") {
      p.triangle(x - r2, y - r2, x - r2, y + r2, x + r2, y - r2);
    }
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
