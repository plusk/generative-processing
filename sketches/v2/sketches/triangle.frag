#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_pointA;
uniform vec2 u_pointB;
uniform vec2 u_pointC;
uniform float u_time;

float distScale = 0.5;
float lineDarken = 0.5;
float noiseStrength = 0.25;

vec3 bg = vec3(0.0);
vec3 colorRed = vec3(1.000, 0.600, 0.600);
vec3 colorGre = vec3(0.086, 0.858, 0.768);
vec3 colorBlu = vec3(0.262, 0.796, 1.000);

float distSquared(vec2 A, vec2 B) {
  vec2 C = A - B;
  return dot(C, C);
}

highp float rand(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt = dot(co.xy, vec2(a, b));
    highp float sn = mod(dt, 3.14) + u_time;
    return fract(sin(sn) * c);
}

float minimum_distance(vec2 v, vec2 w, vec2 p) {
  // Return minimum distance between line segment vw and point p
  float l2 = distSquared(v, w);  // i.e. |w-v|^2 -  avoid a sqrt
  if (l2 == 0.0) return distance(p, v);   // v == w case
  // Consider the line extending the segment, parameterized as v + t (w - v).
  // We find projection of point p onto the line. 
  // It falls where t = [(p-v) . (w-v)] / |w-v|^2
  // We clamp t from [0,1] to handle points outside the segment vw.
  float t = clamp(dot(p - v, w - v) / l2, 0.0, 1.0);
  vec2 projection = v + t * (w - v);  // Projection falls on the segment
  return distance(p, projection);
}

float getPosition(vec2 p1, vec2 p2, vec2 px) {
  return sign((p2.x - p1.x) * (px.y - p1.y) - (p2.y - p1.y) * (px.x - p1.x));
}

float getColor(vec2 p1, vec2 p2, vec2 px) {
  return 1.0 - minimum_distance(p1, p2, px);
}

void main() {
  // position of the pixel divided by resolution, to get normalized positions on the canvas
  vec2 px = gl_FragCoord.xy / u_resolution.xy;
  vec2 pa = u_pointA.xy / u_resolution.xy;
  vec2 pb = u_pointB.xy / u_resolution.xy;
  vec2 pc = u_pointC.xy / u_resolution.xy;

  float r = getColor(pb, pa, px);
  float g = getColor(pa, pc, px);
  float b = getColor(pb, pc, px);

  bool rOrNot = getPosition(pa, pb, px) > 0.0;
  bool gOrNot = getPosition(pa, pc, px) > 0.0;
  bool bOrNot = getPosition(pc, pb, px) > 0.0;

  float noiseFactor = noiseStrength * rand(px) + 1.0 - noiseStrength;
  float darkFactor = !rOrNot || gOrNot || bOrNot ? lineDarken : 1.0;

  vec3 color = vec3(r, g, b) * darkFactor * noiseFactor;
  gl_FragColor = vec4(color, 1.0); // R,G,B,A
}