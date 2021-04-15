let vMax, vMin, TEXT_SIZE, PALETTE, BLOBS, SPOTS;

const SHOW_TEXT = false;

// How spiky the blobs are
const BLOB_AMP = 0.5;
const LINE_AMP = 0.75;
const SPOT_AMP = 0.5;

// How steep the easing curve is, tends to push blobs to their rMin or rMax
const BLOB_EASE_STEEPNESS = 4;
const SPOT_EASE_STEEPNESS = 5;
const LINE_EASE_STEEPNESS = 2;

// The speed at which blobs grow and shrink
const BLOB_ANIMATION_SPEED = 0.002;

// The speed at which the blob rotates in perlin noise space, made more noticable by more spiky blobs
const ROTATION_SPEED = 0.002;

// A rough representation of the number of vertices that make up a blob, lower value = more points
const MAX_POINT_DIST = 15;

// The thickness of lines
const STROKE_WEIGHT = 2;

const RANDOM_COLORS = false;

const SPOT_COUNT = 40;
const SPOT_X_SPREAD = 7;
const SPOT_Y_SPREAD = 0.5;
const SPOT_SLANT = 2;
const SPOT_APPEAR_NOISE = 0.005;
const SPOT_DURATION = 500; // 0 means the spots will always be visible

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
  const keys = Object.keys(PALETTE);
  return PALETTE[keys[(keys.length * Math.random()) << 0]];
}

class Shape {
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
    amp = BLOB_AMP,
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
    this.amp = amp;
    this.fillColor = fillColor;
    this.aStart = aStart;
    this.aEnd = aEnd;
    this.line = line;
    this.animationSpeed = animationSpeed;
    this.steepness = steepness;
    this.disappearTime = disappearTime;
    this.visible = this.disappearTime === 0;
    this.disappearTick =
      noise(cx * SPOT_APPEAR_NOISE, cy * SPOT_APPEAR_NOISE) *
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
      stroke(PALETTE.new_dark_line);
      noFill();
    } else {
      fill(this.fillColor);
    }

    // Might put all of this in the constructor
    const pointCount = max((TWO_PI * this.rMax) / MAX_POINT_DIST, 30);
    const deltaA = this.aEnd - this.aStart;
    const amp = this.amp;

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

