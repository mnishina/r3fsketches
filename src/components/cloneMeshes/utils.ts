export function getViewportInfo($canvas: HTMLCanvasElement) {
  const canvasRect = $canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  const aspectRatio = width / height;

  return { canvasRect, width, height, aspectRatio };
}

export function getCameraFov(height: number, cameraFar: number) {
  const radian = 2 * Math.atan(height / 2 / cameraFar);
  const fov = (180 / Math.PI) * radian;

  return fov;
}

export function getWorldPosition($canvas: HTMLCanvasElement, $image: Element) {
  const { width: canvasRectWidth, height: canvasRectHeight } =
    getViewportInfo($canvas);
  const {
    x: $imageX,
    y: $imageY,
    width: $imageWidth,
    height: $imageHeight,
  } = $image.getBoundingClientRect();

  const convertX = $imageX - canvasRectWidth / 2 + $imageWidth / 2;
  const convertY = -($imageY - canvasRectHeight / 2 + $imageHeight / 2);

  return { convertX, convertY };
}
