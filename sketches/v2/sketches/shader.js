import palettes from "../palettes.js";
import configBuilder, { webGLSetup, ConfigValue } from "../utils.js";

new p5((p) => {
  let bg, colors, shader, pointA, pointB, pointC;

  const c = configBuilder(p, {
    padding: new ConfigValue({
      value: 0.1,
      min: 0,
      max: 0.5,
      step: 0.05,
    }),
    seed: 852,
  });

  p.preload = () => {
    shader = p.loadShader("/sketches/v2/sketches/basic.vert", "/sketches/v2/sketches/basic.frag");
  };

  const randomWithPadding = (numnum) => {
    const padding = c.padding * numnum;
    return p.random(padding, numnum - padding);
  };

  p.setup = () => {
    webGLSetup(p, c);

    bg = palettes[c.palette].bg;
    colors = palettes[c.palette].colors;

    pointA = [randomWithPadding(p.width), randomWithPadding(p.height)];
    pointB = [randomWithPadding(p.width), randomWithPadding(p.height)];
    pointC = [randomWithPadding(p.width), randomWithPadding(p.height)];

    /*
    pointA = [p.width * 0.25, p.height * 0.75];
    pointB = [p.width * 0.75, p.height * 0.5];
    pointC = [p.width * 0.5, p.height * 0.25];
    */
  };

  p.draw = () => {
    shader.setUniform("u_resolution", [p.width, p.height]);
    shader.setUniform("u_time", p.frameCount * 0.001);
    shader.setUniform("u_pointA", pointA);
    shader.setUniform("u_pointB", pointB);
    shader.setUniform("u_pointC", pointC);
    p.shader(shader);
    p.rect(0, 0, p.width, p.height);
  };
});
