const pixellation = 4;

function setup() {
  pixelDensity(1);
  createCanvas(1440, 810);
  noStroke();
}

function draw() {
  drawNoise(0, 0, width / 2, height / 2, 0.004);
  drawNoise(width / 2, 0, width, height / 2, 0.008);
  drawNoise(0, height / 2, width / 2, height, 0.016);
  drawNoise(width / 2, height / 2, width, height, 0.032);
  stroke("red");

  strokeWeight(4);
  noFill();
  rect(0, 0, width / 2, height / 2);
  rect(width / 2, 0, width / 4, height / 4);
  rect(0, height / 2, width / 8, height / 8);
  rect(width / 2, height / 2, width / 16, height / 16);
  noLoop();
}

function drawNoise(x1, y1, x2, y2, zoom) {
  for (let x = 0; x < x2; x += pixellation) {
    for (let y = 0; y < y2; y += pixellation) {
      const c = 255 * noise(zoom * x, zoom * y);
      fill(c);
      rect(x1 + x, y1 + y, pixellation, pixellation);
    }
  }
}
