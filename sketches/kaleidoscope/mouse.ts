import p5 from "p5";

// Symmetry corresponding to the number of reflections. Change the number for different number of reflections
let symmetry = 32;

let angle = 360 / symmetry;

let frame = 0;

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(710, 710);
    p.angleMode(p.DEGREES);
    p.colorMode(p.HSL);
  };

  // Clear Screen function
  const _clearScreen = () => {
    p.background(0);
  };

  // Full Screen Function
  const _screenFull = () => {
    let fs = (p as any).fullscreen();
    (p as any).fullscreen(!fs);
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);
    frame += 2;

    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      let mx = p.mouseX - p.width / 2;
      let my = p.mouseY - p.height / 2;
      let pmx = (p as any).pmouseX - p.width / 2;
      let pmy = (p as any).pmouseY - p.height / 2;

      if (p.mouseIsPressed) {
        p.stroke(frame % 360, 100, 50, 0.75);
        for (let i = 0; i < symmetry; i++) {
          p.rotate(angle);
          p.strokeWeight(2);
          p.line(mx, my, pmx, pmy);
          p.push();
          p.scale(1, -1);
          p.line(mx, my, pmx, pmy);
          p.pop();
        }
      }
    }
  };
});
