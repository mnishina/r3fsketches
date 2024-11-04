console.log("world");
import * as THREE from "three";
import Utils from "../Utils";

interface World {
  init: (canvas: HTMLCanvasElement, canvasRect: DOMRect) => void;
  sizes: {
    width: number;
    height: number;
    canvasWidth: number;
    canvasHeight: number;
  };
  canvasRect: DOMRect | null;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.Camera | null;
  fov: number;
  aspectRatio: number;
  near: number;
  far: number;
}

const world: World = {
  init,
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  canvasRect: null,
  scene: new THREE.Scene(),
  renderer: null,
  camera: null,
  fov: 50,
  aspectRatio: 0,
  near: 0.1,
  far: 1000,
};

function init(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  console.log("world init");

  _defineCanvas(canvasRect);

  _createRenderer(canvas);
  _createCamera();
  _createMesh();

  Utils.setupOrbitControl(world.camera!, canvas);

  _tick();
}

function _createRenderer(canvas: HTMLCanvasElement) {
  world.renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  world.renderer.setSize(world.sizes.canvasWidth, world.sizes.canvasHeight);
  world.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function _createCamera() {
  world.aspectRatio = world.sizes.canvasWidth / world.sizes.canvasHeight;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
  );
  world.camera.position.set(0, 0, 5);
}

function _createMesh() {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 3, 30),
    new THREE.MeshBasicMaterial({ color: 0x0cc000, side: THREE.DoubleSide }),
  );
  world.scene.add(mesh);
}

function _tick() {
  requestAnimationFrame(_tick);

  Utils.control?.update();

  world.renderer && world.renderer.render(world.scene, world.camera!);
}

function _defineCanvas(canvasRect: DOMRect) {
  const { width, height } = canvasRect;
  world.sizes.canvasWidth = width;
  world.sizes.canvasHeight = height;

  world.canvasRect = canvasRect;
}

export default world;
