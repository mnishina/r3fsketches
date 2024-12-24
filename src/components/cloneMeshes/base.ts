import * as THREE from "three";

import { getViewportInfo, getCameraFov } from "./utils";
import type { Base } from "./type";

const base: Base = {
  init,
  scene: new THREE.Scene(),
  renderer: null,
  camera: null,
  geometry: null,
  material: null,
  mesh: null,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  cameraInfo: {
    fov: null,
    aspectRatio: null,
    near: 0.1,
    far: 1000,
  },
};

function init(canvas: HTMLCanvasElement) {
  const { width, height, aspectRatio } = getViewportInfo(canvas);

  const fov = getCameraFov(height, base.cameraInfo.far);
  base.camera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    base.cameraInfo.near,
    base.cameraInfo.far,
  );
  base.camera.position.z = base.cameraInfo.far;

  base.renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  base.renderer.setSize(width, height, false);
  base.renderer.setPixelRatio(base.pixelRatio);

  base.geometry = new THREE.PlaneGeometry(500, 500, 32, 32);
  base.material = new THREE.ShaderMaterial({ wireframe: true });

  base.mesh = new THREE.Mesh(base.geometry, base.material);

  base.scene.add(base.mesh);
}

export default base;
