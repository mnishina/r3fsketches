import * as THREE from "three";

import base from "./base";
import { getViewportInfo, getCameraFov, getWorldPosition } from "./utils";

import type { View, LoadedMedias, ObjectStore } from "./type";

const view: View = {
  init,
  createMesh,
  render,
  objectStore: [],
};

function init($canvas: HTMLCanvasElement) {
  const { camera, renderer } = base;
  if (!camera || !renderer) return;

  window.addEventListener("resize", () => {
    _onResize($canvas, camera, renderer);
  });
}

function createMesh(loadedMedias: (LoadedMedias | undefined)[]) {
  view.objectStore = loadedMedias.map((media) => {
    if (!base.geometry || !base.material || !media) return;

    const { $image, texture } = media;
    const { width, height, x, y } = $image.getBoundingClientRect();

    texture.needsUpdate = false;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = base.material.clone();
    material.uniforms.uTexture.value = texture;

    const mesh = new THREE.Mesh(base.geometry, material);
    mesh.scale.set(width, height, 0);
    base.scene.add(mesh);

    return {
      $image,
      $imageX: x,
      $imageY: y,
      $imageWidth: width,
      $imageHeight: height,
      material,
      mesh,
    };
  });

  console.log(view.objectStore);
}

function render(
  $canvas: HTMLCanvasElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
) {
  renderer.render(scene, camera);

  _setMeshPosition($canvas, view.objectStore);

  requestAnimationFrame(() => render($canvas, renderer, camera, scene));
}

function _onResize(
  $canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
) {
  let timeoutID: number;

  timeoutID = setTimeout(() => {
    clearTimeout(timeoutID);

    const { width, height, aspectRatio } = getViewportInfo($canvas);
    const fov = getCameraFov(height, base.cameraInfo.far);

    renderer.setSize(width, height, false);

    camera.aspect = aspectRatio;
    camera.fov = fov;
    camera.updateProjectionMatrix();

    base.cameraInfo.fov = fov;
  }, 500);
}

function _setMeshPosition(
  $canvas: HTMLCanvasElement,
  objectStore: (ObjectStore | undefined)[],
) {
  const { width: canvasRectWidth, height: canvasRectHeight } =
    getViewportInfo($canvas);

  objectStore.forEach((o) => {
    if (!o) return;

    const { mesh, $imageX, $imageY, $imageWidth, $imageHeight } = o;

    mesh.position.x = $imageX - canvasRectWidth / 2 + $imageWidth / 2;
    mesh.position.y =
      -($imageY - canvasRectHeight / 2 + $imageHeight / 2) + window.scrollY;
  });
}

export default view;
