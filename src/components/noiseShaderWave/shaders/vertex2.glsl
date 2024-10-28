// noise from image

uniform float uTime;
uniform sampler2D uNoiseTex;

varying vec2 vUv;
varying float vWave;

void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // テクスチャからノイズ値を取得
  float time = uTime * 0.25;
  vec2 noiseUV = vec2(
    modelPosition.x * 0.4 + time, //荒目にした方がなめらか
    modelPosition.y * 0.1 + time
  );
  float noise = texture(uNoiseTex, noiseUV).r - 0.5;  // -0.5〜0.5の範囲に正規化
  
  // ノイズ値を使って頂点を変位
  float amplitude = 0.5;
  modelPosition.z += noise * amplitude;
  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
    
  gl_Position = projectedPosition;

  vUv = uv;
  vWave = modelPosition.z;
}
