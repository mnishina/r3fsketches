uniform float uTime;
uniform sampler2D uImageTex;

varying vec2 vUv;
varying float vWave;

void main() {
  
  float wave = vWave * 0.05; // ぐちゃぐちゃになるので数値をかけてる
  vec3 imageTex = texture(uImageTex, vUv + wave).rgb;

  gl_FragColor = vec4(imageTex, 1.0);

  // #include <tonemapping_fragment>
  // #include <colorspace_fragment>
}
