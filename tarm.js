let section;

function setup() {
  createCanvas(750, 750);
  section = width / 4;
  fill(color("#ffffff40"));
  background(0);
}

let z = 0;

function draw() {
  z++;
  for (let y = section; y <= height - section; y += 8) {
    for (let x = section; x <= width - section; x += 8) {
      const nooice = noise(0.01 * x, 0.01 * y, 0.1 * z);
      circle(x, y, nooice * section * 2);
    }
  }
}
