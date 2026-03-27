import p5 from "p5";

new p5((p: p5) => {
  // Tweakable parameters
  const SNOW_COLOR = "snow";
  const SNOWFLAKES_PER_LAYER = 200;
  const MAX_SIZE = 10;
  const GRAVITY = 0.5;
  const LAYER_COUNT = 4;

  const SKY_COLOR = "skyblue";
  const SKY_SPACE = 0.4;
  const SKY_AMP = 150;
  const SKY_ZOOM = 0.0025;
  const SKY_LAYER_OFFSET = 3;

  const WIND_SPEED = 1;
  const WIND_CHANGE = 0.0025;

  const SUN_COLOR = "#FFF2AD";
  const SUN_GLOW = 100;
  const SUN_RADIUS = 150;

  const RIDGE_TOP_COLOR = "#BCCEDD";
  const RIDGE_BOT_COLOR = "#7E9CB9";
  const RIDGE_STEP = 4;
  const RIDGE_AMP = 250;
  const RIDGE_ZOOM = 0.005;

  const SNOWFLAKES: any[][] = [];

  // Will run once when the sketch is opened
  p.setup = () => {
    p.createCanvas(1080, 1350);
    p.fill(SNOW_COLOR);
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
    p.background(SKY_COLOR);
    const skyHeight = p.round(p.height * SKY_SPACE);

    for (let i = 1; i < LAYER_COUNT; i++) {
      drawRidge(
        i,
        (i * skyHeight) / LAYER_COUNT,
        SKY_AMP,
        SKY_ZOOM,
        SKY_COLOR,
        SUN_COLOR,
        SKY_LAYER_OFFSET,
      );
    }

    drawSun(p.width / 2, skyHeight - RIDGE_AMP / 2);

    // Iterate through the layers of snowflakes
    for (let l = 0; l < SNOWFLAKES.length; l++) {
      const SNOWLAYER = SNOWFLAKES[l];

      // Draw a ridge for each layer of snow
      const layerPosition = l * ((p.height - skyHeight) / LAYER_COUNT);
      drawRidge(
        l,
        skyHeight + layerPosition,
        RIDGE_AMP,
        RIDGE_ZOOM,
        RIDGE_TOP_COLOR,
        RIDGE_BOT_COLOR,
        0,
      );

      // Draw each snowflake
      for (let i = 0; i < SNOWLAYER.length; i++) {
        const snowflake = SNOWLAYER[i];
        p.circle(snowflake.x, snowflake.y, (snowflake.l * MAX_SIZE) / LAYER_COUNT);
        updateSnowflake(snowflake);
      }
    }
  };

  // Draw a simple sun
  const drawSun = (x: number, y: number) => {
    p.fill(SUN_COLOR);
    (p.drawingContext as any).shadowBlur = SUN_GLOW;
    (p.drawingContext as any).shadowColor = SUN_COLOR;
    p.circle(x, y, SUN_RADIUS * 2);
    (p.drawingContext as any).shadowBlur = 0;
  };

  // Compute and draw a ridge
  const drawRidge = (
    l: number,
    y: number,
    amp: number,
    zoom: number,
    c1: any,
    c2: any,
    coff: number,
  ) => {
    // Choose a color for the ridge based on its height
    const FILL = p.lerpColor(p.color(c1), p.color(c2), l / (LAYER_COUNT - 1 + coff));
    p.fill(FILL);

    p.beginShape();
    // Iterate through the width of the canvas
    for (let x = 0; x <= p.width; x += RIDGE_STEP) {
      const noisedY = p.noise(x * zoom, y);
      p.vertex(x, y - noisedY * amp);
    }
    p.vertex(p.width, p.height);
    p.vertex(0, p.height);
    p.endShape(p.CLOSE);
    p.fill(SNOW_COLOR);
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
