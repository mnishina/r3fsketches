export function getViewportInfo(canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  const aspectRatio = width / height;

  return { canvasRect, width, height, aspectRatio };
}

export function getCameraFov(height: number, cameraFar: number) {
  const radian = 2 * Math.atan(height / 2 / cameraFar);
  const fov = (180 / Math.PI) * radian;

  return fov;
}
