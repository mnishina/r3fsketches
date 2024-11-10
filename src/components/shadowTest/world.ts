console.log("shadowTest world");
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  SphereGeometry,
  PlaneGeometry,
  DoubleSide,
  DirectionalLight,
  DirectionalLightHelper,
  PointLight,
  PointLightHelper,
  AmbientLight,
  MeshStandardMaterial,
  Clock,
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
  movingSphereMesh: Mesh | undefined;
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
  movingSphereMesh: undefined,
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
  _createLight();
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
  world.renderer.shadowMap.enabled = true;
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
  world.camera.position.set(-15, 15, 20);

  world.scene.add(world.camera);
}

const clock = new Clock();

function _tick() {
  requestAnimationFrame(_tick);

  const elapsedTime = clock.getElapsedTime();

  world.movingSphereMesh!.position.x = Math.sin(elapsedTime * 2) * 4;
  world.movingSphereMesh!.position.z = Math.cos(elapsedTime * 2) * 4;
  world.movingSphereMesh!.position.y = Math.abs(Math.sin(elapsedTime * 8)) + 1;

  world.renderer?.render(world.scene, world.camera!);
}

function _createLight() {
  const light = new DirectionalLight(0xffffff, 2);
  light.position.set(5, 5, 5);
  light.castShadow = true;
  const helper = new DirectionalLightHelper(light, 5);

  const pointLight = new PointLight(0xffffff, 105);
  pointLight.position.set(-8, 3, -2);
  pointLight.castShadow = true;
  const pointLightHelper = new PointLightHelper(pointLight, 2);

  const ambientLight = new AmbientLight(0xffffff, 0.5);

  world.scene.add(light, helper, ambientLight);
  world.scene.add(pointLight, pointLightHelper);
}

function _createMesh() {
  const sphereMesh = new Mesh(
    new SphereGeometry(1, 128, 128),
    new MeshStandardMaterial({ color: "lightGray" }),
  );
  sphereMesh.position.set(0, 1, 0);
  sphereMesh.castShadow = true;

  const movingSphereMesh = new Mesh(
    new SphereGeometry(1, 128, 128),
    new MeshStandardMaterial({ color: "lightGray" }),
  );
  movingSphereMesh.position.set(0, 0, 0);
  movingSphereMesh.castShadow = true;
  world.movingSphereMesh = movingSphereMesh;

  const groundMesh = new Mesh(
    new PlaneGeometry(10, 10),
    new MeshStandardMaterial({ color: "gray", side: DoubleSide }),
  );
  groundMesh.rotation.set(-Math.PI / 2, 0, 0);
  groundMesh.receiveShadow = true;

  world.scene.add(sphereMesh, groundMesh, movingSphereMesh);
}

export default world;
