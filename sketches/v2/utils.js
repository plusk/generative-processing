import palettes from "./palettes.js";

const configBuilder = (p, c) => {
  // TODO: always include randomseed? some option for it
  const config = {
    ...c,
    download: () => p.saveCanvas(),
  };

  // TODO: see what parameters can be used here
  const gui = new dat.GUI({ width: 400 });

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
    } else if (key === "randomSeed") {
      controllers[key] = gui
        .add(config, key, 0, 100, 1)
        .name(name)
        .onChange(() => p.setup());
    } else if (Number.isInteger(value)) {
      controllers[key] = gui
        .add(config, key, value / 10, value * 10)
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

export default configBuilder;
