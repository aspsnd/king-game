precision highp float;

#define M_PI 3.1415926535897932384626433832795

uniform sampler2D uSampler;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

uniform float time;
float timeP = time * 100.0;
uniform vec3 iResolution;
varying vec2 vTextureCoord;

uniform vec3 starColor;

uniform float size;

uniform float prob;

void main() {

  vec2 pos = floor(1.0 / size * gl_FragCoord.xy);

  float color = 0.0;
  float starValue = rand(pos);

  if(starValue > prob) {
    vec2 center = size * pos + vec2(size, size) * 0.5;

    float t = 0.9 + 0.2 * sin(timeP + (starValue - prob) / (1.0 - prob) * 45.0);

    color = 1.0 - distance(gl_FragCoord.xy, center) / (0.5 * size);
    color = color * t / (abs(gl_FragCoord.y - center.y)) * t / (abs(gl_FragCoord.x - center.x));
  } else if(rand(gl_FragCoord.xy / iResolution.xy) > 0.996) {
    float r = rand(gl_FragCoord.xy);
    color = r * (0.25 * sin(timeP * (r * 5.0) + 720.0 * r) + 0.75);
  }

  vec4 bg = texture2D(uSampler, vTextureCoord);

  gl_FragColor = bg * (1.0 - color) + vec4(vec3(color) * starColor, 1.0);
}