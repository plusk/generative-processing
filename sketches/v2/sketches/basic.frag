#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_pointA;
uniform vec2 u_pointB;
uniform vec2 u_pointC;
uniform float u_time;

bool withTime = false;
float lineDarken = 0.5;
float noiseStrength = 0.5; // 0.25
float distanceStrength = 0.2;

vec3 bg = vec3(0.0);
vec3 rColor = vec3(1.000, 0.600, 0.600);
vec3 gColor = vec3(0.086, 0.858, 0.768);

highp float rand(vec2 co) {
  highp float a = 12.9898;
  highp float b = 78.233;
  highp float c = 43758.5453;
  highp float dt = dot(co.xy, vec2(a, b));
  highp float sn = mod(dt, 3.14) + (withTime ? u_time : 0.0);
  return fract(sin(sn) * c);
}

// Return minimum distance between line segment vw and point p
float getColorFromDistance(vec2 v, vec2 w, vec2 p) {
  vec2 l = v - w;
  float l2 = dot(l, l);  // i.e. |w-v|^2 -  avoid a sqrt
  if (l2 == 0.0) return distance(p, v);   // v == w case
  // Consider the line extending the segment, parameterized as v + t (w - v).
  // We find projection of point p onto the line. 
  // It falls where t = [(p-v) . (w-v)] / |w-v|^2
  // We clamp t from [0,1] to handle points outside the segment vw.
  float t = clamp(dot(p - v, w - v) / l2, 0.0, 1.0);
  vec2 projection = v + t * (w - v);  // Projection falls on the segment
  return 1.0 - pow(distance(p, projection), distanceStrength);
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

  float r = getColorFromDistance(pa, pb, px);
  float g = getColorFromDistance(pa, pc, px);

  bool rOrNot = getPosition(pa, pb, px) > 0.0;
  bool gOrNot = getPosition(pa, pc, px) > 0.0;

  float noiseFactor = noiseStrength * rand(px) + 1.0 - noiseStrength;
  float darkFactor = rOrNot || !gOrNot ? lineDarken : 1.0;

  vec3 color1 = r * rColor;
  vec3 color2 = g * gColor;
  vec3 color = color1 + color2;

  gl_FragColor = vec4(color * darkFactor * noiseFactor, 1.0); // R,G,B,A
}