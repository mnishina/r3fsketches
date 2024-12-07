uniform sampler2D uTexture;
uniform float uAlpha;
uniform vec2 uOffset;

varying vec2 vUv;

vec3 rgbShift(sampler2D textureMap, vec2 uv, vec2 offset, float adjustmentValue) {
  vec2 adjustOffset = offset * adjustmentValue;

  float r = texture2D(textureMap, uv).r;
  float g = texture2D(textureMap, uv + adjustOffset).g;
  float b = texture2D(textureMap, uv + adjustOffset).b;
  
  return vec3(r, g, b);
}

void main() {
  // vec3 color = vec3(1.0, 0.0, 0.0);
  // gl_FragColor = vec4(color, 1.0);

  // vec3 texture = texture(uTexture, vUv).rgb;
  // gl_FragColor = vec4(texture, uAlpha);

  float adjustmentValue = 0.35;
  vec3 color = rgbShift(uTexture, vUv, uOffset, adjustmentValue);
  
  gl_FragColor = vec4(color, uAlpha);
}
