import p5 from "p5";
import palettesData from "../../../palettes.json";

/* Enable to make a canvas suitable for A2 paper */
const PRINT_MODE = false;

/* Get a random palette or choose a specific one from palettes.json */
const RANDOM_PALETTE = false;
const PALETTE_NAME = "symmeblu"; // symmeblu, termos

const STROKE_WEIGHT = 2;
const OPACITY = 1;

/* The amount of walkers that will be actively drawing each frame */
/* Reducing increases performance, while increasing will fill in faster */
const WALKER_COUNT = 500;

/* The smoothness of the noise, makes a big difference */
/* Lower values result in more gradual angle adjustments, a bit like zooming in */
/* Higher values will lead to often more jagged lines, walkers gathering up more */
const NOISE_ZOOM = 0.0015;

/* Disabling means every walker will have its own color */
/* Enable to color the walkers based on their location / angle */
/* Matching the stroke noise with the noise zoom make them mostly aligned */
/* However, making the noise zooms slightly different offer more layered textures */
const NOISED_STROKE = true;
const STROKE_NOISE_ZOOM = 0.015;

/* The amount of steps a walker will take before being respawned */
/* Longer steps will often lead to being able to gather more */
/* Shorter steps will give a rougher or more hairy texture */
/* A wider range also means more random respawns, and a more textured look */
const MIN_STEPS = 50;
const MAX_STEPS = 100;
/* Shorter steps make smoother lines, while longer ones may be more jagged */
const STEP_SIZE = STROKE_WEIGHT + 1;

/* Enable to clip the flow field by adding a big circle on it */
/* Disabling reveals the flow field of the full canvas */
const CLIP_CONTENT = true;
const CLIP_RADIUS = 400;

/* Enable to round angles to their nearest ANGLE_STEP */
/* This effectively divides the flow field into angles based */
const ROUNDED_ANGLES = false;
const ANGLE_STEP = Math.PI / 3;

/* Noise will naturally lean towards an angle */
/* Enable this to vary where the angle is, or disable and specify your own */
const RANDOM_ANGLE_BIAS = true;
let ANGLE_BIAS = Math.PI / 2;

/* Enable for adding "erasers" that draw more background on the noise */
/* Disabling or reducing will likely lead to a less textured result*/
const ERASERS_ENABLED = true;
const ERASER_SPAWN_CHANCE = 0.5;

/* Instead of lines, draw strings of dots */
/* Works well with very high step sizes */
const DOT_LINES = false;

/*

  CONFIG END

*/

