/* The degree to which noise affects the layers */
/* Low values are blobby, high values are spikey */
const NOISE_AMP = 0.8;
const NOISE_AMP_LINES = 1;

/* The speed at which the layers */
const NOISE_SPEED = 0.002;

const STROKE_WEIGHT = 2;

/* The amount of points that make up each layer, lower means "pointier" */
/* For example 3 points mean triangular layers, 4 means squares */
/* Higher might not be noticable, but will make for smoother borders */
const POINT_COUNT = 300;

/* Mild rotation, negative speed rotates counter-clockwise */
const ROTATION_SPEED = 0.001;

const TEXT_SIZE = 36;

/*

  CONFIG END

*/

function windowResized() {
  resizeCanvas(windowWidth, round(windowWidth / 2.75));
}

function setup() {
  colorMode(HSL);
  const cnv = createCanvas(windowWidth, round(windowWidth / 2.75));
  cnv.mouseClicked(clickOnSave);

  strokeWeight(STROKE_WEIGHT);

  /* Get colors from the palettes */
  PALETTE = {
    bg: color("#fff0ac"),
    dark: color("#1c2c3c"),
    darkish: color("#1c2c3c"),
    white: color("#fff"),
    pink: color("#efb2ff"),
    yellow: color("#fff001"),
    teal: color("#02dfc9"),
    blue: color("#293895"),
  };
  PALETTE.darkish.setAlpha(0.75);

  colorMode(HSL);
  BG = color(PALETTE.bg);

  textAlign(CENTER);
  textFont("Newzald");
  textSize(TEXT_SIZE);
}

function draw() {
  /* Home-made helper function to select background based on config */
  background(BG);

  /* Because layers are drawn in sequence, draw large layers on bottom first */
  fill(PALETTE.white);
  drawBlob(1, width / 2, height / 2, height / 2);

  fill(PALETTE.dark);
  drawBlob(2, width / 2, height / 2, height / 2);

  fill(PALETTE.yellow);
  drawBlob(100, 0, height, height * 0.4);

  fill(PALETTE.pink);
  drawBlob(200, -width * 0.1, height * 0.1, height);

  fill(PALETTE.dark);
  drawBlob(300, 0, height * 0.5, height * 0.4);

  fill(PALETTE.white);
  drawBlob(400, width * 0.8, height, height / 4);

  fill(PALETTE.yellow);
  drawBlob(500, width * 0.9, height * 0.8, height / 2);

  fill(PALETTE.teal);
  drawBlob(600, width, height / 2, height / 2);

  fill(PALETTE.white);
  text("Fagdag", width / 2, height / 2 + TEXT_SIZE / 2);
  //text("Frokostseminaret", width / 2, height / 2);
  //text("for frontend", width / 2, height / 2 + TEXT_SIZE);

  drawLine(100, 0, 0, 0, PI, height * 1.25);
  drawLine(200, width, height, PI, PI + HALF_PI, height);
  drawLine(201, width, height, PI, PI + HALF_PI, height * 0.75);
}

function drawBlob(z, cx, cy, r) {
  /* Iterate through a full circle of angles to make a layer */
  beginShape();
  for (let a = 0; a < TWO_PI; a += TWO_PI / POINT_COUNT) {
    /* Maybe overcomplicated way of getting x and y coordinate in noise field */
    const xOff = map(cos(a) + 1, -1, 1, 1, 1 + NOISE_AMP);
    const yOff = map(sin(a) + 1, -1, 1, 1, 1 + NOISE_AMP);

    /* Get noise based on x, y, and the "time" */
    const noised = 0.1 + noise(xOff, yOff, z + frameCount * NOISE_SPEED);

    /* Compute the final x and y and set a vertex there for the shape */
    const x = noised * r * cos(a + frameCount * ROTATION_SPEED);
    const y = noised * r * sin(a + frameCount * ROTATION_SPEED);
    vertex(cx + x, cy + y);
  }
  endShape(CLOSE);
}

function drawLine(z, cx, cy, angleStart, angleEnd, r) {
  stroke(PALETTE.darkish);
  noFill();
  beginShape();

  for (let a = angleStart; a < angleEnd; a += TWO_PI / POINT_COUNT) {
    const xOff = map(cos(a) + 1, -1, 1, 1, 1 + NOISE_AMP_LINES);
    const yOff = map(sin(a) + 1, -1, 1, 1, 1 + NOISE_AMP_LINES);

    /* Get noise based on x, y, and the "time" */
    const noised = noise(xOff, yOff, z + (frameCount * NOISE_SPEED) / 2);

    /* Compute the final x and y and set a vertex there for the shape */
    const x = cx + noised * r * cos(a);
    const y = cy + noised * r * sin(a);
    vertex(x, y);
  }
  endShape();
  noStroke();
}

function clickOnSave() {
  saveCanvas();
}
