varying vec2 vUv;

uniform sampler2D uImageTexture;
uniform sampler2D uNoiseTexture;

void main() {
  // vec3 color = vec3(1.0, 1.0, 1.0);
  // gl_FragColor = vec4(color, 1.0);

  vec4 imageTexture = texture2D(uImageTexture, vUv);
  vec4 noiseTexture = texture2D(uNoiseTexture, vUv);

  vec4 tex = mix(imageTexture, noiseTexture, 0.5);

  gl_FragColor = tex;
}
