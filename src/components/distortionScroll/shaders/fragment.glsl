uniform float uTime;
uniform float uAlpha;
uniform vec2 uOffset;
uniform sampler2D uTex;

varying vec2 vUv;

vec3 rgbShift(sampler2D uTex, vec2 uv, vec2 offset) {
  float r = texture(uTex, uv + (offset * 0.5)).r;
  vec2 gb = texture(uTex, uv).gb;
  
  return vec3(r, gb);
}

void main() {
  // vec2 newVUv = vUv;
  
  // // 時間に基づいて波のような歪みを作成
  // float strength = 0.2; // 歪みの強さ
  // newVUv.x += sin(newVUv.y * -10.0 + uTime) * strength;
  // newVUv.y += cos(newVUv.x * -10.0 + uTime) * strength;

  // // カラフルな出力を生成
  // vec3 color = vec3(0.0);
  // color.r = newVUv.x;
  // color.g = newVUv.y;
  // color.b = sin(uTime * 0.5);
  
  // vec3 imageTex = texture(uTex, vUv).rgb;

  vec3 color = rgbShift(uTex, vUv, uOffset);
  gl_FragColor = vec4(color, uAlpha);
}
