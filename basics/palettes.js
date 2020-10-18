let cnv;
let PALETTES;
let PALETTE;
let COLORS;
let BG;
let STROKE;

function preload() {
  PALETTES = loadJSON("palettes.json");
}

function setup() {
  cnv = createCanvas(1080, 2000); // 1080, 1350
  cnv.mouseClicked(clickOnSave);

  colorMode(HSL);
  const PALETTE_KEYS = Object.keys(PALETTES);
  PALETTE = PALETTES[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
  COLORS = PALETTE["colors"];
  BACKGROUNDS = PALETTE["bg"];
  noStroke();

  const entries = Object.entries(PALETTES);
  let index = 0;
  for (const [name, palette] of entries) {
    fill(palette.bg);
    const ydiff = height / entries.length;
    const y = index * ydiff;
    rect(0, y, width, ydiff);
    for (let i = 0; i < palette.colors.length; i++) {
      const coleur = palette.colors[i];
      const xdiff = width / (palette.colors.length + 1);
      const x = xdiff * 0.5 + i * xdiff;
      fill(coleur);
      rect(x, y + ydiff * 0.25, xdiff, ydiff / 2);
    }
    index++;
  }
}

function draw() {
  noLoop();
}

function clickOnSave() {
  //saveCanvas();
}