function setupBlobs() {
  BLOBS = [
    new Shape({
      z: 10,
      cx: 0,
      cy: height * 0.9,
      rMin: vMin * 0.1,
      rMax: vMin * 0.4,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.sol_kontrast,
    }),
    new Shape({
      z: 20,
      cx: width * 0.05,
      cy: height * 0.2,
      rMin: vMin * 0.25,
      rMax: vMin * 0.5,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.kveld,
    }),
    new Shape({
      z: 30,
      cx: 0,
      cy: height * 0.5,
      rMin: vMin * 0.1,
      rMax: vMin * 0.3,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.new_dark,
    }),
    new Shape({
      z: 40,
      cx: width * 0.8,
      cy: height,
      rMin: vMin * 0.1,
      rMax: vMin * 0.3,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.hvit,
    }),
    new Shape({
      z: 50,
      cx: width * 0.9,
      cy: height * 0.75,
      rMin: vMin * 0.2,
      rMax: vMin * 0.4,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.sol_kontrast,
    }),
    new Shape({
      z: 60,
      cx: width * 1,
      cy: height * 0.5,
      rMin: vMin * 0.2,
      rMax: vMin * 0.5,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.grønn_kontrast,
    }),
    new Shape({
      z: 100,
      cx: 0,
      cy: 0,
      rMin: vMin * 0.2,
      rMax: vMin * 0.8,
      aEnd: PI,
      line: true,
      amp: LINE_AMP,
      steepness: LINE_EASE_STEEPNESS,
    }),
    new Shape({
      z: 200,
      cx: width,
      cy: height,
      rMin: vMin * 0.25,
      rMax: vMin * 0.45,
      aStart: PI,
      aEnd: PI + HALF_PI,
      line: true,
      amp: LINE_AMP,
      steepness: LINE_EASE_STEEPNESS,
    }),
    new Shape({
      z: 300,
      cx: width,
      cy: height,
      rMin: vMin * 0.35,
      rMax: vMin * 0.55,
      aStart: PI,
      aEnd: PI + HALF_PI,
      line: true,
      amp: LINE_AMP,
      steepness: LINE_EASE_STEEPNESS,
    }),
    new Shape({
      z: 1000,
      cx: width / 2,
      cy: height / 2,
      rMin: vMin * 0.2,
      rMax: vMin * 0.4,
      fillColor: RANDOM_COLORS ? randomColor() : PALETTE.hvit,
    }),
    new Shape({
      z: 2000,
      cx: width / 2,
      cy: height / 2,
      rMin: vMin * 0.25,
      rMax: vMin * 0.45,
      fillColor: PALETTE.new_dark,
    }),
  ];

  SPOTS = [];
  const SPOT_RMAX = vMin * 0.025;
  for (let i = 0; i < SPOT_COUNT; i++) {
    SPOTS.push(
      new Shape({
        z: i,
        cx:
          width * 0.25 +
          random(-SPOT_RMAX * SPOT_X_SPREAD, SPOT_RMAX * SPOT_X_SPREAD) -
          i * SPOT_SLANT,
        cy: i * SPOT_RMAX * SPOT_Y_SPREAD,
        rMin: vMin * 0.005,
        rMax: SPOT_RMAX,
        amp: SPOT_AMP,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.new_blue,
        animationSpeed: 0,
        steepness: SPOT_EASE_STEEPNESS,
        disappearTime: SPOT_DURATION,
      })
    );
    SPOTS.push(
      new Shape({
        z: i + SPOT_COUNT,
        cx:
          width * 0.75 +
          random(-SPOT_RMAX * SPOT_X_SPREAD, SPOT_RMAX * SPOT_X_SPREAD) +
          i * SPOT_SLANT,
        cy: height - i * SPOT_RMAX * SPOT_Y_SPREAD,
        rMin: vMin * 0.005,
        rMax: SPOT_RMAX,
        amp: SPOT_AMP,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.new_blue,
        animationSpeed: 0,
        steepness: SPOT_EASE_STEEPNESS,
        disappearTime: SPOT_DURATION,
      })
    );
  }
}

function windowResized() {
  vMin = min(width, height);
  vMax = max(width, height);
  resizeCanvas(windowWidth, round(windowWidth / 2.75));

  setupBlobs();

  // Intrinsically tied to the rMin of central blob
  TEXT_SIZE = vMin * 0.1;
  textSize(TEXT_SIZE);
}

function setup() {
  colorMode(HSL);
  createCanvas(windowWidth, round(windowWidth / 2.75));

  PALETTE = {
    new_dark: color("#1c2c3c"),
    new_dark_line: color("#1c2c3c"),
    new_blue: color("#293895"),
    // sort: color("#0E0E0E"),
    hvit: color("#FFFFFF"),
    soloppgang: color("#FFB88D"),
    // soloppgang_kontrast: color("#FF8034"),
    // regn: color("#BCCEDD"),
    // regn_kontrast: color("#7E9CB9"),
    skyfritt: color("#B1E8FF"),
    // skyfritt_kontrast: color("#43CBFF"),
    // overskyet: color("#E7E7E7"),
    // overskyet_kontrast: color("#CECECE"),
    solnedgang: color("#FF9999"),
    // solnedgang_kontrast: color("#FF5B5B"),
    sol: color("#FFF2AD"),
    sol_kontrast: color("#FFF02B"),
    kveld: color("#E5B1FF"),
    // kveld_kontrast: color("#8E24C9"),
    // grønn: color("#A1F5E3"),
    grønn_kontrast: color("#16DBC4"),
    // natt: color("#6D7ABB"),
    // natt_kontrast: color("#162365"),
  };
  PALETTE.new_dark_line.setAlpha(0.75);
  BG = PALETTE.sol;

  windowResized();
  setupBlobs();

  textAlign(CENTER);
  textFont("Newzald");

  strokeWeight(STROKE_WEIGHT);
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

  if(SHOW_TEXT) {
    fill(PALETTE.hvit);
    text("Frontend", width / 2, height / 2);
    text("til frokost", width / 2, height / 2 + TEXT_SIZE);
  }
}
