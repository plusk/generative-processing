import palettes from "./palettes.js";

const configBuilder = (p, c) => {
  const config = {
    palette: "onom",
    seed: 0,
    ...c,
    download: () => p.saveCanvas(`s${config.seed}-f${p.frameCount}`),
  };

  // TODO: see what parameters can be used here
  const gui = new dat.GUI({ closeOnTop: true, closed: true });

  // TODO: use these controllers
  const controllers = {};

  // TODO: config should be a more elaborate structure, containing min, max, etc
  Object.entries(config).forEach(([key, value]) => {
    const name = key.charAt(0).toUpperCase() + key.slice(1);
    if (key === "download") {
      controllers[key] = gui.add(config, key).name(name);
    } else if (key === "palette") {
      controllers[key] = gui
        .add(config, key, Object.keys(palettes))
        .name(name)
        .onChange(() => p.setup());
    } else if (key === "seed") {
      controllers[key] = gui
        .add(config, key, 0, 100, 1)
        .name(name)
        .onChange(() => p.setup());
    } else if (Number.isInteger(value)) {
      controllers[key] = gui
        .add(config, key, value / 10, value * 2)
        .name(name)
        .onChange(() => p.setup());
    } else {
      controllers[key] = gui
        .add(config, key)
        .name(name)
        .onChange(() => p.setup());
    }
  });

  return config;
};

export const baseSetup = (p, c) => {
  p.createCanvas(1080, 1350);
  p.pixelDensity(1);
  p.randomSeed(c.randomSeed);
  p.random(); // get rid of some pseudo-random nastiness
  p.colorMode(p.HSL);
};

export default configBuilder;
