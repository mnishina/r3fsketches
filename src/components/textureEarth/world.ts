console.log("world");

import * as THREE from "three";

const $ = {
  canvas: document.querySelector("#canvas"),
};

const world = {
  sizes: {
    width: innerWidth,
    height: innerHeight,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  canvasRect: undefined as DOMRect | undefined,
  loadManager: new THREE.LoadingManager(),
  textureLoader: new THREE.TextureLoader(),
  scene: new THREE.Scene(),
  renderer: undefined as THREE.Renderer | undefined,
  camera: undefined as THREE.PerspectiveCamera | undefined,
  fov: 0,
  aspectRatio: 0,
  near: 0.1,
  far: 1000,
  init,
};

function init() {
  console.log("world init");

  world.canvasRect = $.canvas!.getBoundingClientRect();

  _createRenderer(world.canvasRect);
  _createCamera(world.canvasRect);
  _createMesh();
  _tick();
}

function _createRenderer(canvasRect: DOMRect) {
  const { width, height } = canvasRect;

  world.renderer = new THREE.WebGLRenderer({
    canvas: $.canvas!,
    antialias: true,
  });
  world.renderer.setSize(width, height, false);
}

function _createCamera(canvasRect: DOMRect) {
  const { width, height } = canvasRect;
  world.fov = 75;
  world.aspectRatio = width / height;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
  );

  world.camera.position.set(0, 0, 200);
}

function _createMesh() {
  const geometry = new THREE.BoxGeometry(100, 100, 100, 10, 10, 10);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  world.scene.add(mesh);
}

function _tick() {
  requestAnimationFrame(_tick);

  world.renderer!.render(world.scene, world.camera!);
}

export default world;
