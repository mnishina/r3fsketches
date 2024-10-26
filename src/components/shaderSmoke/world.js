import * as THREE from "three";

const world = {
  init,
  sizes: {
    width: innerWidth,
    height: innerHeight,
  },
  canvas: document.querySelector("#canvas"),
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000),
  clock: new THREE.Clock(),
};

function init() {
  console.log("init");

  world.camera.position.z = 2;

  //mesh
  const geometry = new THREE.PlaneGeometry(1, 2, 30, 30);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  world.scene.add(mesh);

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: world.canvas,
  });
  renderer.setSize(world.sizes.width, world.sizes.height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  _tick(renderer);
}

function _tick(renderer) {
  requestAnimationFrame(() => _tick(renderer));

  const elapsedTime = world.clock.getElapsedTime();

  renderer.render(world.scene, world.camera);
}

export default world;
