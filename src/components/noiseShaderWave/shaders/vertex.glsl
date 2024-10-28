// noise from snoise function

uniform float uTime;
uniform sampler2D uNoiseTex;

varying vec2 vUv;

#include ./snoise.glsl;

void main() {

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float noiseFreq = 2.5;
  float noiseAmp = 0.25;

  vec3 noisePos = vec3(modelPosition.x * noiseFreq + uTime, modelPosition.y, modelPosition.z);
  modelPosition.z += snoise(noisePos) * noiseAmp;

  // float elevation = sin(modelPosition.x + uTime) * 0.5;
  // modelPosition.z += elevation;
  
  // float offsetFromNoiseR = texture(uNoiseTex, vec2(0.5, sin(uTime))).r - 0.5;
  // float elevation = sin(modelPosition.x + uTime * 0.5) *
  //                   sin(modelPosition.z + uTime * 0.5);
  // float noiseElevation = elevation * offsetFromNoiseR;

  // // modelPosition.x += noiseElevation * 0.5;
  // modelPosition.y += noiseElevation * 0.5;
  // modelPosition.z += noiseElevation * 0.5;

  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
    
  gl_Position = projectedPosition;

  vUv = uv;
}
