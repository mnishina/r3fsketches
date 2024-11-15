uniform float uSize;
uniform float uTime;

attribute float aScale;

varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  modelPosition.y += sin(uTime) * 0.5;

  float angle = atan(modelPosition.x, modelPosition.z); //各点の角度を返す
  float distanceToCenter = length(modelPosition.xz); //各点の中心からの距離を返す


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z); // size attenuation

  //varying
  vColor = color; //colorはvertexColors: trueでattributeに入っているので宣言しなくても使える
}