let COLORS: any[], BG: any;
const ACTIVE_WALKERS: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    const cnv = PRINT_MODE ? p.createCanvas(4960, 7016) : p.createCanvas(1080, 1350);
    cnv.mouseClicked(clickOnSave);
    p.pixelDensity(1);

    /* Get colors from the palettes */
    const PALETTE_KEYS = Object.keys(palettesData);
    const RANDOM_PALETTE_NAME = PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0];
    const PALETTE = !RANDOM_PALETTE
      ? (palettesData as any)[PALETTE_NAME]
      : (palettesData as any)[RANDOM_PALETTE_NAME];
    console.log("Palette name: ", RANDOM_PALETTE_NAME);

    p.colorMode(p.HSL);
    COLORS = PALETTE["colors"].map((col: string) => p.color(col));
    BG = p.color(PALETTE.bg);

    /* Sketch-specific setup */
    p.strokeWeight(STROKE_WEIGHT);
    p.background(BG);

    for (let c = 0; c < COLORS.length; c++) {
      COLORS[c].setAlpha(OPACITY);
    }

    /* Randomize the order of the colors so they equate to different angles each run */
    for (let i = COLORS.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [COLORS[i], COLORS[j]] = [COLORS[j], COLORS[i]];
    }

    /* Not really meant for configration as it is real confusing */
    /* Determines the amount of noise layers and their effect on the final field */
    p.noiseDetail(3, 0.75);

    if (RANDOM_ANGLE_BIAS) ANGLE_BIAS = p.random(p.TWO_PI);

    /* Intiialize all walkers into the ACTIVE_WALKER list */
    for (let i = 0; i < WALKER_COUNT; i++) {
      respawnWalker(i);
    }
  };

  p.draw = () => {
    /* Iterate through all walkers */
    for (let i = 0; i < WALKER_COUNT; i++) {
      /* If on the first frame, initialize all walkers (happens only once) */
      const walker = ACTIVE_WALKERS[i];

      /* If the walker has met the end of its lifespawn, respawn it */
      /* If not, have the walker take another step */
      if (walker.steps > walker.step_cap) {
        respawnWalker(i);
      } else {
        /* Determine angle based on noise at its current point in the field */
        let a = p.noise(walker.x * NOISE_ZOOM, walker.y * NOISE_ZOOM) * p.TWO_PI;

        if (ROUNDED_ANGLES) a = p.round(a / ANGLE_STEP) * ANGLE_STEP;

        /* Effectively rotate the canvas to the angle bias */
        a += p.PI + ANGLE_BIAS;

        p.stroke(walker.color);
        const x2 = walker.x + STEP_SIZE * p.cos(a);
        const y2 = walker.y + STEP_SIZE * p.sin(a);

        /* Draw a line from the old to the new point, signifying a step */
        if (DOT_LINES) p.point(walker.x, walker.y);
        else p.line(walker.x, walker.y, x2, y2);
        walker.steps++;

        /* Update the walker coordinates */
        walker.x = x2;
        walker.y = y2;

        /* A dumb amount of code that basically says one single thing: */
        /* If the walker hits an edge, loop to the other side of the screen */
        if (!CLIP_CONTENT) {
          if (walker.x > p.width) walker.x = 0 - STEP_SIZE;
          if (walker.x < 0) walker.x = p.width + STEP_SIZE;
          if (walker.y > p.height) walker.y = 0 - STEP_SIZE;
          if (walker.y < 0) walker.y = p.height + STEP_SIZE;
        } else {
          /* Constraint start and end of screen to be the clipped field */
          const xStart = p.width / 2 - CLIP_RADIUS;
          const xEnd = p.width / 2 + CLIP_RADIUS;
          const yStart = p.height / 2 - CLIP_RADIUS;
          const yEnd = p.height / 2 + CLIP_RADIUS;

          /* Walkers can get stuck, so hide them just out of view */
          if (walker.x > xEnd) walker.x = xStart - STEP_SIZE;
          if (walker.x < xStart) walker.x = xEnd + STEP_SIZE;
          if (walker.y > yEnd) walker.y = yStart - STEP_SIZE;
          if (walker.y < yStart) walker.y = yEnd + STEP_SIZE;
        }
      }
    }
    /* After all walkers have been drawn for the frame, add a clipping circle if desired */
    if (CLIP_CONTENT) drawClipCircle();
  };

  /* Set new coordinates, a random amount of steps, and a color for the walker */
  const respawnWalker = (i: number) => {
    let x = CLIP_CONTENT
      ? p.random(p.width / 2 - CLIP_RADIUS, p.width / 2 + CLIP_RADIUS)
      : p.random(0, p.width);
    let y = CLIP_CONTENT
      ? p.random(p.height / 2 - CLIP_RADIUS, p.height / 2 + CLIP_RADIUS)
      : p.random(0, p.height);

    ACTIVE_WALKERS[i] = {
      x: x,
      y: y,
      steps: 0,
      step_cap: p.random(MIN_STEPS, MAX_STEPS),
      color: selectWalkerColor(x, y),
    };
  };

  /* Set the color of a walker based on their location, or just randomly */
  const selectWalkerColor = (x: number, y: number) => {
    /* If erasers are enabled, determine if the walker will become an eraser */
    if (ERASERS_ENABLED && p.random() < ERASER_SPAWN_CHANCE) {
      return BG;
    }
    if (NOISED_STROKE) {
      /* Set walker color based on the noise value at its coordinates, meaning the angle */
      const colorNoise = p.noise(x * STROKE_NOISE_ZOOM, y * STROKE_NOISE_ZOOM);

      /* Limit the color selection to the size of the given palette */
      const maxIndex = COLORS.length - 1;
      let noisedIndex = p.round(colorNoise * maxIndex);
      if (noisedIndex > maxIndex) {
        noisedIndex = maxIndex;
      }
      return COLORS[noisedIndex];
    } else {
      return p.random(COLORS);
    }
  };

  const drawClipCircle = () => {
    /* Stroke grows in both directions, leading to some wonky diameter calculation */
    const CLIP_STROKE = p.width + CLIP_RADIUS * 2;
    const CLIP_DIAMETER = CLIP_STROKE + CLIP_RADIUS * 2;

    /* Make the circle content transparent so the flow field is visible through the clip */
    p.noFill();

    /* Set stroke, draw circle, and reset the stroke weight back to normal */
    p.stroke(BG);
    p.strokeWeight(CLIP_STROKE);
    p.circle(p.width / 2, p.height / 2, CLIP_DIAMETER);
    p.strokeWeight(STROKE_WEIGHT);
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
