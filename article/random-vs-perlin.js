// Will run once when the sketch is opened
function setup() {
  createCanvas(1238, 400);
  background("#222");
  stroke("#fff");
  textSize(32);

  const AMP = 200;
  const baseline = height / 2;
  const offset = -AMP / 2 + 32;

  // Random line
  drawText("random()");
  beginShape();
  for (let x = 0; x < width / 2; x += 2) {
    vertex(x, baseline + offset + AMP * random());
  }
  endShape();

  // Straiht line
  line(width / 2, 0, width / 2, height);

  translate(width / 2, 0);

  // Noised line
  drawText("noise()");
  beginShape();
  for (let x = 0; x < width / 2; x += 2) {
    vertex(x, baseline + offset + AMP * noise(x * 0.01));
  }
  endShape();
}

function drawText(str) {
  fill("white");
  strokeWeight(1);
  text(str, 64, 64);
  strokeWeight(2);
  noFill();
}
