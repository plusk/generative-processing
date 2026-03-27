import p5 from "p5";
import { palettes } from "../palettes";

new p5((p: p5) => {
  let palette: any;
  let colors: any;
  let colors_bg: any;

  const PALETTE_NAME = "termos";

  const STROKE_WEIGHT = 1;
  const WAVE_COUNT = 100;
  const PADDING = 200;
  const AMP = 100;
  const TIGHTNESS = 150;
  const EVO = 0.01;

  let z = 0;

  let WAVE_COLORS: any[] = [];

  p.setup = () => {
    const cnv = p.createCanvas(1080, 1350); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    palette = palettes[PALETTE_NAME];
    //const keys = Object.keys(palettes);
    //palette = (palettes)[keys[(keys.length * Math.random()) << 0]];
    colors = palette.colors;
    colors_bg = palette.bg;

    p.background(colors_bg);
    p.strokeWeight(STROKE_WEIGHT);
    p.fill(colors_bg);
    p.stroke("white");

    for (let i = 0; i < WAVE_COUNT; i++) {
      WAVE_COLORS.push(p.random(colors));
    }
  };

  p.draw = () => {
    z += EVO;
    p.background(colors_bg);

    let a = 0;

    for (let y = PADDING; y < p.height - PADDING; y += p.height / WAVE_COUNT) {
      p.beginShape();
      p.fill(WAVE_COLORS[a]);
      for (let x = PADDING; x < p.width - PADDING; x += 5) {
        let noisebois = p.noise(x * 0.01, y * 0.01, z) * AMP;
        let yohann = Math.exp(-1 * ((x - p.width / 2) / TIGHTNESS) ** 2);
        const yNew = y - noisebois * yohann;
        p.vertex(x, yNew);
      }
      p.endShape(p.CLOSE);
      a += 1;
    }
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
