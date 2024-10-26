uniform float uTime;
uniform sampler2D uTex;

varying vec2 vUv;

void main()
{
  
  vec2 smokeUv = vUv;
  smokeUv.x *= 0.5;
  smokeUv.y *= 0.3;
  smokeUv.y -= uTime * 0.03;

  //smoke
  float smoke = texture(uTex, smokeUv).r;

  //再マップ）0.4 - 1.0の明るさの部分を使う
  smoke = smoothstep(0.4,1.0, smoke);

  //上下左右の端のぼかし
  smoke *= smoothstep(0.0, 0.1, vUv.x);
  smoke *= smoothstep(1.0, 0.9, vUv.x);
  smoke *= smoothstep(0.0, 0.1, vUv.y);
  smoke *= smoothstep(1.0, 0.6, vUv.y);

  gl_FragColor = vec4(vec3(1.0),   smoke);


  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
