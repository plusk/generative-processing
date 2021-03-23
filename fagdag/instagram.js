let vMax, vMin, PALETTE, BEKK_PALETTE, BLOBS, SPOTS;

// How spiky the blobs are
const BLOB_AMP = 0.5;
const BLOB_LINE_AMP = 0.75;

// How steep the easing curve is, tends to push blobs to their rMin or rMax
const BLOB_EASE_STEEPNESS = 3;

// The speed at which blobs grow and shrink
const BLOB_ANIMATION_SPEED = 0.002;

// The speed at which the blob rotates in perlin noise space, made more noticable by more spiky blobs
const ROTATION_SPEED = 0.002;

// A rough representation of the number of vertices that make up a blob, lower value = more points
const MAX_POINT_DIST = 10;

// Intrinsically tied to the rMin of central blob
const TEXT_SIZE = 84;

// The thickness of lines
const STROKE_WEIGHT = 2;

const RANDOM_COLORS = false;

const SPOT_COUNT = 30;
const SPOT_SPREAD = 6;
const SPOT_SLANT = 5;
const SLOT_APPEAR_NOISE = 0.004;

const MOVE_SPEED = 0.1;
const MOVE_RADIUS = 100;

/*
  Config end
*/

function easeInOutCool(steepness, x) {
  const mappedX = map(x, 0, 1, -1, 1);
  return (1 + Math.tanh(steepness * mappedX)) / 2;
}

function randomColor() {
  const keys = Object.keys(BEKK_PALETTE);
  return BEKK_PALETTE[keys[(keys.length * Math.random()) << 0]];
}

class Blob {
  constructor({
    z,
    cx,
    cy,
    mrx = 0,
    mry = 0,
    mSpeed = 0,
    mAngle = random(TWO_PI),
    rMin,
    rMax,
    fillColor,
    aStart = 0,
    aEnd = TWO_PI,
    line = false,
    animationSpeed = BLOB_ANIMATION_SPEED,
    steepness = BLOB_EASE_STEEPNESS,
    disappearTime = 0,
  }) {
    this.z = z;
    this.cx = cx;
    this.cy = cy;
    this.mrx = mrx;
    this.mry = mry;
    this.mSpeed = mSpeed;
    this.mAngle = mAngle;
    this.rMin = rMin;
    this.rMax = rMax;
    this.fillColor = fillColor;
    this.aStart = aStart;
    this.aEnd = aEnd;
    this.line = line;
    this.animationSpeed = animationSpeed;
    this.steepness = steepness;
    this.disappearTime = disappearTime;
    this.visible = this.disappearTime === 0;
    this.disappearTick =
      noise(cx * SLOT_APPEAR_NOISE, cy * SLOT_APPEAR_NOISE) *
      this.disappearTime *
      (1 - cy / height);
  }

  draw() {
    if (this.disappearTime !== 0) {
      this.disappearTick++;
      if (this.disappearTick >= this.disappearTime) {
        this.visible = !this.visible;
        this.disappearTick = 0;
      }
    }

    if (!this.visible) {
      return;
    }

    if (this.line) {
      stroke(PALETTE.darkish);
      noFill();
    } else {
      fill(this.fillColor);
    }

    // Might put all of this in the constructor
    const pointCount = max((TWO_PI * this.rMax) / MAX_POINT_DIST, 30);
    const deltaA = this.aEnd - this.aStart;
    const amp = this.line ? BLOB_LINE_AMP : BLOB_AMP;

    const rotation = frameCount * ROTATION_SPEED;
    this.mAngle = (this.mAngle + this.mSpeed) % TWO_PI;

    /* Iterate through a full circle of angles to draw a blob */
    beginShape();
    for (let a = this.aStart; a <= this.aEnd; a += deltaA / pointCount) {
      // Get coordinates in the perlin noise space
      const xOff = map(cos(a + rotation), -1, 1, 0, amp);
      const yOff = map(sin(a + rotation), -1, 1, 0, amp);

      const noiseValue = noise(
        xOff,
        yOff,
        this.z + frameCount * this.animationSpeed
      );

      const adjustedNoiseValue = easeInOutCool(this.steepness, noiseValue);
      const noisedRadius = map(adjustedNoiseValue, 0, 1, this.rMin, this.rMax);

      /* Compute the final x and y and set a vertex there for the shape */
      const x = noisedRadius * cos(a);
      const y = noisedRadius * sin(a);

      if (!this.line) {
        const mx = this.mrx * cos(this.mAngle);
        const my = this.mry * sin(this.mAngle);
        vertex(this.cx + mx + x, this.cy + my + y);
      } else {
        vertex(this.cx + x, this.cy + y);
      }
    }

    if (line) {
      endShape();
      noStroke();
    } else {
      endShape(CLOSE);
    }
  }
}

function windowResized() {
  vMax = max(width, height);
  vMin = min(width, height);

  //resizeCanvas(1080, 1080);
  // resizeCanvas(1080, 1920);
  // resizeCanvas(windowWidth, round(windowWidth / 2.75));
}

