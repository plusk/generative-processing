let cnv;

function preload() {
  img = loadImage("pixels/img.jpg");
}

function setup() {
  cnv = createCanvas(1080, 1080); // 1080, 1350
  cnv.mouseClicked(clickOnSave);
  image(img, 0, 0);
  filter(BLUR, 10);
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
    const aVal = a.r + a.b + a.g;
    const bVal = b.r + b.b + b.g;
    return aVal - bVal;
  });
  for (let i = 0; i < values.length; i++) {
    const pixel = values[i];
    pixels[4 * y * width + 4 * i] = pixel.r;
    pixels[4 * y * width + 4 * i + 1] = pixel.g;
    pixels[4 * y * width + 4 * i + 2] = pixel.b;
  }
  y++;
  updatePixels();
  if (y == height * 4) {
    noLoop();
  }
}

function clickOnSave() {
  //saveCanvas();
}
