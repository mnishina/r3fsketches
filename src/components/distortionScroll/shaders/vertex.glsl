uniform float uTime;

varying vec2 vUv;

void main() {

  vec3 newPosition = position;

  // float elevation = sin(newPosition.x + uTime) * 0.1;
  // newPosition.z += elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  vUv = uv;
}