import p5 from "p5";

new p5((p: p5) => {
  // Tweakable parameters
  const SNOWFLAKES_PER_LAYER = 200;
  const MAX_SIZE = 10;
  const GRAVITY = 0.75;
  const LAYER_COUNT = 5;

  const WIND_SPEED = 1;
  const WIND_CHANGE = 0.0025;

  const SNOWFLAKES: any[][] = [];

  // Will run once when the sketch is opened
  p.setup = () => {
    p.createCanvas(1080, 1350);
    p.noStroke();

    // Initialize the snowflakes with random positions
    for (let l = 0; l < LAYER_COUNT; l++) {
      SNOWFLAKES.push([]);
      for (let i = 0; i < SNOWFLAKES_PER_LAYER; i++) {
        SNOWFLAKES[l].push({
          x: p.random(p.width),
          y: p.random(p.height),
          mass: p.random(0.75, 1.25),
          l: l + 1,
        });
      }
    }
  };

  // Will run every frame (refreshes many times per second)
  p.draw = () => {
    p.background("brown");

    // Iterate through each snowflake to draw and update them
    for (let l = 0; l < SNOWFLAKES.length; l++) {
      const LAYER = SNOWFLAKES[l];

      for (let i = 0; i < LAYER.length; i++) {
        const snowflake = LAYER[i];
        p.circle(snowflake.x, snowflake.y, (snowflake.l * MAX_SIZE) / LAYER_COUNT);
        updateSnowflake(snowflake);
      }
    }
  };

  // Helper function to prepare a given snowflake for the next frame
  const updateSnowflake = (snowflake: any) => {
    const diameter = (snowflake.l * MAX_SIZE) / LAYER_COUNT;
    if (snowflake.y > p.height + diameter) snowflake.y = -diameter;
    else snowflake.y += GRAVITY * snowflake.l * snowflake.mass;

    // Get the wind speed at the given layer and area of the page
    const wind = p.noise(snowflake.l, snowflake.y * WIND_CHANGE, p.frameCount * WIND_CHANGE) - 0.5;
    if (snowflake.x > p.width + diameter) snowflake.x = -diameter;
    else if (snowflake.x < -diameter) snowflake.x = p.width + diameter;
    else snowflake.x += wind * WIND_SPEED * snowflake.l;
  };
});
