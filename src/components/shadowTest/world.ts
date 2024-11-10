console.log("shadowTest world");
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
} from "three";

import Utils from "~/components/Utils/index";

interface World {
  sizes: {
    width: number;
    height: number;
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
  };
  scene: Scene;
  camera: PerspectiveCamera | undefined;
  renderer: WebGLRenderer | undefined;
  fov: number;
  aspectRatio: number | undefined;
  near: number;
  far: number;
  pixelRatio: number;
  init: (canvas: HTMLCanvasElement) => void;
}

const world: World = {
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: undefined,
    canvasHeight: undefined,
  },
  scene: new Scene(),
  camera: undefined,
  fov: 35,
  aspectRatio: undefined,
  near: 0.1,
  far: 1000,
  renderer: undefined,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  init,
};

function init(canvas: HTMLCanvasElement) {
  console.log("init");

  const canvasRect = canvas.getBoundingClientRect();
  world.sizes.canvasWidth = canvasRect.width;
  world.sizes.canvasHeight = canvasRect.height;
  world.aspectRatio = world.sizes.canvasWidth / world.sizes.canvasHeight;

  _createRenderer(canvas, world.sizes.width, world.sizes.height);
  _createCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
    world.sizes.width,
    world.sizes.height,
  );
  _createMesh();
  _tick();

  Utils.setupOrbitControl(world.camera!, canvas);
}

function _createRenderer(
  canvas: HTMLCanvasElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  world.renderer = new WebGLRenderer({ canvas, antialias: true });
  world.renderer.setSize(canvasWidth, canvasHeight, false);
  world.renderer.setPixelRatio(world.pixelRatio);
}

function _createCamera(
  fov: number,
  aspectRatio: number,
  near: number,
  far: number,
  canvasWidth: number,
  canvasHeight: number,
) {
  aspectRatio = canvasWidth / canvasHeight;

  world.camera = new PerspectiveCamera(fov, aspectRatio, near, far);
  world.camera.position.set(5, 5, 5);

  world.scene.add(world.camera);
}

function _tick() {
  requestAnimationFrame(_tick);
  world.renderer?.render(world.scene, world.camera!);
}

function _createMesh() {
  const mesh = new Mesh(new BoxGeometry(), new MeshBasicMaterial());

  world.scene.add(mesh);
}

export default world;
