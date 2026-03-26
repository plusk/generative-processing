import p5 from "p5";
import palettesData from "../palettes.json";

new p5((p: p5) => {
  let PALETTE: any;
  let _BACKGROUNDS: any;
  let _COLORS: any;

  p.setup = () => {
    const cnv = p.createCanvas(1080, 2000); // 1080, 1350
    cnv.mouseClicked(clickOnSave);

    p.colorMode(p.HSL);
    const PALETTE_KEYS = Object.keys(palettesData);
    PALETTE = (palettesData as any)[PALETTE_KEYS[(PALETTE_KEYS.length * Math.random()) << 0]];
    _COLORS = PALETTE["colors"];
    _BACKGROUNDS = PALETTE["bg"];
    p.noStroke();

    const entries = Object.entries(palettesData);
    let index = 0;
    for (const [_name, palette] of entries) {
      p.fill((palette as any).bg);
      const ydiff = p.height / entries.length;
      const y = index * ydiff;
      p.rect(0, y, p.width, ydiff);
      for (let i = 0; i < (palette as any).colors.length; i++) {
        const coleur = (palette as any).colors[i];
        const xdiff = p.width / ((palette as any).colors.length + 1);
        const x = xdiff * 0.5 + i * xdiff;
        p.fill(coleur);
        p.rect(x, y + ydiff * 0.25, xdiff, ydiff / 2);
      }
      index++;
    }
  };

  p.draw = () => {
    p.noLoop();
  };

  const clickOnSave = () => {
    //p.saveCanvas();
  };
});