function setup() {
  colorMode(HSL);
  //createCanvas(1080, 1080);
  createCanvas(windowWidth, round(windowWidth / 2.75));

  windowResized();

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
    // sort: color("#0E0E0E"),
    // hvit: color("#FFFFFF"),
    soloppgang: color("#FFB88D"),
    // soloppgang_kontrast: color("#FF8034"),
    regn: color("#BCCEDD"),
    // regn_kontrast: color("#7E9CB9"),
    skyfritt: color("#B1E8FF"),
    // skyfritt_kontrast: color("#43CBFF"),
    overskyet: color("#E7E7E7"),
    // overskyet_kontrast: color("#CECECE"),
    solnedgang: color("#FF9999"),
    // solnedgang_kontrast: color("#FF5B5B"),
    // sol: color("#FFF2AD"),
    // sol_kontrast: color("#FFF02B"),
    kveld: color("#E5B1FF"),
    // kveld_kontrast: color("#8E24C9"),
    grønn: color("#A1F5E3"),
    // grønn_kontrast: color("#16DBC4"),
    natt: color("#6D7ABB"),
    // natt_kontrast: color("#162365"),
  };
  PALETTE.darkish.setAlpha(0.75);

  BLOBS = [
    new Blob({
      z: 100,
      cx: -width * 0.1,
      cy: height * 0.9,
      rMin: vMin * 0.1,
      rMax: vMin * 0.3,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.yellow,
    }),
    new Blob({
      z: 200,
      cx: -width * 0.1,
      cy: height * 0.1,
      rMin: vMin * 0.1,
      rMax: vMin * 0.45,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.pink,
    }),
    new Blob({
      z: 300,
      cx: 0,
      cy: height * 0.5,
      rMin: vMin * 0.1,
      rMax: vMin * 0.2,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.dark,
    }),
    new Blob({
      z: 400,
      cx: width * 0.9,
      cy: height,
      rMin: vMin * 0.1,
      rMax: vMin * 0.3,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.white,
    }),
    new Blob({
      z: 500,
      cx: width * 0.9,
      cy: height * 0.8,
      rMin: vMin * 0.1,
      rMax: vMin * 0.3,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.yellow,
    }),
    new Blob({
      z: 600,
      cx: width * 1.2,
      cy: height / 2,
      rMin: vMin * 0.2,
      rMax: vMin * 0.4,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.teal,
    }),
    new Blob({
      z: 100,
      cx: 0,
      cy: 0,
      rMin: vMin * 0.2,
      rMax: vMin * 0.4,
      aEnd: PI,
      line: true,
    }),
    new Blob({
      z: 200,
      cx: width,
      cy: height,
      rMin: vMin * 0.1,
      rMax: vMin * 0.3,
      aStart: PI,
      aEnd: PI + HALF_PI,
      line: true,
    }),
    new Blob({
      z: 300,
      cx: width,
      cy: height,
      rMin: vMin * 0.15,
      rMax: vMin * 0.35,
      aStart: PI,
      aEnd: PI + HALF_PI,
      line: true,
    }),
    new Blob({
      z: 3,
      cx: width / 2,
      cy: height / 2,
      rMin: vMin * 0.1,
      rMax: vMin * 0.25,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.white,
    }),
    new Blob({
      z: 2,
      cx: width / 2,
      cy: height / 2,
      rMin: vMin * 0.2,
      rMax: vMin * 0.35,
      fillColor: PALETTE.dark,
    }),
  ];

  LINES = [];

  SPOTS = [];

  const SPOT_RMAX = vMin * 0.02;

  for (let i = 0; i < SPOT_COUNT; i++) {
    SPOTS.push(
      new Blob({
        z: i,
        cx:
          width * 0.2 +
          random(-SPOT_RMAX * SPOT_SPREAD, SPOT_RMAX * SPOT_SPREAD) -
          i * SPOT_SLANT,
        cy: (i * SPOT_RMAX) / 2,
        rMin: vMin * 0.005,
        rMax: SPOT_RMAX,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.blue,
        animationSpeed: 0,
        steepness: 6,
        disappearTime: 500,
      })
    );
    SPOTS.push(
      new Blob({
        z: i + SPOT_COUNT,
        cx:
          width * 0.8 +
          random(-SPOT_RMAX * SPOT_SPREAD, SPOT_RMAX * SPOT_SPREAD) +
          i * SPOT_SLANT,
        cy: height - (i * SPOT_RMAX) / 2,
        rMin: vMin * 0.005,
        rMax: SPOT_RMAX,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.blue,
        animationSpeed: 0,
        steepness: 6,
        disappearTime: 500,
      })
    );
  }

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
    const blob = BLOBS[b];
    blob.draw();
  }

  for (let s = 0; s < SPOTS.length; s++) {
    const spot = SPOTS[s];
    spot.draw();
  }

  fill(PALETTE.white);
  text("Frontend", width / 2, height / 2);
  text("til frokost", width / 2, height / 2 + TEXT_SIZE);
}
