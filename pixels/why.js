let cnv;

function preload() {
  img = loadImage("pixels/img.jpg");
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
  for (let x = 0; x < width; x += 4) {
    values.push({
      r: pixels[y * width + x],
      g: pixels[y * width + x + 1],
      b: pixels[y * width + x + 2],
    });
  }
  values.sort((a, b) => {
    const aVal = a.r + a.g + a.b;
    const bVal = b.r + b.g + b.b;
    return aVal - bVal;
  });
  for (let i = 0; i < values.length; i++) {
    const pixel = values[i];
    pixels[y * width + i * 4] = pixel.r;
    pixels[y * width + i * 4 + 1] = pixel.g;
    pixels[y * width + i * 4 + 2] = pixel.b;
  }
  updatePixels();
  y++;
  if (y === height * 4) {
    noLoop();
  }
}

function clickOnSave() {
  //saveCanvas();
}
