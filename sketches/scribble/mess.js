let section;
let cnv;

function setup() {
  cnv = createCanvas(1080, 1080);
  cnv.mouseClicked(clickOnSave);
  section = width / 4;
  colorMode(HSL);
  fill(color(45, 45, 75, 0.2));
  background(45, 45, 75);
  frameRate(12);
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

function clickOnSave() {
  // saveCanvas();
}
