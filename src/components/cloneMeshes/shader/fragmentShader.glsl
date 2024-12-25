uniform sampler2D uTexture;

varying vec2 vUv;

void main() {

  vec3 tex = texture(uTexture, vUv).rgb;

  gl_FragColor = vec4(tex, 1.0);
}
