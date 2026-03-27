import p5 from "p5";
import { palettes } from "../../palettes";

const FRAME_LIMIT = 30;
const PALETTE_NAME = "pastella"; //mono retro redcent symmeblu pastella termos vintage
const STROKE_WEIGHT_START = 100;
const STROKE_WEIGHT = 5;
const STROKE_WEIGHT_DIFF = (STROKE_WEIGHT_START - STROKE_WEIGHT) / FRAME_LIMIT;
const THREAD_COUNT = 144;
const SPEED = 10;
const NOISE_GRANULARITY = 0.005; //0.005
//const NOISE_EVOLUTION = 0.0001;
const OPACITY = 255;

const FADE_IN = OPACITY / FRAME_LIMIT;
let fade = 0;
let noize = 0;
const THREADS: any[] = [];

let cnv: any;
let palette: any;
let colors: any[];
let colors_bg: any;

let timer = 0;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettes[PALETTE_NAME];
    //const keys = Object.keys(palettes);
    //palette = (palettes)[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = p.color(palette["bg"]);
    p.background(colors_bg);

    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);

    const angRandy = p.random(p.PI);
    const squirtle = p.sqrt(THREAD_COUNT);
    for (let t = 0; t < THREAD_COUNT; t++) {
      const collie = p.color(p.random(colors));
      if (OPACITY >= fade) collie.setAlpha(fade);
      THREADS.push({
        x: ((p.width / squirtle) * t) % p.width,
        y: ((p.height / squirtle) * p.ceil(t / squirtle)) % p.height,
        angle: angRandy,
        color: collie,
        strokeWeight: STROKE_WEIGHT_START,
      });
    }
  };

  p.draw = () => {
    fade += FADE_IN;
    //noize += NOISE_EVOLUTION;
    //p.background(colors_bg);

    for (let t = 0; t < THREADS.length; t++) {
      const thread = THREADS[t];
      if (OPACITY >= fade) thread.color.setAlpha(fade);
      p.strokeWeight(thread.strokeWeight);
      if (thread.strokeWeight - STROKE_WEIGHT_DIFF >= STROKE_WEIGHT) {
        thread.strokeWeight -= STROKE_WEIGHT_DIFF;
      } else {
        thread.strokeWeight = STROKE_WEIGHT;
      }
      p.stroke(thread.color);

      updateThread(thread);
    }
    timer++;
    if (timer > FRAME_LIMIT) {
      p.noLoop();
    }
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
    //p.point(thread.x, thread.y);

    thread.x = xNew;
    thread.y = yNew;
  };

  const clickOnSave = () => {
    p.saveCanvas();
  };
});
