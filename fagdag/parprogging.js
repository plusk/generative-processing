let vMax, vMin, PALETTE, BEKK_PALETTE, BLOBS;

// How spiky the blobs are
const BLOB_AMP = 0.5;
const BLOB_LINE_AMP = 0.75;

// Best results with value >= 2
const BLOB_EASE_AMP = 3;

const BLOB_ANIMATION_SPEED = 0.002;

const STROKE_WEIGHT = 2;

const ROTATION_SPEED = 0.002;

/* The amount of points that make up each layer, lower means "pointier" */
/* For example 3 points mean triangular layers, 4 means squares */
/* Higher might not be noticable, but will make for smoother borders */
const MAX_POINT_DIST = 10;

const TEXT_SIZE = 48;

const RANDOM_COLORS = false;

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

function randomColor() {
  const keys = Object.keys(BEKK_PALETTE);
  return BEKK_PALETTE[keys[(keys.length * Math.random()) << 0]];
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

  BEKK_PALETTE = {
    sort: color("#0E0E0E"),
    hvit: color("#FFFFFF"),
    soloppgang: color("#FFB88D"),
    soloppgang_kontrast: color("#FF8034"),
    regn: color("#BCCEDD"),
    regn_kontrast: color("#7E9CB9"),
    skyfritt: color("#B1E8FF"),
    skyfritt_kontrast: color("#43CBFF"),
    overskyet: color("#E7E7E7"),
    overskyet_kontrast: color("#CECECE"),
    solnedgang: color("#FF9999"),
    solnedgang_kontrast: color("#FF5B5B"),
    sol: color("#FFF2AD"),
    sol_kontrast: color("#FFF02B"),
    kveld: color("#E5B1FF"),
    kveld_kontrast: color("#8E24C9"),
    grønn: color("#A1F5E3"),
    grønn_kontrast: color("#16DBC4"),
    natt: color("#6D7ABB"),
    natt_kontrast: color("#16236"),
  };
  PALETTE.darkish.setAlpha(0.75);

  BLOBS = [
    {
      z: 100,
      cx: -width * 0.1,
      cy: height * 0.9,
      rMin: vMin * 0.1,
      rMax: vMax * 0.3,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.yellow,
    },
    {
      z: 200,
      cx: -width * 0.1,
      cy: height * 0.1,
      rMin: vMin * 0.1,
      rMax: vMin * 0.45,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.pink,
    },
    {
      z: 300,
      cx: 0,
      cy: height * 0.5,
      rMin: vMin * 0.1,
      rMax: vMin * 0.2,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.dark,
    },
    {
      z: 400,
      cx: width * 0.9,
      cy: height,
      rMin: vMin * 0.1,
      rMax: vMin * 0.3,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.white,
    },
    {
      z: 500,
      cx: width * 0.9,
      cy: height * 0.8,
      rMin: vMin * 0.1,
      rMax: vMin * 0.3,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.yellow,
    },
    {
      z: 600,
      cx: width * 1.2,
      cy: height / 2,
      rMin: vMin * 0.2,
      rMax: vMin * 0.4,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.teal,
    },
    {
      z: 100,
      cx: 0,
      cy: 0,
      rMin: vMin * 0.2,
      rMax: vMin * 0.4,
      aEnd: PI,
      line: true,
    },
    {
      z: 200,
      cx: width,
      cy: height,
      rMin: vMin * 0.1,
      rMax: vMin * 0.3,
      aStart: PI,
      aEnd: PI + HALF_PI,
      line: true,
    },
    {
      z: 300,
      cx: width,
      cy: height,
      rMin: vMin * 0.15,
      rMax: vMin * 0.35,
      aStart: PI,
      aEnd: PI + HALF_PI,
      line: true,
    },
    {
      z: 3,
      cx: width / 2,
      cy: height / 2,
      rMin: vMin * 0.1,
      rMax: vMin * 0.25,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.white,
    },
    {
      z: 2,
      cx: width / 2,
      cy: height / 2,
      rMin: vMin * 0.1,
      rMax: vMin * 0.35,
      fillColor: PALETTE.dark,
    },
  ];

  colorMode(HSL);
  BG = color(PALETTE.bg);

  textAlign(CENTER);
  textFont("Newzald");
  textSize(TEXT_SIZE);

  noStroke();
  strokeCap(PROJECT);
}

function draw() {
  /* Home-made helper function to select background based on config */
  background(BG);

  for (let b = 0; b < BLOBS.length; b++) {
    const blobParameters = BLOBS[b];
    drawBlob(blobParameters);
  }

  fill(PALETTE.white);
  text("Frontend", width / 2, height / 2);
  text("til frokost", width / 2, height / 2 + TEXT_SIZE);
}

function easeInOutCool(x) {
  const mappedX = map(x, 0, 1, -1, 1);
  return (1 + Math.tanh(BLOB_EASE_AMP * mappedX)) / 2;
}

function drawBlob({
  z,
  cx,
  cy,
  rMin,
  rMax,
  fillColor,
  aStart = 0,
  aEnd = TWO_PI,
  line = false,
}) {
  if (line) {
    stroke(PALETTE.darkish);
    noFill();
  } else {
    fill(fillColor);
  }

  const pointCount = (TWO_PI * rMax) / MAX_POINT_DIST;
  const deltaA = aEnd - aStart;

  const rotation = frameCount * ROTATION_SPEED;

  const amp = line ? BLOB_LINE_AMP : BLOB_AMP;

  /* Iterate through a full circle of angles to make a layer */
  beginShape();
  for (let a = aStart; a <= aEnd; a += deltaA / pointCount) {
    /* Get noise aEnd on x, y, and the "time" */
    const xOff = map(cos(a + rotation), -1, 1, 0, amp);
    const yOff = map(sin(a + rotation), -1, 1, 0, amp);

    const noiseValue = noise(xOff, yOff, z + frameCount * BLOB_ANIMATION_SPEED);

    const adjustedNoiseValue = easeInOutCool(noiseValue);
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
