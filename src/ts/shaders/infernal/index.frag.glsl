precision mediump float;

#define M_PI 3.1415926535897932384626433832795

uniform float rate;
uniform float dis;

uniform float time;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;

void main() {
  vec2 scaled = vTextureCoord;
  vec2 pos = scaled + rate * cos(time) * sin((scaled - .5) * M_PI * dis);
  vec4 color = texture2D(uSampler, pos);
  gl_FragColor = color;
}