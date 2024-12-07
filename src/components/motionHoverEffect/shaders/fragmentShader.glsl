uniform sampler2D uTexture;
uniform float uAlpha;

varying vec2 vUv;

void main() {
    // vec3 color = vec3(1.0, 0.0, 0.0);
    // gl_FragColor = vec4(color, 1.0);


    vec3 texture = texture(uTexture, vUv).rgb;
    gl_FragColor = vec4(texture, uAlpha);
}
