console.log("world");
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  DoubleSide,
  Clock,
} from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface World {
  init: (canvas: HTMLCanvasElement) => void;
  sizes: {
    width: number;
    height: number;
    canvasWidth: number | null;
    canvasHeight: number | null;
  };
  pixelRatio: number;
  scene: Scene;
  camera: PerspectiveCamera;
  fov: number;
  aspect: number | null;
  near: number;
  far: number;
  renderer: WebGLRenderer | null;
  clock: Clock;
  objects: (ShaderMaterial | Mesh)[];
}

const world: World = {
  init,
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: null,
    canvasHeight: null,
  },
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  scene: new Scene(),
  camera: new PerspectiveCamera(),
  fov: 75,
  aspect: null,
  near: 0.1,
  far: 1000,
  renderer: null,
  clock: new Clock(),
  objects: [],
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
  world.renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  world.renderer.setPixelRatio(world.pixelRatio);
  world.renderer.setSize(
    world.sizes.canvasWidth!,
    world.sizes.canvasHeight!,
    false,
  );
}

function _createCamera(canvasWidth: number, canvasHeight: number) {
  world.aspect = canvasWidth / canvasHeight;

  world.camera = new PerspectiveCamera(
    world.fov,
    world.aspect,
    world.near,
    world.far,
  );

  world.camera.position.z = 1;
}

function _createMesh() {
  const geometry = new PlaneGeometry(1, 1, 10, 10);
  const material = new ShaderMaterial({
    side: DoubleSide,
    wireframe: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
    },
  });
  const mesh = new Mesh(geometry, material);
  mesh.rotation.set(5, 0, 2.75);

  world.scene.add(mesh);

  world.objects.push(material, mesh);
}

function _render() {
  requestAnimationFrame(_render);

  const elapsedTime = world.clock.getElapsedTime();
  world.objects.forEach((object) => {
    if (object instanceof ShaderMaterial) {
      object.uniforms.uTime.value = elapsedTime;
    }
  });

  world.renderer?.render(world.scene, world.camera);
}

export default world;
