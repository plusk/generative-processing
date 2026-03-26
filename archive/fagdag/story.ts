import p5 from "p5";
import palettesData from "../../palettes.json";

new p5((p: p5) => {
  let vMax: any, vMin: any, TEXT_SIZE: any, PALETTE: any, BEKK_PALETTE: any, BLOBS: any, SPOTS: any;
  let BG: any;

  const EXPORT = false;
  const FRAME_LIMIT = 15 * 30; // 15 seconds at 30 fps

  // How spiky the blobs are
  const BLOB_AMP = 0.5;
  const LINE_AMP = 0.75;
  const SPOT_AMP = 0.5;

  // How steep the easing curve is, tends to push blobs to their rMin or rMax
  const BLOB_EASE_STEEPNESS = 4;
  const SPOT_EASE_STEEPNESS = 5;
  const LINE_EASE_STEEPNESS = 2;

  // The speed at which blobs grow and shrink
  const BLOB_ANIMATION_SPEED = 0.004;

  // The speed at which the blob rotates in perlin noise space, made more noticable by more spiky blobs
  const ROTATION_SPEED = 0.004;

  // A rough representation of the number of vertices that make up a blob, lower value = more points
  const MAX_POINT_DIST = 15;

  // The thickness of lines
  const STROKE_WEIGHT = 2;

  const RANDOM_COLORS = false;

  const SPOT_COUNT = 40;
  const SPOT_X_SPREAD = 7;
  const SPOT_Y_SPREAD = 0.5;
  const SPOT_SLANT = 3;
  const SPOT_APPEAR_NOISE = 0.005;
  const SPOT_DURATION = EXPORT ? FRAME_LIMIT / 2 : 250; // 0 means the spots will always be visible

  const MOVE_SPEED = 0.1;
  const MOVE_RADIUS = 100;

  /*
    Config end
  */

  const easeInOutCool = (steepness: number, x: number) => {
    const mappedX = p.map(x, 0, 1, -1, 1);
    return (1 + Math.tanh(steepness * mappedX)) / 2;
  };

  const randomColor = () => {
    const keys = Object.keys(BEKK_PALETTE);
    return BEKK_PALETTE[keys[(keys.length * Math.random()) << 0]];
  };

  class Shape {
    z: any; cx: any; cy: any; mrx: any; mry: any; mSpeed: any; mAngle: any;
    rMin: any; rMax: any; amp: any; fillColor: any; aStart: any; aEnd: any;
    line: any; animationSpeed: any; steepness: any; disappearTime: any;
    visible: any; disappearTick: any;

    constructor({
      z,
      cx,
      cy,
      mrx = 0,
      mry = 0,
      mSpeed = 0,
      mAngle = p.random(p.TWO_PI),
      rMin,
      rMax,
      amp = BLOB_AMP,
      fillColor,
      aStart = 0,
      aEnd = p.TWO_PI,
      line = false,
      animationSpeed = BLOB_ANIMATION_SPEED,
      steepness = BLOB_EASE_STEEPNESS,
      disappearTime = 0,
    }: any) {
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
        p.noise(cx * SPOT_APPEAR_NOISE, cy * SPOT_APPEAR_NOISE) *
        this.disappearTime *
        (1 - cy / p.height);
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
        p.stroke(PALETTE.new_dark_line);
        p.noFill();
      } else {
        p.fill(this.fillColor);
      }

      // Might put all of this in the constructor
      const pointCount = p.max((p.TWO_PI * this.rMax) / MAX_POINT_DIST, 30);
      const deltaA = this.aEnd - this.aStart;
      const amp = this.amp;

      const rotation = p.frameCount * ROTATION_SPEED;
      this.mAngle = (this.mAngle + this.mSpeed) % p.TWO_PI;

      /* Iterate through a full circle of angles to draw a blob */
      p.beginShape();
      for (let a = this.aStart; a <= this.aEnd; a += deltaA / pointCount) {
        // Get coordinates in the perlin noise space
        const xOff = p.map(p.cos(a + rotation), -1, 1, 0, amp);
        const yOff = p.map(p.sin(a + rotation), -1, 1, 0, amp);

        const noiseValue = p.noise(
          xOff,
          yOff,
          this.z + p.frameCount * this.animationSpeed
        );

        const adjustedNoiseValue = easeInOutCool(this.steepness, noiseValue);
        const noisedRadius = p.map(adjustedNoiseValue, 0, 1, this.rMin, this.rMax);

        /* Compute the final x and y and set a vertex there for the shape */
        const x = noisedRadius * p.cos(a);
        const y = noisedRadius * p.sin(a);

        if (!this.line) {
          const mx = this.mrx * p.cos(this.mAngle);
          const my = this.mry * p.sin(this.mAngle);
          p.vertex(this.cx + mx + x, this.cy + my + y);
        } else {
          p.vertex(this.cx + x, this.cy + y);
        }
      }

      if (this.line) {
        p.endShape();
        p.noStroke();
      } else {
        p.endShape(p.CLOSE);
      }
    }
  }

  const setupBlobs = () => {
    BLOBS = [
      new Shape({
        z: 10,
        cx: p.width * -0.1,
        cy: p.height * 0.9,
        rMin: vMin * 0.2,
        rMax: vMin * 0.5,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.sol_kontrast,
      }),
      new Shape({
        z: 20,
        cx: p.width * 0,
        cy: p.height * 0.1,
        rMin: vMin * 0.2,
        rMax: vMin * 0.45,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.kveld,
      }),
      new Shape({
        z: 30,
        cx: p.width * -0.2,
        cy: p.height * 0.5,
        rMin: vMin * 0.2,
        rMax: vMin * 0.5,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.new_dark,
      }),
      new Shape({
        z: 40,
        cx: p.width * 0.8,
        cy: p.height * 0.9,
        rMin: vMin * 0.2,
        rMax: vMin * 0.4,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.hvit,
      }),
      new Shape({
        z: 50,
        cx: p.width * 1,
        cy: p.height * 0.7,
        rMin: vMin * 0.2,
        rMax: vMin * 0.5,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.sol_kontrast,
      }),
      new Shape({
        z: 60,
        cx: p.width * 1.2,
        cy: p.height * 0.5,
        rMin: vMin * 0.2,
        rMax: vMin * 0.4,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.grønn_kontrast,
      }),
      new Shape({
        z: 100,
        cx: 0,
        cy: 0,
        rMin: vMin * 0.2,
        rMax: vMin * 0.6,
        aEnd: p.PI,
        line: true,
        amp: LINE_AMP,
        steepness: LINE_EASE_STEEPNESS,
      }),
      new Shape({
        z: 200,
        cx: p.width,
        cy: p.height,
        rMin: vMin * 0.2,
        rMax: vMin * 0.6,
        aStart: p.PI,
        aEnd: p.PI + p.HALF_PI,
        line: true,
        amp: LINE_AMP,
        steepness: LINE_EASE_STEEPNESS,
      }),
      new Shape({
        z: 300,
        cx: p.width,
        cy: p.height,
        rMin: vMin * 0.15,
        rMax: vMin * 0.55,
        aStart: p.PI,
        aEnd: p.PI + p.HALF_PI,
        line: true,
        amp: LINE_AMP,
        steepness: LINE_EASE_STEEPNESS,
      }),
      new Shape({
        z: 1000,
        cx: p.width / 2,
        cy: p.height / 2,
        rMin: vMin * 0.15,
        rMax: vMin * 0.3,
        fillColor: RANDOM_COLORS ? randomColor() : PALETTE.hvit,
      }),
      new Shape({
        z: 2000,
        cx: p.width / 2,
        cy: p.height / 2,
        rMin: vMin * 0.2,
        rMax: vMin * 0.35,
        fillColor: PALETTE.new_dark,
      }),
    ];

    SPOTS = [];
    const SPOT_RMAX = vMin * 0.02;
    for (let i = 0; i < SPOT_COUNT; i++) {
      SPOTS.push(
        new Shape({
          z: i,
          cx:
            p.width * 0.3 +
            p.random(-SPOT_RMAX * SPOT_X_SPREAD, SPOT_RMAX * SPOT_X_SPREAD) -
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
            p.width * 0.7 +
            p.random(-SPOT_RMAX * SPOT_X_SPREAD, SPOT_RMAX * SPOT_X_SPREAD) +
            i * SPOT_SLANT,
          cy: p.height - i * SPOT_RMAX * SPOT_Y_SPREAD,
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
  };

  const windowResized = () => {
    vMin = p.min(p.width, p.height);
    vMax = p.max(p.width, p.height);
    (p as any).resizeCanvas(1080, 1920);

    setupBlobs();

    // Intrinsically tied to the rMin of central blob
    TEXT_SIZE = vMin * 0.075;
    p.textSize(TEXT_SIZE);
  };

  p.setup = () => {
    p.colorMode(p.HSL);
    p.createCanvas(1080, 1920);
    p.pixelDensity(1);
    p.frameRate(EXPORT ? 4 : 30);

    PALETTE = {
      new_dark: p.color("#1c2c3c"),
      new_dark_line: p.color("#1c2c3c"),
      new_blue: p.color("#293895"),
      // sort: p.color("#0E0E0E"),
      hvit: p.color("#FFFFFF"),
      soloppgang: p.color("#FFB88D"),
      // soloppgang_kontrast: p.color("#FF8034"),
      // regn: p.color("#BCCEDD"),
      // regn_kontrast: p.color("#7E9CB9"),
      skyfritt: p.color("#B1E8FF"),
      // skyfritt_kontrast: p.color("#43CBFF"),
      // overskyet: p.color("#E7E7E7"),
      // overskyet_kontrast: p.color("#CECECE"),
      solnedgang: p.color("#FF9999"),
      // solnedgang_kontrast: p.color("#FF5B5B"),
      sol: p.color("#FFF2AD"),
      sol_kontrast: p.color("#FFF02B"),
      kveld: p.color("#E5B1FF"),
      // kveld_kontrast: p.color("#8E24C9"),
      // grønn: p.color("#A1F5E3"),
      grønn_kontrast: p.color("#16DBC4"),
      // natt: p.color("#6D7ABB"),
      // natt_kontrast: p.color("#162365"),
    };
    PALETTE.new_dark_line.setAlpha(0.75);
    BG = PALETTE.sol;

    windowResized();
    setupBlobs();

    p.textAlign(p.CENTER);
    (p as any).textFont("Newzald");

    p.strokeWeight(STROKE_WEIGHT);
    p.noStroke();
    (p as any).strokeCap((p as any).PROJECT);
  };

  p.draw = () => {
    /* Home-made helper function to select background based on config */
    p.background(BG);

    for (let b = 0; b < BLOBS.length; b++) {
      const blob = BLOBS[b];
      blob.draw();
    }

    for (let s = 0; s < SPOTS.length; s++) {
      const spot = SPOTS[s];
      spot.draw();
    }

    p.fill(PALETTE.hvit);
    p.text("Frontend", p.width / 2, p.height / 2);
    p.text("til frokost", p.width / 2, p.height / 2 + TEXT_SIZE);

    if (EXPORT) {
      p.saveCanvas(p.frameCount.toString().padStart(3, "0"), "png");
      if (FRAME_LIMIT < p.frameCount) {
        p.noLoop();
      }
    }
  };
});
