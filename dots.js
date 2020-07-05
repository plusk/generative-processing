let section;
let gap;

function setup() {
  createCanvas(750, 750);
  section = width / 8;
  gap = width / 16;
  noStroke();
  colorMode(HSL);
}

let z = 0;

function draw() {
  background(45, 45, 75);
  z++;
  for (let y = section; y <= height - section; y += gap) {
    for (let x = section; x <= width - section; x += gap) {
      const nooice = noise(0.005 * x, 0.005 * y, 0.02 * z);
      fill(0, 100, 65);
      circle(x, y, nooice * gap);
    }
  }
}
