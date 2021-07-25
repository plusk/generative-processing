import palettes from "../palettes.js";
import configBuilder, { webGLSetup } from "../utils.js";

new p5((p) => {
  let bg, colors, shader;

  const c = configBuilder(p, {
    palette: "sirkul",
    strokeWeight: 50,
  });

  p.preload = () => {
    shader = p.loadShader("/sketches/v2/sketches/basic.vert", "/sketches/v2/sketches/basic.frag")
  }

  p.setup = () => {
    webGLSetup(p, c);

    bg = palettes[c.palette].bg;
    colors = palettes[c.palette].colors;
  };

  p.draw = () => {
    shader.setUniform("u_resolution", [p.width, p.height])
    shader.setUniform("u_time", p.frameCount * 0.01)
    p.shader(shader);
    p.rect(0, 0, p.width, p.height);
  };
});
