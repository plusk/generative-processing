#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_pointA;
uniform vec2 u_pointB;
uniform vec2 u_pointC;
uniform float u_time;

uniform vec3 u_color1;
uniform vec3 u_color2;

bool withTime = false;
float noiseStrength = 0.75;
float darkenStrength = 0.5;
float distanceStrength = 0.25;

vec3 bg = vec3(0.0);

highp float rand(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt = dot(co.xy, vec2(a, b));
  highp float sn = mod(dt, 3.14) + (withTime ? u_time : 0.0);
  return fract(sin(sn) * c);
}

// Return minimum distance between line segment vw and point p
float getDistance(vec2 v, vec2 w, vec2 p) {
  vec2 l = v - w;
  float l2 = dot(l, l);  // i.e. |w-v|^2 -  avoid a sqrt
  if (l2 == 0.0) return distance(p, v);   // v == w case
  // Consider the line extending the segment, parameterized as v + t (w - v).
  // We find projection of point p onto the line. 
  // It falls where t = [(p-v) . (w-v)] / |w-v|^2
  // We clamp t from [0,1] to handle points outside the segment vw.
  float t = clamp(dot(p - v, w - v) / l2, 0.0, 1.0);
  vec2 projection = v + t * (w - v);  // Projection falls on the segment
  // return pow(distance(p, projection), distanceStrength);
  return pow(distance(p, projection), distanceStrength);
}

float getPosition(vec2 p1, vec2 p2, vec2 px) {
  return sign((p2.x - p1.x) * (px.y - p1.y) - (p2.y - p1.y) * (px.x - p1.x));
}

void main() {
  // position of the pixel divided by resolution, to get normalized positions on the canvas
  vec2 px = gl_FragCoord.xy / u_resolution.xy;
  vec2 pa = u_pointA.xy / u_resolution.xy;
  vec2 pb = u_pointB.xy / u_resolution.xy;
  vec2 pc = u_pointC.xy / u_resolution.xy;

  float d1 = getDistance(pa, pb, px);
  float c1 = 1.0 - getDistance(pa, pb, px);
  float d2 = getDistance(pa, pc, px);
  float c2 = 1.0 - getDistance(pa, pc, px);

  bool isBeyondc1 = getPosition(pa, pb, px) > 0.0;
  bool isBeyondc2 = getPosition(pa, pc, px) > 0.0;

  float noiseFactor = noiseStrength * rand(px) + 1.0 - noiseStrength;
  float darkFactor = isBeyondc1 || !isBeyondc2 ? (1.0 - (darkenStrength * max(c1, c2))) : 1.0 / (d1 * d2);

  vec3 color = c1 * u_color1 + c2 * u_color2;

  gl_FragColor = vec4(color * darkFactor * noiseFactor, 1.0); // R,G,B,A
}