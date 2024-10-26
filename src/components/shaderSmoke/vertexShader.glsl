uniform float uTime;
uniform sampler2D uTex;

varying vec2 vUv;

#include ./includes/rotate2D.glsl

void main()
{
  vec3 newPosition = position;

  //twist
  float twistNoise = texture(
    uTex,
    vec2(0.5, uv.y * 0.2 - uTime * 0.01)
  ).r;
  float angle = twistNoise * 10.0;
  newPosition.xz = rotate2D(newPosition.xz, angle); 

  //wind
  vec2 windOffset = vec2(
    texture(uTex, vec2(0.25, uTime * 0.05)).r - 0.5,
    texture(uTex, vec2(0.75, uTime * 0.05)).r - 0.5
  );
  windOffset *= pow(uv.y, 2.0) * 10.0;
  newPosition.xz += windOffset;


  // memo
  // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  // float elevation = sin(modelPosition.y + uTime) * 0.25;
  // modelPosition.x += elevation;
  // vec4 viewPosition = viewMatrix * modelPosition;
  // vec4 projectedPosition = projectionMatrix * viewPosition;
  // gl_Position = projectedPosition;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  // Varyings
  vUv = uv;
}
