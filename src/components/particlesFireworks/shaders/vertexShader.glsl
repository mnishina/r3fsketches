uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;

attribute float aSize;
attribute float aTimeMultiplier;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
  return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main() {
  float progress = uProgress * aTimeMultiplier;
  vec3 newPosition = position;

  //拡大
  float exprodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
  exprodingProgress = clamp(exprodingProgress, 0.0, 1.0); //0.0から1.0の範囲に制限する
  exprodingProgress = 1.0 - pow(1.0 - exprodingProgress, 3.0); //3乗する 1.0-をやることでeaseInOutになる
  newPosition *= exprodingProgress; //拡大

  //落下
  float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
  fallingProgress = clamp(fallingProgress, 0.0, 1.0); //0.0から1.0の範囲に制限する
  fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0); //3乗する 1.0-をやることでeaseInOutになる
  newPosition.y -= fallingProgress * 0.2; //落下

  //スケールダウン
  float sizeOpeningProgress = remap(progress, 0.0, 0.125, 0.0, 1.0);
  float sizeClosingingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
  float sizeProgress = min(sizeOpeningProgress, sizeClosingingProgress); //sizeOpeningProgress→上昇、sizeClosingingProgress→下降。上昇する値から下降する値に交差するところで、min関数の採用値がsizeClosingingProgressに切り替わる。
  sizeProgress = clamp(sizeProgress, 0.0, 1.0); //0.0から1.0の範囲に制限する

  //きらめき
  float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
  twinklingProgress = clamp(twinklingProgress, 0.0, 1.0); //0.0から1.0の範囲に制限する
  float sizeTwinkling = sin(progress * 30.0) * 0.5 + 0.5; //0~1を高速に繰り返す
  sizeTwinkling = 1.0 -sizeTwinkling * twinklingProgress; //twinklingProgressが0-1の値なので、1.0を引いて逆転させて大きい値から小さい値になるようにする。

  vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;

  gl_PointSize = uSize * uResolution.y * aSize * sizeProgress * sizeTwinkling;
  gl_PointSize *= 1.0 / - viewPosition.z; // 手前の点は大きく、奥の点は小さくなるようにする計算

  // Windowsの問題対策
  if(gl_PointSize < 1.0) {
    gl_Position = vec4(9999.9);
  }
}
