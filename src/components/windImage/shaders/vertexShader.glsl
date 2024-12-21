varying vec2 vUv;

uniform float uTime;
uniform float uMeshWidth;
uniform float uMeshHeight;

uniform sampler2D uNoiseTexture;

#include ./rotate2d.glsl

void main() {

  // vec3 newPosition = position;
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float twistNoise = texture(
    uNoiseTexture,
    vec2(0.5, uv.y * 0.2 - uTime * 0.05)
  ).r;
  
  float wave = sin(uv.y * 1.5 + uTime * 1.5) * 100.0;
  wave *= (1.0 - uv.y); // 上部ほど動きを抑制
  
  modelPosition.x += wave * 0.3;
  modelPosition.z += wave * 0.7 + 50.0;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;

  //varying
  vUv = uv;
}
