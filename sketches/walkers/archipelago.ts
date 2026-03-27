import p5 from "p5";
import { palettes } from "../../palettes";

const PALETTE_NAME = "speis";
const STROKE_WEIGHT = 2;
const THREAD_COUNT = 10 * 10;

const SPEED_DIFF = 5;
const NOISE_GRANULARITY = 0.005;
const OPACITY = 255;

const THREADS: any[] = [];

let cnv: any;
let palette: any;
let colors: any[];
let colors_bg: any;

new p5((p: p5) => {
  p.setup = () => {
    cnv = p.createCanvas(1080, 1080); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettes[PALETTE_NAME];
    //const keys = Object.keys(palettes);
    //palette = (palettes)[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = palette["bg"];

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);

    const angRandy = p.random(p.TWO_PI);

    const squirtle = p.sqrt(THREAD_COUNT);

    for (let t = 0; t < THREAD_COUNT; t++) {
      const collie = p.color(p.random(colors));
      collie.setAlpha(OPACITY);

      THREADS.push({
        x: ((p.width / squirtle) * (t + 0.5)) % p.width,
        y: ((p.height / squirtle) * (0.5 + p.ceil(t / squirtle))) % p.height,
        angle: angRandy,
        color: collie,
      });
    }
  };

  p.draw = () => {
    //p.background(colors_bg);

    for (let t = 0; t < THREADS.length; t++) {
      const thread = THREADS[t];
      p.stroke(thread.color);
      //p.circle(thread.x, thread.y, 100);
      //p.point(thread["x"], thread["y"]);
      updateThread(thread);
    }
  };

  const updateThread = (thread: any) => {
    let noize = p.noise(thread.x * NOISE_GRANULARITY, thread.y * NOISE_GRANULARITY);
    noize -= noize / 2;
    const xNew = thread.x + p.cos(thread.angle * noize) * SPEED_DIFF * p.random(-1, 1);
    const yNew = thread.y + p.sin(thread.angle * noize) * SPEED_DIFF * p.random(-1, 1);
    p.line(thread.x, thread.y, xNew, yNew);
    thread.x = xNew;
    thread.y = yNew;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
