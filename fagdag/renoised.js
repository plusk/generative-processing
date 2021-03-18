/* The degree to which noise affects the blobs */
/* Low values are blobby, high values are spikey */
const BLOB_SPIKYNESS = 0.5;

/* How much effect does each peak have on the radius? */
const BLOB_AMP = 1.2;

const BLOB_SPEED = 0.002;

const STROKE_WEIGHT = 2;

/* The amount of points that make up each layer, lower means "pointier" */
/* For example 3 points mean triangular layers, 4 means squares */
/* Higher might not be noticable, but will make for smoother borders */
const POINT_COUNT = 300;

const TEXT_SIZE = 32;

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
  text("Frokostseminaret", width / 2, height / 2);
  text("for frontend", width / 2, height / 2 + TEXT_SIZE);

  drawBlob(100, 0, 0, height * 1.25, 0, PI, true);
  drawBlob(200, width, height, height, PI, PI + HALF_PI, true);
  drawBlob(201, width, height, height * 0.75, PI, PI + HALF_PI, true);
}

function drawBlob(
  z,
  cx,
  cy,
  r,
  angleStart = 0,
  angleEnd = TWO_PI,
  line = false
) {
  if (line) {
    stroke(PALETTE.darkish);
    noFill();
  }

  /* Iterate through a full circle of angles to make a layer */
  beginShape();
  for (let a = angleStart; a < angleEnd; a += TWO_PI / POINT_COUNT) {
    /* Maybe overcomplicated way of getting x and y coordinate in noise field */

    /* Get noise based on x, y, and the "time" */
    const xOff = 1 + cos(a);
    const yOff = 1 + sin(a);
    const noised = noise(
      xOff * BLOB_SPIKYNESS,
      yOff * BLOB_SPIKYNESS,
      z + frameCount * BLOB_SPEED
    );
    /* Compute the final x and y and set a vertex there for the shape */
    const x = 0.2 + noised * r * BLOB_AMP * cos(a);
    const y = 0.2 + noised * r * BLOB_AMP * sin(a);
    vertex(cx + x, cy + y);
  }
  if (line) {
    endShape();
  } else {
    endShape(CLOSE);
  }

  if (line) {
    noStroke();
  }
}

function clickOnSave() {
  saveCanvas();
}
