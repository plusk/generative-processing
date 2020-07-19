let cnv;

function preload() {
  img = loadImage("img.jpg");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  image(img, 0, 0);
  loadPixels();
}

let y = 0;

function draw() {
  const values = [];
  for (let x = 0; x < width; x++) {
    values.push({
      r: pixels[4 * y * width + 4 * x],
      g: pixels[4 * y * width + 4 * x + 1],
      b: pixels[4 * y * width + 4 * x + 2],
    });
  }
  values.sort((a, b) => {
    const aVal = a.r + a.g + a.b;
    const bVal = b.r + b.g + b.b;
    return aVal - bVal;
  });
  for (let i = 0; i < values.length; i++) {
    const pixel = values[i];
    pixels[4 * y * width + 4 * i] = pixel.r;
    pixels[4 * y * width + 4 * i + 1] = pixel.g;
    pixels[4 * y * width + 4 * i + 2] = pixel.b;
  }
  updatePixels();
  y++;
  if (y == height * 4) {
    noLoop();
  }
}

function clickOnSave() {
  //saveCanvas();
}
