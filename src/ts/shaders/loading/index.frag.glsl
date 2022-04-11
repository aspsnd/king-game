precision mediump float;

#define M_PI 3.1415926535897932384626433832795

#define branch 8.0
#define shineWidth 0.35
#define size 345.0
#define shineHeight 2.0

uniform float rate;

uniform float time;
uniform sampler2D uSampler;
varying vec2 vTextureCoord;
uniform vec3 iResolution;

void main() {
  vec4 bg = texture2D(uSampler, vTextureCoord);

  vec2 centerPoint = vec2(.5, .5) * iResolution.xy;

  vec2 offset = gl_FragCoord.xy - centerPoint;

  float rotatedRadian = time;

  float radian = -atan(offset.y, offset.x) + rotatedRadian;

  float dis = length(offset);

  float v = M_PI * 2.0 / (12.0 * branch);

  float whiteShine = step(mod(radian + M_PI, v), v * shineWidth);

  float moreLength = step(mod(radian + M_PI, v * 3.0), v * shineWidth);

  float inBig = step(dis, size);

  whiteShine = step(4.0, (1.0 - inBig) + whiteShine + (1.0 - step(dis, size * 1.03)) + step(dis, size * 1.1 * (1.0 + (shineHeight - 1.0) * .1 * moreLength)));

  vec4 shine = .35 * whiteShine * vec4(1.0 + sin(radian + time) * .5, 1.0 + cos(radian - time) * .5, 1.0 + sin(radian * 1.39) * .5, 1.0);

  float inProRing = step(240.0, dis) * step(dis, 250.0);

  vec4 pro = vec4(1.0, .0, .0, .0) * inProRing;

  float reach = step(M_PI - atan(offset.y, offset.x), rate * M_PI * 2.0);

  vec4 color = bg + shine + pro * reach;
  gl_FragColor = color;
}