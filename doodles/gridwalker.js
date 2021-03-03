let PALETTES, COLORS, STROKE, BG;

const EXPORT = false;

const RANDOM_PALETTE = false;
const PALETTE_NAME = "termos";

const STROKE_WEIGHT = 0;
const OPACITY = 1;

const PADDING = 0;
const SIZE = 15;

const gridX = 64;
const gridY = gridX * 1.25;
const gridZ = 10;

const RANDOM_COLORS = false;

const DECAY = 0.02;

const WALKER_COUNT = 10;

class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {
    const xMove = random([-1, 0, 1]);
    const yMove = random([-1, 0, 1]);
    this.x = this.x + xMove;
    this.y = this.y + yMove;

    if (this.x < 0) {
      this.x = gridX - 1;
    } else if (this.x == gridX) {
      this.x = 0;
    }

    if (this.y < 0) {
      this.y = gridY - 1;
    } else if (this.y == gridY) {
      this.y = 0;
    }
  }
}

class Cell {
  constructor(value, color) {
    this.value = value;
    this.color = color;
  }
}

class Grid {
  constructor(x, y, z, value, colors) {
    this.x = x;
    this.y = y;
    this.z = z;

    const g = [];
    for (let r = 0; r < y; r++) {
      const row = [];
      for (let c = 0; c < x; c++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        row.push(new Cell(value, color));
      }
      g.push(row);
    }
    this.g = g;
  }

  draw(x1, y1, x2, y2) {
    for (let y = 0; y < this.g.length; y++) {
      const r = this.g[y];
      for (let x = 0; x < r.length; x++) {
        const c = r[x];
        if (c.value > 0) {
        }
        this.decrementCell(x, y);

        const xAmt = x / (r.length - 1);
        const yAmt = y / (this.g.length - 1);

        const xRange = x2 - x1 - SIZE;
        const yRange = y2 - y1 - SIZE;

        const xCoordinate = x1 + xAmt * xRange + SIZE / 2;
        const yCoordinate = y1 + yAmt * yRange + SIZE / 2;

        const fillAmt = c.value / this.z;

        const coleur = color(
          hue(lerpColor(BG, c.color, 1)),
          saturation(lerpColor(BG, c.color, fillAmt)),
          lightness(lerpColor(BG, c.color, fillAmt))
        );

        fill(coleur);

        circle(xCoordinate, yCoordinate, SIZE);
      }
    }
  }

  getCellValue(x, y) {
    const value = this.g[y][x].value;
    return value;
  }

  incrementCell(x, y) {
    const value = this.g[y][x].value;
    if (value < this.z) {
      this.g[y][x].value = value + 1;
    }
  }

  decrementCell(x, y) {
    const value = this.g[y][x].value;
    if (value > 0) {
      this.g[y][x].value = value - DECAY;
    }
  }
}

let g = {};
const walkers = [];

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  const cnv = createCanvas(1080, 1350); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  if (EXPORT) pixelDensity(1);
  if (EXPORT) frameRate(4);

  /* Get colors from the palettes */
  const PALETTE_KEYS = Object.keys(PALETTES);
  const PALETTE = !RANDOM_PALETTE
    ? PALETTES[PALETTE_NAME]
    : PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];

  colorMode(HSL);
  COLORS = PALETTE["colors"].map((col) => color(col));
  BG = color(PALETTE.bg);

  /* Sketch-specific setup */
  strokeWeight(STROKE_WEIGHT);
  STROKE = random(COLORS);
  STROKE.setAlpha(OPACITY);
  stroke(STROKE);
  background(BG);

  if (RANDOM_COLORS) {
    g = new Grid(gridX, gridY, gridZ, 0, COLORS);
  } else {
    g = new Grid(gridX, gridY, gridZ, 0, [random(COLORS)]);
  }

  for (let i = 0; i < WALKER_COUNT; i++) {
    walkers.push(new Walker(floor(random(gridX)), floor(random(gridY))));
  }

  //drawingContext.shadowBlur = STROKE_WEIGHT;
  //drawingContext.shadowColor = STROKE;
}

let x = 0;
let y = 0;

function draw() {
  g.draw(PADDING, PADDING, width - PADDING, height - PADDING);

  for (let i = 0; i < walkers.length; i++) {
    const w = walkers[i];
    g.incrementCell(w.x, w.y);
    w.update();
  }

  /*
  g.incrementCell(x, y);
  g.incrementCell(x, y);
  g.incrementCell(x, y);
  g.incrementCell(x, y);
  g.incrementCell(x, y);
  g.incrementCell(x, y);
  g.incrementCell(x, y);
  g.incrementCell(x, y);

  if (x < gridX - 1) {
    x++;
  } else {
    x = 0;
    if (y < gridY - 1) {
      y++;
    } else {
      y = 0;
    }
  }
  */
}

function clickOnSave() {
  saveCanvas();
}
