console.log("world");
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  Points,
  MeshBasicMaterial,
  PlaneGeometry,
} from "three";

interface World {
  init: (canvas: HTMLCanvasElement, canvasRect: DOMRect) => void;
  sizes: {
    width: number;
    height: number;
    canvasWidth: number;
    canvasHeight: number;
  };
  canvas: HTMLCanvasElement | null;
  canvasRect: DOMRect | null;
  renderer: WebGLRenderer | null;
  scene: Scene;
  camera: PerspectiveCamera | null;
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
  canvas: null,
  canvasRect: null,
  renderer: null,
  scene: new Scene(),
  camera: null,
  fov: 50,
  aspectRatio: 0,
  near: 0.1,
  far: 1000,
};

function init(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  console.log("world init");

  world.canvas = canvas;
  world.canvasRect = canvasRect;

  const { width, height } = world.canvasRect;
  world.sizes.canvasWidth = width;
  world.sizes.canvasHeight = height;

  _createRenderer(world.canvas);
  _createCamera();

  _createMesh();

  _tick();
}

function _createRenderer(canvas: HTMLCanvasElement) {
  world.renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  world.renderer.setSize(world.sizes.canvasWidth, world.sizes.canvasHeight);
  world.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
}

function _createCamera() {
  world.aspectRatio = world.sizes.canvasWidth / world.sizes.canvasHeight;

  world.camera = new PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
  );

  world.camera.position.set(0, 0, 5);
}

function _tick() {
  requestAnimationFrame(_tick);

  world.renderer && world.renderer.render(world.scene, world.camera!);
}

function _createMesh() {
  const mesh = new Mesh(
    new PlaneGeometry(2, 2, 12, 12),
    new MeshBasicMaterial({ color: 0xff0000, wireframe: true }),
  );
  world.scene.add(mesh);
}

export default world;
