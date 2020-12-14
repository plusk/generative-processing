// Tweakable parameters
const SNOWFLAKE_COUNT = 500;
const SIZE = 10;
const GRAVITY = 1;

const SNOWFLAKES = [];

// Will run once when the sketch is opened
function setup() {
  createCanvas(1080, 1350);
  noStroke();

  // Initialize the snowflakes with random positions
  for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
    SNOWFLAKES.push({
      x: random(width),
      y: random(height),
    });
  }
}

// Will run every frame (refreshes many times per second)
function draw() {
  background("brown");

  // Iterate through each snowflake to draw and update them
  for (let i = 0; i < SNOWFLAKES.length; i++) {
    const snowflake = SNOWFLAKES[i];

    circle(snowflake.x, snowflake.y, SIZE);

    if (snowflake.y > height + SIZE) snowflake.y = -SIZE;
    else snowflake.y += GRAVITY;
  }
}
