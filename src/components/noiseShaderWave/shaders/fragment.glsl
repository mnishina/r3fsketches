uniform float uTime;
uniform sampler2D uImageTex;

varying vec2 vUv;

void main() {
  
  vec4 imageTex = texture(uImageTex, vUv);

  gl_FragColor = imageTex;

  // #include <tonemapping_fragment>
  // #include <colorspace_fragment>
}
