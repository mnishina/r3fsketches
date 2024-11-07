console.log("world");
import * as THREE from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface World {
  init: (canvas: HTMLCanvasElement) => void;
  sizes: {
    width: number;
    height: number;
    canvasWidth: number;
    canvasHeight: number;
  };
  pixelRatio: number;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  fov: number;
  aspect: number;
  near: number;
  far: number;
  renderer: THREE.WebGLRenderer | null;
}

const world: World = {
  init,
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(),
  fov: 75,
  aspect: 0,
  near: 0.1,
  far: 1000,
  renderer: null,
};

function init(canvas: HTMLCanvasElement) {
  console.log("world init");

  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  world.sizes.canvasWidth = width;
  world.sizes.canvasHeight = height;

  _createRenderer(canvas);
  _createCamera(world.sizes.canvasWidth, world.sizes.canvasHeight);

  _createMesh();

  _render();
}

function _createRenderer(canvas: HTMLCanvasElement) {
  world.renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  world.renderer.setPixelRatio(world.pixelRatio);
  world.renderer.setSize(
    world.sizes.canvasWidth,
    world.sizes.canvasHeight,
    false,
  );
}

function _createCamera(canvasWidth: number, canvasHeight: number) {
  world.aspect = canvasWidth / canvasHeight;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspect,
    world.near,
    world.far,
  );

  world.camera.position.z = 1;
}

function _createMesh() {
  const geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.set(5, 0, 2.75);

  world.scene.add(mesh);
}

function _render() {
  requestAnimationFrame(_render);

  world.renderer?.render(world.scene, world.camera);
}

export default world;
