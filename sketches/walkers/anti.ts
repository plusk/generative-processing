import p5 from "p5";
import { palettes } from "../../palettes";

const PALETTE_NAME = "onom";
const STROKE_WEIGHT = 2;
const THREAD_COUNT = 1000;
const SPEED = 10;

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
    // const keys = Object.keys(palettes);
    // palette = (palettes)[keys[(keys.length * Math.random()) << 0]];
    colors = palette["colors"];
    colors_bg = palette["bg"];

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);
    p.stroke(p.random(colors));

    for (let t = 0; t < THREAD_COUNT; t++) {
      THREADS.push({
        x: p.width / 2,
        y: p.height / 2,
        xSpeed: p.random(-SPEED, SPEED),
        ySpeed: p.random(-SPEED, SPEED),
      });
    }
  };

  p.draw = () => {
    for (let t = 0; t < THREADS.length; t++) {
      const thread = THREADS[t];
      p.point(thread["x"], thread["y"]);

      updateThread(t, thread);
    }
    p.circle(p.width / 2, p.height / 2, 100);
  };

  const updateThread = (t: any, thread: any) => {
    thread.x += thread.xSpeed;
    thread.y += thread.ySpeed;
    THREADS[t] = thread;
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
