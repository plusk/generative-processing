import p5 from "p5";
import { palettes } from "../../palettes";

const PALETTE_NAME = "genesis";
const STROKE_WEIGHT = 5;
const THREAD_COUNT = 1000;
const SPEED = 5;
const NOISE_GRANULARITY = 0.005;
//const NOISE_EVOLUTION = 0.0001;
const OPACITY = 255;
const FADE_IN = 5;

let fade = 0;
let noize = 0;
const THREADS: any[] = [];

let palette: any;
let colors: any[];
let colors_bg: any;

let _timer = 0;

new p5((p: p5) => {
  p.setup = () => {
    const cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettes[PALETTE_NAME];
    //const keys = Object.keys(palettes);
    //palette = (palettes)[keys[(keys.length * Math.random()) << 0]];
    colors = palette.colors;
    colors_bg = palette.bg;
    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);

    const _angRandy = p.random(p.TWO_PI);
    const squirtle = p.sqrt(THREAD_COUNT);
    for (let t = 0; t < THREAD_COUNT; t++) {
      const collie = p.color(p.random(colors));
      if (OPACITY >= fade) collie.setAlpha(fade);
      THREADS.push({
        x: ((p.width / squirtle) * (t + 0.5)) % p.width,
        y: ((p.height / squirtle) * (0.5 + p.ceil(t / squirtle))) % p.height,
        //angle: angRandy,
        angle: p.TWO_PI,
        color: collie,
      });
    }
  };

  p.draw = () => {
    fade += FADE_IN;
    //p.background(colors_bg);
    //noize += NOISE_EVOLUTION;

    for (let t = 0; t < THREADS.length; t++) {
      const thread = THREADS[t];
      thread.color.setAlpha(fade);
      p.stroke(thread.color);

      updateThread(thread);
    }
  };

  const updateThread = (thread: any) => {
    let noisebois = p.noise(thread.x * NOISE_GRANULARITY, thread.y * NOISE_GRANULARITY, noize);
    let xOld = thread.x;
    let yOld = thread.y;
    let xNew = xOld + p.cos(thread.angle * noisebois) * SPEED;
    let yNew = yOld + p.sin(thread.angle * noisebois) * SPEED;
    if (xNew <= 0) {
      xOld = 0;
      xNew = p.width - xNew;
    }
    if (yNew <= 0) {
      yOld = 0;
      yNew = p.height - yNew;
    }
    p.line(xOld, yOld, xNew, yNew);
    //p.circle(thread.x, thread.y, 50);
    //p.point(thread["x"], thread["y"]);

    thread.x = xNew % p.width;
    thread.y = yNew % p.height;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
