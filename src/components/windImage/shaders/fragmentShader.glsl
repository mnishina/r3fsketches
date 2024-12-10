varying vec2 vUv;

uniform sampler2D uTexture;

void main() {
  // vec3 color = vec3(1.0, 1.0, 1.0);
  // gl_FragColor = vec4(color, 1.0);

  vec3 tex = texture2D(uTexture, vUv).rgb;
  gl_FragColor = vec4(tex, 1.0);
}
