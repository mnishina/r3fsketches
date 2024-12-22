import * as THREE from "three";

const view = {
  init,
  render,
};

function init() {}

function render(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
) {
  renderer.render(scene, camera);

  requestAnimationFrame(() => render(renderer, camera, scene));
}

export default view;
