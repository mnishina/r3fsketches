varying vec2 vUv;

uniform float uTime;
uniform float uMeshWidth;
uniform float uMeshHeight;

uniform sampler2D uNoiseTexture;

#include ./rotate2d.glsl

void main() {

  vec3 newPosition = position;

  float twistNoise = texture(
    uNoiseTexture,
    vec2(0.5, uv.y * 0.2 - uTime * 0.05)
  ).r;
  
  float wave = sin(uv.y * 1.5 + uTime * 1.5) * 150.0;
  wave *= twistNoise;
  wave *= (1.0 - uv.y); // 上部ほど動きを抑制
  wave -= 1.0;

  newPosition.x += wave * 0.3;
  newPosition.z += wave * 0.7 + 50.0;

  // // //twist
  // float twistNoise = texture(
  //   uNoiseTexture,
  //   vec2(0.5, revUVY * -0.2 - uTime * -0.05)
  // ).r;
  // float angle = twistNoise * 1.3;
  // // angle *= (1.0 - uv.y);
  
  // float meshHeight = uMeshHeight; // メッシュの幅（必要に応じて調整）
  // newPosition.y += meshHeight / 2.0; // 左端に移動
  // newPosition.yz = rotate2D(newPosition.yz, angle);
  // newPosition.y -= meshHeight / 2.0; // 元の位置に戻す
  
  // vec2 windOffset = vec2(
  //   texture(uNoiseTexture, vec2(0.25, uTime * -0.05)).r + 0.5,
  //   texture(uNoiseTexture, vec2(0.75, uTime * -0.05)).r + 0.5
  // );
  // windOffset *= pow(uv.x, 2.0) * -1.0;
  // newPosition.xz += windOffset;
  
  // vec3 newPosition = position;
  
  // // 基本的な布のドレープ（静的な垂れ下がり）
  // float drape = (1.0 - cos(uv.x * 3.14)) * 0.15;
  // newPosition.z -= drape;
  
  // // 波打つような動き
  // float wave = sin(uv.y * 8.0 + uTime * 1.2) * 0.03;
  // wave *= (1.0 - uv.y); // 上部ほど動きを抑制
  
  // // ノイズテクスチャを使用した風の影響
  // vec2 noiseCoord = vec2(uv.x + uTime * 0.1, uv.y - uTime * 0.05);
  // float wind = texture(uNoiseTexture, noiseCoord).r * 0.1;
  // wind *= (1.0 - uv.y); // 上部ほど風の影響を抑制
  
  // // 横方向の揺れ
  // newPosition.x += wave + wind;
  
  // // 前後の揺れ
  // newPosition.z += sin(uTime * 1.5 + uv.x * 2.0) * 0.05 * (1.0 - uv.y);
  
  // // 布のしわ（細かい凹凸）
  // float wrinkle = sin(uv.y * 20.0) * 0.02;
  // wrinkle *= (1.0 - uv.y); // 上部ほどしわを抑制
  // newPosition.z += wrinkle;


  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);



  // vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  // // テクスチャからノイズ値を取得
  // float time = uTime * 0.25;
  // vec2 noiseUV = vec2(
  //   modelPosition.x * 0.4 + time, //荒目にした方がなめらか
  //   modelPosition.y * 0.1 + time
  // );
  // float noise = texture(uNoiseTexture, noiseUV).r - 0.5;  // -0.5〜0.5の範囲に正規化
  
  // // ノイズ値を使って頂点を変位
  // float amplitude = 0.5;
  // modelPosition.z += noise * amplitude;
  
  // vec4 viewPosition = viewMatrix * modelPosition;
  // vec4 projectedPosition = projectionMatrix * viewPosition;
    
  // gl_Position = projectedPosition;

  //varying
  vUv = uv;
}
