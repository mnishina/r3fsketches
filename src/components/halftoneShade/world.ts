console.log("world");
import * as THREE from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface World {
  init: (canvas: HTMLCanvasElement, canvasRect: DOMRect) => void;
  sizes: {
    width: number;
    height: number;
    canvasWidth: number;
    canvasHeight: number;
  };
  canvasRect?: DOMRect;
  renderer?: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  fov: number;
  aspectRatio: number;
  near: number;
  far: number;
  meshes: THREE.Mesh[];
}

const world: World = {
  init,
  sizes: {
    width: innerWidth,
    height: innerHeight,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  canvasRect: undefined,
  renderer: undefined,
  scene: new THREE.Scene(),
  camera: undefined,
  fov: 0,
  aspectRatio: 0,
  near: 0.1,
  far: 1000,
  meshes: [],
};

function init(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  console.log("world init", canvasRect);

  _defineCanvasRect(canvasRect);

  _createRenderer(canvas, canvasRect);
  _createCamera(canvasRect);
  _createMesh();
  _tick();
}

function _createMesh() {
  const geometry = new THREE.BoxGeometry(200, 200, 200, 10, 10, 10);

  const material = new THREE.ShaderMaterial({
    wireframe: true,
    uniforms: {},
    vertexShader,
    fragmentShader,
  });
  const mesh = new THREE.Mesh(geometry, material);

  world.scene.add(mesh);

  world.meshes.push(mesh);
}

function _createCamera(canvasRect: DOMRect) {
  const { width, height } = canvasRect;

  world.fov = (2 * Math.atan(height / 2 / world.far) * 180) / Math.PI;
  world.aspectRatio = width / height;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
  );
  world.camera.position.set(0, 0, world.far * 0.5);

  world.scene.add(world.camera);
}

function _createRenderer(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  world.renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  world.renderer.setSize(world.sizes.width, world.sizes.height);
  world.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function _tick() {
  requestAnimationFrame(_tick);

  world.meshes.forEach((mesh) => {
    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.001;
  });

  world.renderer && world.renderer.render(world.scene, world.camera!);
}

function _defineCanvasRect(canvasRect: DOMRect) {
  const { width, height } = canvasRect;
  world.sizes.canvasWidth = width;
  world.sizes.canvasHeight = height;

  world.canvasRect = canvasRect;

  return { width, height };
}

export default world;
