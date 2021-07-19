import { paletteNames } from "./palettes.js";

const configBuilder = (p, c) => {
  const pane = new Tweakpane.Pane({
    title: "Config",
  });

  Object.entries(c).forEach(([key, value]) => {
    if (key === "palette") {
      pane.addInput(c, key, { options: paletteNames });
    } else if (key === "randomSeed") {
      pane.addInput(c, key, { min: 1, step: 1 });
    } else if (Number.isInteger(value)) {
      pane.addInput(c, key, { min: value / 10, max: value * 10 });
    } else {
      pane.addInput(c, key);
    }
  });

  pane.addButton({ title: "Download" }).on("click", () => {
    p.saveCanvas();
  });

  return {
    c,
    menu: pane,
  };
};

export default configBuilder;
