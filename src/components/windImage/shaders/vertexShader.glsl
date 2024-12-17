varying vec2 vUv;

uniform float uTime;
uniform float uMeshWidth;

uniform sampler2D uNoiseTexture;

#include ./rotate2d.glsl

void main() {

  vec3 newPosition = position;
  
  //twist
  float twistNoise = texture(
    uNoiseTexture,
    vec2(0.5, uv.y * 0.2 - uTime * 0.2)
  ).r;
  float angle = twistNoise * 0.25;
  
  float meshWidth = uMeshWidth; // メッシュの幅（必要に応じて調整）
  newPosition.x += meshWidth / 2.0; // 左端に移動
  newPosition.xz = rotate2D(newPosition.xz, angle);
  newPosition.x -= meshWidth / 2.0; // 元の位置に戻す
  
  vec2 windOffset = vec2(
    texture(uNoiseTexture, vec2(0.25, uTime * 0.05)).r + 0.5,
    texture(uNoiseTexture, vec2(0.75, uTime * 0.05)).r + 0.5
  );
  windOffset *= pow(uv.x, 2.0) * 1.0;
  newPosition.xz += windOffset;
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  //varying
  vUv = uv;
}
