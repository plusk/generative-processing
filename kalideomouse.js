// Symmetry corresponding to the number of reflections. Change the number for different number of reflections
let symmetry = 32;

let angle = 360 / symmetry;

let frame = 0;

function setup() {
  createCanvas(710, 710);
  angleMode(DEGREES);
  colorMode(HSL);
}

// Clear Screen function
function clearScreen() {
  background();
}

// Full Screen Function
function screenFull() {
  let fs = fullscreen();
  fullscreen(!fs);
}

function draw() {
  translate(width / 2, height / 2);
  frame += 2;

  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let mx = mouseX - width / 2;
    let my = mouseY - height / 2;
    let pmx = pmouseX - width / 2;
    let pmy = pmouseY - height / 2;

    if (mouseIsPressed) {
      stroke(frame % 360, 100, 50, 0.75);
      for (let i = 0; i < symmetry; i++) {
        rotate(angle);
        strokeWeight(2);
        line(mx, my, pmx, pmy);
        push();
        scale(1, -1);
        line(mx, my, pmx, pmy);
        pop();
      }
    }
  }
}
