import * as THREE from "three";
import Utils from "../Utils/index";

interface World {
  init: (canvas: HTMLCanvasElement) => void;
  numbers: {
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
    aspectRatio: number | undefined;
    pixelRatio: number;
  };
  scene: THREE.Scene;
}

const world: World = {
  init,
  numbers: {
    canvasWidth: undefined,
    canvasHeight: undefined,
    aspectRatio: undefined,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  },
  scene: new THREE.Scene(),
};

function init(canvas: HTMLCanvasElement) {
  console.log("world init");

  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  world.numbers.canvasWidth = width;
  world.numbers.canvasHeight = height;
  world.numbers.aspectRatio = width / height;

  const camera = new THREE.PerspectiveCamera(
    75,
    world.numbers.aspectRatio,
    0.1,
    1000,
  );
  camera.position.set(0, 0.1, 15);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(world.numbers.canvasWidth, world.numbers.canvasHeight);

  _tick(renderer, world.scene, camera);
  _createMesh();

  Utils.setupOrbitControl(camera, canvas);
}

function _tick(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
) {
  window.requestAnimationFrame(() => _tick(renderer, scene, camera));

  renderer.render(scene, camera);
}

function _createMesh() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshBasicMaterial({ color: 0xcccccc }),
  );
  ground.rotation.x = -Math.PI / 2;
  world.scene.add(ground);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 10),
    new THREE.MeshBasicMaterial({ wireframe: true }),
  );
  sphere.position.set(0, 1, 0);
  world.scene.add(sphere);
}

export default world;
