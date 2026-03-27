import p5 from "p5";
import { palettes } from "../palettes";

new p5((p: p5) => {
  let COLORS: any, STROKE: any, BG: any;

  const EXPORT = false;

  const RANDOM_PALETTE = false;
  const PALETTE_NAME = "termos";

  const STROKE_WEIGHT = 0;
  const OPACITY = 1;

  const PADDING = 0;
  const SIZE = 10;

  const gridX = 64;
  const gridY = gridX * 1.25;
  const gridZ = 5;

  const DECAY = 0.02;
  const WALKER_COUNT = 50;

  const RANDOM_COLORS = true;
  const CIRCULAR = true;

  class Walker {
    x: number;
    y: number;
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    update() {
      const xMove = p.random([-1, 0, 1]);
      const yMove = p.random([-1, 0, 1]);
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
    color: any;
    value: number;
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, color: any) {
      this.color = color;
      this.value = 0;
      this.x = x;
      this.y = y;
      this.z = 0;
    }
  }

  class Grid {
    g: Cell[][];
    constructor(x1: number, y1: number, x2: number, y2: number, colors: any[]) {
      const g: Cell[][] = [];
      for (let y = 0; y < gridY; y++) {
        const row: Cell[] = [];
        for (let x = 0; x < gridX; x++) {
          const xAmt = x / (gridX - 1);
          const yAmt = y / (gridY - 1);

          const xRange = x2 - x1 - SIZE;
          const yRange = y2 - y1 - SIZE;

          const xCoordinate = x1 + xAmt * xRange + SIZE / 2;
          const yCoordinate = y1 + yAmt * yRange + SIZE / 2;

          const color = colors[Math.floor(Math.random() * colors.length)];
          row.push(new Cell(xCoordinate, yCoordinate, color));
        }
        g.push(row);
      }
      this.g = g;
    }

    draw() {
      for (let y = 0; y < this.g.length; y++) {
        const r = this.g[y];
        for (let x = 0; x < r.length; x++) {
          const c = r[x];
          if (c.value > 0) {
            this.decrementCell(x, y);

            const fillAmt = c.z / gridZ;

            const coleur = p.color(
              p.hue(p.lerpColor(BG, c.color, 1)),
              p.saturation(p.lerpColor(BG, c.color, fillAmt)),
              p.lightness(p.lerpColor(BG, c.color, fillAmt)),
            );

            p.fill(coleur);

            if (CIRCULAR) p.circle(c.x, c.y, SIZE);
            else p.rect(c.x, c.y, SIZE);
          }
        }
      }
    }

    incrementCell(x: number, y: number) {
      const cell = this.g[y][x];
      if (cell.value < gridZ) {
        cell.value++;
      }
    }

    decrementCell(x: number, y: number) {
      const cell = this.g[y][x];
      if (cell.value > 0) {
        cell.value -= DECAY;
        cell.z = p.round(cell.value);
      } else if (cell.value < 0) {
        cell.value = 0;
      }
    }
  }

  let g: any = {};
  const walkers: Walker[] = [];

  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);
    if (EXPORT) p.pixelDensity(1);
    if (EXPORT) p.frameRate(4);

    /* Get colors from the palettes */
    const PALETTE_KEYS = Object.keys(palettes);
    const PALETTE = !RANDOM_PALETTE
      ? palettes[PALETTE_NAME]
      : palettes[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];

    p.colorMode(p.HSL);
    COLORS = PALETTE["colors"].map((col: any) => p.color(col));
    BG = p.color(PALETTE.bg);

    /* Sketch-specific setup */
    p.strokeWeight(STROKE_WEIGHT);
    STROKE = p.random(COLORS);
    STROKE.setAlpha(OPACITY);
    p.stroke(STROKE);
    p.background(BG);

    g = new Grid(
      PADDING,
      PADDING,
      p.width - PADDING,
      p.height - PADDING,
      RANDOM_COLORS ? COLORS : [p.random(COLORS)],
    );

    for (let i = 0; i < WALKER_COUNT; i++) {
      walkers.push(new Walker(p.floor(p.random(gridX)), p.floor(p.random(gridY))));
    }

    p.rectMode(p.CENTER);

    //p.drawingContext.shadowBlur = STROKE_WEIGHT;
    //p.drawingContext.shadowColor = STROKE;
  };

  let _x = 0;
  let _y = 0;

  p.draw = () => {
    g.draw();

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
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
