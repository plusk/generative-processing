import p5 from "p5";
import palettesData from "../palettes.json";

new p5((p: p5) => {
  const pixellation = 4;

  p.setup = () => {
    p.pixelDensity(1);
    p.createCanvas(1440, 810);
    p.noStroke();
  };

  p.draw = () => {
    drawNoise(0, 0, p.width / 2, p.height / 2, 0.004);
    drawNoise(p.width / 2, 0, p.width, p.height / 2, 0.008);
    drawNoise(0, p.height / 2, p.width / 2, p.height, 0.016);
    drawNoise(p.width / 2, p.height / 2, p.width, p.height, 0.032);
    p.stroke("red");

    p.strokeWeight(4);
    p.noFill();
    p.rect(0, 0, p.width / 2, p.height / 2);
    p.rect(p.width / 2, 0, p.width / 4, p.height / 4);
    p.rect(0, p.height / 2, p.width / 8, p.height / 8);
    p.rect(p.width / 2, p.height / 2, p.width / 16, p.height / 16);
    p.noLoop();
  };

  const drawNoise = (x1: number, y1: number, x2: number, y2: number, zoom: number) => {
    for (let x = 0; x < x2; x += pixellation) {
      for (let y = 0; y < y2; y += pixellation) {
        const c = 255 * p.noise(zoom * x, zoom * y);
        p.fill(c);
        p.rect(x1 + x, y1 + y, pixellation, pixellation);
      }
    }
  };
});
