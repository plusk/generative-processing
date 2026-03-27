import p5 from "p5";
import configBuilder, { webGLSetup, ConfigValue } from "../../utils";

new p5((p: p5) => {
  let shay: p5.Shader,
    pointA: number[],
    pointB: number[],
    pointC: number[],
    color1: number[],
    color2: number[];

  const c = configBuilder(p, {
    padding: new ConfigValue({
      value: 0.1,
      min: 0,
      max: 0.5,
      step: 0.05,
    }),
    seed: p.random(10000),
  });

  const randomWithPadding = (numnum: number) => {
    const padding = c.padding * numnum;
    return p.random(padding, numnum - padding);
  };

  p.setup = async () => {
    webGLSetup(p, c);
    shay = await p.loadShader("/sketches/reflect/basic.vert", "/sketches/reflect/reflect.frag");

    pointA = [randomWithPadding(p.width), randomWithPadding(p.height)];
    pointB = [randomWithPadding(p.width), randomWithPadding(p.height)];
    pointC = [randomWithPadding(p.width), randomWithPadding(p.height)];

    const hue1 = p.random(360);
    const hue2 = (hue1 + p.random(120, 240)) % 360; // 120–240° apart
    p.colorMode(p.HSL, 360, 100, 100);
    const c1 = p.color(hue1, p.random(60, 100), p.random(40, 65));
    const c2 = p.color(hue2, p.random(60, 100), p.random(40, 65));
    p.colorMode(p.RGB, 255);
    color1 = [p.red(c1) / 255, p.green(c1) / 255, p.blue(c1) / 255];
    color2 = [p.red(c2) / 255, p.green(c2) / 255, p.blue(c2) / 255];
  };

  p.draw = () => {
    if (!shay) return;
    p.shader(shay);
    shay.setUniform("u_resolution", [p.width, p.height]);
    shay.setUniform("u_time", p.frameCount * 10);
    shay.setUniform("u_pointA", pointA);
    shay.setUniform("u_pointB", pointB);
    shay.setUniform("u_pointC", pointC);
    shay.setUniform("u_color1", color1);
    shay.setUniform("u_color2", color2);
    p.rect(0, 0, p.width, p.height);
  };
});
