uniform sampler2D uTex;

varying vec2 vUv;

void main() {
    // vec3 color = vec3(1.0, 1.0, 1.0);

    // gl_FragColor = vec4(color, 1.0);


    vec3 texture = texture(uTex, vUv).rgb;
    gl_FragColor = vec4(texture, 1.0);
}
