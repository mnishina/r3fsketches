import * as THREE from "three";

import type { Base } from "./type";

const base: Base = {
  init,
  scene: new THREE.Scene(),
  renderer: null,
  camera: null,
  geometry: null,
  material: null,
  mesh: null,
};

function init(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  const { width, height } = canvasRect;

  base.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  base.camera.position.z = 5;

  base.renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  base.renderer.setSize(width, height, false);

  base.geometry = new THREE.PlaneGeometry(3, 3, 32, 32);
  base.material = new THREE.ShaderMaterial({ wireframe: true });

  base.mesh = new THREE.Mesh(base.geometry, base.material);

  base.scene.add(base.mesh);
}

export default base;
