console.log("world particlesFireworks");
import * as THREE from "three";

interface World {
  scene: THREE.Scene;
  init: (canvas: HTMLCanvasElement) => void;
}

const world: World = {
  scene: new THREE.Scene(),
  init,
};

function init(canvas: HTMLCanvasElement) {
  console.log("world init particlesFireworks");

  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;

  //camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;
  world.scene.add(camera);

  //renderer
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(width, height, false);

  _createMesh();

  _tick(renderer, camera);
}

function _tick(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  requestAnimationFrame(() => _tick(renderer, camera));

  renderer.render(world.scene, camera);
}

function _createMesh() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
  });
  const cube = new THREE.Mesh(geometry, material);
  world.scene.add(cube);
}

export default world;
