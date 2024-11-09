console.log("world");
import { WebGLRenderer, Scene, PerspectiveCamera, Mesh, BoxGeometry, SphereGeometry, ShaderMaterial, BufferGeometry } from "three";

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
  renderer?: WebGLRenderer;
  scene: Scene;
  camera?: PerspectiveCamera;
  fov: number;
  aspectRatio: number;
  near: number;
  far: number;
  meshes: Mesh[];
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
  scene: new Scene(),
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
  const material = new ShaderMaterial({
    wireframe: true,
    uniforms: {},
    vertexShader,
    fragmentShader,
  });

  const geometries = [
    {
      geometry: new BoxGeometry(140, 140, 140, 10, 10, 10),
    },
    {
      geometry: new SphereGeometry(90, 10),
    },
  ];

  let i = 0;
  geometries.forEach((geometry: { geometry: BufferGeometry }) => {
    const mesh = new Mesh(geometry.geometry, material);
    mesh.position.set(200 * i - 90, 0, 0);

    world.scene.add(mesh);
    world.meshes.push(mesh);

    i++;
  });
}

function _createCamera(canvasRect: DOMRect) {
  const { width, height } = canvasRect;

  world.fov = (2 * Math.atan(height / 2 / world.far) * 180) / Math.PI;
  world.aspectRatio = width / height;

  world.camera = new PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
  );
  world.camera.position.set(0, 0, world.far * 0.5);

  world.scene.add(world.camera);
}

function _createRenderer(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  world.renderer = new WebGLRenderer({
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
