import * as THREE from "three";

import base from "./base";
import { getViewportInfo, getCameraFov } from "./utils";

import type { View } from "./type";

const view: View = {
  init,
  render,
};

function init(canvas: HTMLCanvasElement) {
  const { camera, renderer } = base;
  if (!camera || !renderer) return;

  window.addEventListener("resize", () => {
    onResize(canvas, camera, renderer);
  });
}

function render(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
) {
  renderer.render(scene, camera);

  requestAnimationFrame(() => render(renderer, camera, scene));
}

function onResize(
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) {
  let timeoutID: number;

  timeoutID = setTimeout(() => {
    clearTimeout(timeoutID);

    const { width, height, aspectRatio } = getViewportInfo(canvas);
    const fov = getCameraFov(canvas, base.cameraInfo.far);

    renderer.setSize(width, height, false);

    camera.aspect = aspectRatio;
    camera.fov = fov;
    camera.updateProjectionMatrix();

    base.cameraInfo.fov = fov;
  }, 500);
}

export default view;
