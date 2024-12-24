export function getViewportInfo(canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  const aspectRatio = width / height;

  return { canvasRect, width, height, aspectRatio };
}

export function getCameraFov(canvas: HTMLCanvasElement, cameraFar: number) {
  const canvasHeight = canvas.getBoundingClientRect().height;
  const radian = 2 * Math.atan(canvasHeight / 2 / cameraFar);
  const fov = (180 / Math.PI) * radian;

  return fov;
}
