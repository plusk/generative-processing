import p5 from "p5";
import palettesData from "../../palettes.json";

new p5((p: p5) => {
  // Tweakable parameters
  const SNOWFLAKE_COUNT = 500;
  const SIZE = 10;
  const GRAVITY = 1;

  const SNOWFLAKES: any[] = [];

  // Will run once when the sketch is opened
  p.setup = () => {
    p.createCanvas(1080, 1350);
    p.noStroke();

    // Initialize the snowflakes with random positions
    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
      SNOWFLAKES.push({
        x: p.random(p.width),
        y: p.random(p.height),
      });
    }
  };

  // Will run every frame (refreshes many times per second)
  p.draw = () => {
    p.background("brown");

    // Iterate through each snowflake to draw and update them
    for (let i = 0; i < SNOWFLAKES.length; i++) {
      const snowflake = SNOWFLAKES[i];

      p.circle(snowflake.x, snowflake.y, SIZE);

      if (snowflake.y > p.height + SIZE) snowflake.y = -SIZE;
      else snowflake.y += GRAVITY;
    }
  };
});
