import p5 from "p5";
import { palettes } from "../../palettes";

const PALETTE_NAME = "genesis";

const STROKE_WEIGHT = 2;
const ANGLE_STEP = 2.25;
const NOISE_DETAIL = 0.0075;
const SEEDS_PER_EVENT = 30;
const SEED_LIFETIME = 120;
const MIN_PLANT_DIST = 20;

const STEP = STROKE_WEIGHT;

let PALETTE: any;
let COLORS: p5.Color[];
let BG: p5.Color;

let lastPlantX = -9999;
let lastPlantY = -9999;
const SEEDS: any[] = [];

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(1080, 1350);
    // cnv.mouseClicked(clickOnSave);

    PALETTE = palettes[PALETTE_NAME];
    COLORS = PALETTE.colors;
    BG = p.color(PALETTE.bg);

    p.background(BG);
    p.fill(BG);
    p.strokeWeight(STROKE_WEIGHT);
    p.colorMode(p.HSL);
    (p.drawingContext as CanvasRenderingContext2D).shadowBlur = STROKE_WEIGHT;
  };

  p.draw = () => {
    for (let i = SEEDS.length - 1; i >= 0; i--) {
      const seed = SEEDS[i];
      const age = SEED_LIFETIME - seed.life;
      const coleur = p.color(
        p.hue(seed.color),
        (p.saturation(seed.color) / SEED_LIFETIME) * age,
        (p.lightness(seed.color) / SEED_LIFETIME) * age,
        (5 / SEED_LIFETIME) * age,
      );
      p.stroke(coleur);
      drawSeed(seed);
      seed.life--;
      if (seed.life <= 0) SEEDS.splice(i, 1);
    }
  };

  p.mousePressed = () => {
    lastPlantX = -9999;
    lastPlantY = -9999;
    plantSeeds(p.mouseX, p.mouseY);
  };

  p.mouseDragged = () => {
    plantSeeds(p.mouseX, p.mouseY);
  };

  const plantSeeds = (x: number, y: number) => {
    const dx = x - lastPlantX;
    const dy = y - lastPlantY;
    if (Math.sqrt(dx * dx + dy * dy) < MIN_PLANT_DIST) return;
    lastPlantX = x;
    lastPlantY = y;

    const noyzed = p.noise(x * NOISE_DETAIL, y * NOISE_DETAIL);
    const idx = p.constrain(
      Math.floor(p.map(noyzed, 0.2, 0.8, 0, COLORS.length)),
      0,
      COLORS.length - 1,
    );
    const coleur = p.color(COLORS[idx]);

    for (let i = 0; i < SEEDS_PER_EVENT; i++) {
      SEEDS.push({
        x,
        y,
        a: p.random(p.TWO_PI),
        color: coleur,
        step: p.random(STEP * 0.5, STEP * 1),
        life: SEED_LIFETIME,
      });
    }
  };

  const drawSeed = (LINE: any) => {
    const noyzed = p.noise(LINE.x * NOISE_DETAIL, LINE.y * NOISE_DETAIL);
    const angle = LINE.a * noyzed * ANGLE_STEP;

    const x = LINE.x + LINE.step * p.cos(p.HALF_PI + angle);
    const y = LINE.y + LINE.step * p.sin(p.HALF_PI + angle);
    p.line(LINE.x, LINE.y, x, y);
    LINE.x = x;
    LINE.y = y;
    LINE.a = angle;
  };
});
