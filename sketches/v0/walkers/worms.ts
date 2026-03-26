import p5 from "p5";
import palettesData from "../../../palettes.json";

// sydney
// redcent
// symmeblu
// termos
// vintage
// monster
const PALETTE_NAME = "genesis";
const SPEED = 5;
const STROKE_WEIGHT = 10;
const THREAD_COUNT = 200;
const NOISE_GRANULARITY = 0.005;
const NOISE_EVOLUTION = 0.01;
const OPACITY = 255;

const FADE_IN = OPACITY / 30;
let fade = 0;
let noize = 0;
const THREADS: any[] = [];

let cnv: any;
let palette: any;
let colors: any[];
let colors_bg: any;

let _timer = 0;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = (palettesData as any)[PALETTE_NAME];
    //const keys = Object.keys(palettesData);
    //palette = (palettesData as any)[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = p.color(palette["bg"]);
    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);

    const squirtle = p.sqrt(THREAD_COUNT);
    for (let t = 0; t < THREAD_COUNT; t++) {
      const collie = p.color(p.random(colors));
      if (OPACITY >= fade) collie.setAlpha(fade);
      THREADS.push({
        x: ((p.width / squirtle) * t) % p.width,
        y: ((p.height / squirtle) * p.ceil(t / squirtle)) % p.height,
        angle: p.PI / 2,
        color: collie,
        strokeWeight: p.random(STROKE_WEIGHT * 0.5, STROKE_WEIGHT * 2),
      });
    }
  };

  p.draw = () => {
    fade += FADE_IN;
    noize += NOISE_EVOLUTION;
    //p.background(colors_bg);

    for (let t = 0; t < THREADS.length; t++) {
      const thread = THREADS[t];
      if (OPACITY >= fade) thread.color.setAlpha(fade);
      p.strokeWeight(thread.strokeWeight);
      //p.fill(thread.color);
      p.stroke(thread.color);
      updateThread(thread);
    }
    _timer++;
  };

  const updateThread = (thread: any) => {
    let noisebois = p.noise(thread.x * NOISE_GRANULARITY, thread.y * NOISE_GRANULARITY, noize);
    let xOld = thread.x;
    let yOld = thread.y;
    let xNew = xOld + p.cos(thread.angle * noisebois) * SPEED;
    let yNew = yOld + p.sin(thread.angle * noisebois) * SPEED;
    if (xNew <= 0) {
      xOld = p.width;
      xNew = p.width - xNew;
    } else if (xNew >= p.width) {
      xOld = 0;
      xNew = xNew % p.width;
    }
    if (yNew <= 0) {
      yOld = p.height;
      yNew = p.height - yNew;
    } else if (yNew >= p.height) {
      yOld = 0;
      yNew = yNew % p.height;
    }
    p.line(xOld, yOld, xNew, yNew);
    //p.circle(thread.x, thread.y, thread.strokeWeight / 2);
    //p.rect(thread.x, thread.y, thread.strokeWeight / 2, thread.strokeWeight / 2);
    //p.point(thread.x, thread.y);

    thread.x = xNew;
    thread.y = yNew;
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
