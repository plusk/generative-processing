import p5 from "p5";
import palettesData from "../../palettes.json";

new p5((p: p5) => {
  // Will run once when the sketch is opened
  p.setup = () => {
    p.createCanvas(1238, 400);
    p.background("#222");
    p.stroke("#fff");
    p.textSize(32);

    const AMP = 200;
    const baseline = p.height / 2;
    const offset = -AMP / 2 + 32;

    // Random line
    drawText("random()");
    p.beginShape();
    for (let x = 0; x < p.width / 2; x += 2) {
      p.vertex(x, baseline + offset + AMP * p.random());
    }
    p.endShape();

    // Straiht line
    p.line(p.width / 2, 0, p.width / 2, p.height);

    p.translate(p.width / 2, 0);

    // Noised line
    drawText("noise()");
    p.beginShape();
    for (let x = 0; x < p.width / 2; x += 2) {
      p.vertex(x, baseline + offset + AMP * p.noise(x * 0.01));
    }
    p.endShape();
  };

  const drawText = (str: string) => {
    p.fill("white");
    p.strokeWeight(1);
    p.text(str, 64, 64);
    p.strokeWeight(2);
    p.noFill();
  };
});
