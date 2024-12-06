const functions = {
  getViewPortSize,
  getPixelFOV,
  mapRange,
};

function mapRange(
  value: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
): number {
  //数値の「マッピング」（値の範囲変換）を行うためのユーティリティ関数
  //ある範囲の数値を別の範囲に変換するための計算
  //例：0から100の範囲の値を0から1の範囲に変換したい
  return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function getViewPortSize(canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  const aspectRatio = width / height;

  return { width, height, aspectRatio };
}

function getPixelFOV(height: number, cameraFar: number) {
  const fovRadian = 2 * Math.atan(height / 2 / cameraFar);
  const fov = (180 * fovRadian) / Math.PI;

  return fov;
}

export default functions;
