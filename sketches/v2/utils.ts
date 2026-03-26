import p5 from "p5";
import { Pane } from "tweakpane";
import palettes from "./palettes";

export class ConfigValue {
  value: number;
  min: number;
  max: number;
  step: number;
  show?: boolean;

  constructor({ value, min, max, step, show }: { value: number; min: number; max: number; step: number; show?: boolean }) {
    this.value = value;
    this.min = min;
    this.max = max;
    this.step = step;
    this.show = show;
  }
}

// p is a p5 instance, c is an object of values or ConfigValues
const configBuilder = (p: p5, c: Record<string, any>) => {
  const config: Record<string, any> = {
    palette: "onom",
    seed: 0,
    ...c,
    download: () => p.saveCanvas(`s${config.seed}-f${p.frameCount}.png`),
  };

  const pane = new Pane();

  const controllers: Record<string, any> = {};

  Object.entries(config).forEach(([key, value]) => {
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    if (key === "download") {
      controllers[key] = pane.addButton({ title: label }).on("click", config[key]);
    } else if (key === "palette") {
      const options: Record<string, string> = {};
      Object.keys(palettes).forEach((name) => { options[name] = name; });
      controllers[key] = pane
        .addBinding(config, key, { options, label })
        .on("change", () => p.setup());
    } else if (key === "seed") {
      controllers[key] = pane
        .addBinding(config, key, { min: 0, max: 100, step: 1, label })
        .on("change", () => p.setup());
    } else if (value instanceof ConfigValue) {
      config[key] = value.value;
      controllers[key] = pane
        .addBinding(config, key, { min: value.min, max: value.max, step: value.step, label })
        .on("change", () => p.setup());
    } else {
      controllers[key] = pane
        .addBinding(config, key, { label })
        .on("change", () => p.setup());
    }
  });

  return config;
};

export const baseSetup = (p: p5, c: Record<string, any>) => {
  p.createCanvas(1080, 1350);
  p.pixelDensity(1);
  p.randomSeed(c.seed);
  p.random(); // get rid of some pseudo-random nastiness
  p.colorMode(p.HSL);
};

export const webGLSetup = (p: p5, c: Record<string, any>) => {
  p.createCanvas(1080, 1350, p.WEBGL);
  p.pixelDensity(1);
  p.randomSeed(c.seed);
  p.random(); // get rid of some pseudo-random nastiness
};

export default configBuilder;
