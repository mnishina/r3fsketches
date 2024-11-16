uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float angle = atan(modelPosition.x, modelPosition.z); //各点の角度を返す
  float distanceToCenter = length(modelPosition.xz); //各点の中心からの距離を返す
  float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2; //中心に近いものは大きい数字、遠いものは小さい数字を返す
  angle += angleOffset;

  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  // modelPosition.x += aRandomness.x;
  // modelPosition.y += aRandomness.y;
  // modelPosition.z += aRandomness.z;
  modelPosition.xyz += aRandomness; //↑をまとめた書き方。ランダムな位置に移動

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z); // size attenuation

  //varying
  vColor = color; //colorはvertexColors: trueでattributeに入っているので宣言しなくても使える
}
