let vMax, vMin;

// How spiky the blobs are
const BLOB_AMP = 0.5;

const BLOB_SPEED = 0.002;

const STROKE_WEIGHT = 2;

const ROTATION_SPEED = 0.001;

/* The amount of points that make up each layer, lower means "pointier" */
/* For example 3 points mean triangular layers, 4 means squares */
/* Higher might not be noticable, but will make for smoother borders */
const MAX_POINT_DIST = 10;

const TEXT_SIZE = 48;

/*

  CONFIG END

*/

function windowResized() {
  vMax = max(width, height);
  vMin = min(width, height);

  resizeCanvas(1080, 1080);
  // resizeCanvas(1080, 1920);
  // resizeCanvas(windowWidth, round(windowWidth / 2.75));
}

function setup() {
  colorMode(HSL);
  const cnv = createCanvas(1080, 1080);
  // const cnv = createCanvas(1080, 1920);
  // const cnv = createCanvas(windowWidth, round(windowWidth / 2.75));

  windowResized();
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
  strokeCap(PROJECT);
}

function draw() {
  /* Home-made helper function to select background based on config */
  background(BG);

  fill(PALETTE.yellow);
  drawBlob({ z: 100, cx: 0, cy: height, rMin: vMin * 0.1, rMax: vMax * 0.2 });

  fill(PALETTE.pink);
  drawBlob({
    z: 200,
    cx: -width * 0.1,
    cy: height * 0.1,
    rMin: vMin * 0.1,
    rMax: vMin * 0.2,
  });

  fill(PALETTE.dark);
  drawBlob({
    z: 300,
    cx: 0,
    cy: height * 0.5,
    rMin: vMin * 0.1,
    rMax: vMin * 0.2,
  });

  fill(PALETTE.white);
  drawBlob({
    z: 400,
    cx: width * 0.8,
    cy: height,
    rMin: vMin * 0.1,
    rMax: vMin * 0.2,
  });

  fill(PALETTE.yellow);
  drawBlob({
    z: 500,
    cx: width * 0.9,
    cy: height * 0.8,
    rMin: vMin * 0.1,
    rMax: vMin * 0.2,
  });

  fill(PALETTE.teal);
  drawBlob({
    z: 600,
    cx: width,
    cy: height / 2,
    rMin: vMin * 0.1,
    rMax: vMin * 0.2,
  });

  drawBlob({
    z: 100,
    cx: 0,
    cy: 0,
    rMin: vMin * 0.1,
    rMax: vMin * 0.2,
    aEnd: PI,
    line: true,
  });
  drawBlob({
    z: 200,
    cx: width,
    cy: height,
    rMin: vMin * 0.1,
    rMax: vMin * 0.2,
    aStart: PI,
    aEnd: PI + HALF_PI,
    line: true,
  });
  drawBlob({
    z: 201,
    cx: width,
    cy: height,
    rMin: vMin * 0.1,
    rMax: vMin * 0.2,
    aStart: PI,
    aEnd: PI + HALF_PI,
    line: true,
  });

  //fill(PALETTE.white);
  //drawBlobz: ({1, width / 2, height / 2, height / 2});

  fill(PALETTE.dark);
  drawBlob({
    z: 2,
    cx: width / 2,
    cy: height / 2,
    rMin: vMin * 0.1,
    rMax: vMin * 0.3,
  });

  fill(PALETTE.white);
  text("Frontend", width / 2, height / 2);
  text("til frokost", width / 2, height / 2 + TEXT_SIZE);
}

function easeInOutCool(sharpness, x) {
  // Best results with sharpness >= 2
  const mappedX = map(x, 0, 1, -1, 1);
  return (1 + Math.tanh(sharpness * mappedX)) / 2;
}

function drawBlob({
  z,
  cx,
  cy,
  rMin,
  rMax,
  aStart = 0,
  aEnd = TWO_PI,
  line = false,
}) {
  if (line) {
    stroke(PALETTE.darkish);
    noFill();
  }

  const pointCount = (TWO_PI * rMax) / MAX_POINT_DIST;
  const deltaA = aEnd - aStart;

  const rotation = frameCount * ROTATION_SPEED;

  /* Iterate through a full circle of angles to make a layer */
  beginShape();
  for (let a = aStart; a <= aEnd; a += deltaA / pointCount) {
    /* Get noise aEnd on x, y, and the "time" */
    const xOff = map(cos(a + rotation), -1, 1, 0, BLOB_AMP);
    const yOff = map(sin(a + rotation), -1, 1, 0, BLOB_AMP);

    const noiseValue = noise(xOff, yOff, z + frameCount * BLOB_SPEED);

    const adjustedNoiseValue = easeInOutCool(4, noiseValue);
    const mappedNoise = map(adjustedNoiseValue, 0, 1, rMin, rMax);

    /* Compute the final x and y and set a vertex there for the shape */
    const x = mappedNoise * cos(a);
    const y = mappedNoise * sin(a);
    vertex(cx + x, cy + y);
  }

  if (line) {
    endShape();
    noStroke();
  } else {
    endShape(CLOSE);
  }
}

function clickOnSave() {
  saveCanvas();
}
