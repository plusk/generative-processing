let cnv;

const COUNT = 108;
const SIZE = 1080 / COUNT;

function preload() {
  img = loadImage("img.jpg");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  image(img, 0, 0);
  loadPixels();
  noStroke();
  rectMode(CENTER);
}

function draw() {
  for (let x = SIZE / 2; x < width; x += SIZE) {
    for (let y = SIZE / 2; y < height; y += SIZE) {
      const i = 4 * y * width + x * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const coleur = color(r, g, b);
      fill(coleur);
      rect(x, y, SIZE, SIZE);
    }
  }
  noLoop();
}

function clickOnSave() {
  //saveCanvas();
}
