let symmetry = 32;

let symangle = 360 / symmetry;

let frame = 0;

let x, y;

function setup() {
  createCanvas(750, 750);
  angleMode(DEGREES);
  colorMode(HSL);
  x = width / 2;
  y = height / 2;
}

const STEP = 2;

let angle = 0;
let anglestep = 30;

function draw() {
  translate(width / 2, height / 2);
  frame += 0.5;

  if (x > 0 && x < width && y > 0 && y < height) {
    let startx = x;
    let starty = y;

    let noised = noise(x, y) - 0.5;

    angle += noised * anglestep;

    x += cos(angle) * STEP;
    y += sin(angle) * STEP;

    stroke((frame - 75) % 360, frame + 25, 75, 0.75);

    for (let i = 0; i < symmetry; i++) {
      rotate(symangle);
      strokeWeight(1);
      line(
        startx - width / 2,
        starty - height / 2,
        x - width / 2,
        y - height / 2
      );
      push();
      scale(1, -1);
      line(
        startx - width / 2,
        starty - height / 2,
        x - width / 2,
        y - height / 2
      );
      pop();
    }
  }
}
