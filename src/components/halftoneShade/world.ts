console.log("world");
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Mesh,
  BoxGeometry,
  SphereGeometry,
  ShaderMaterial,
  BufferGeometry,
  Color,
  Vector2,
  TorusKnotGeometry,
} from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

import Util from "~/components/Utils/index";

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
  pixelRatio: number;
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
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  meshes: [],
};

function init(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  console.log("world init", canvasRect);

  _defineCanvasRect(canvasRect);

  _createRenderer(canvas, canvasRect);
  _createCamera(canvasRect);
  _createMesh();
  _tick();

  Util.setupOrbitControl(world.camera!, canvas);
}

function _createMesh() {
  const materialParameters = {
    color: new Color(0xff794d),
    shadeColor: new Color(0x8e19b8),
    lightColor: new Color(0xe5ffe0),
  };

  const material = new ShaderMaterial({
    // wireframe: true,
    uniforms: {
      uColor: { value: new Color(materialParameters.color) },
      uShadeColor: { value: new Color(materialParameters.shadeColor) },
      uResolution: {
        value: new Vector2(
          world.sizes.canvasWidth * world.pixelRatio,
          world.sizes.canvasHeight * world.pixelRatio,
        ),
      },
      uShadowRepetitions: { value: 125.0 },
      uShadowColor: { value: new Color(materialParameters.shadeColor) },
      uLightRepetitions: { value: 150.0 },
      uLightColor: { value: new Color(materialParameters.lightColor) },
    },
    vertexShader,
    fragmentShader,
  });

  const geometries = [
    {
      geometry: new TorusKnotGeometry(50, 20, 100, 16),
    },
    {
      geometry: new SphereGeometry(90, 128),
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

  // world.fov = (2 * Math.atan(height / 2 / world.far) * 180) / Math.PI;
  world.fov = 50;
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
  world.renderer.setPixelRatio(world.pixelRatio);
}

function _tick() {
  requestAnimationFrame(_tick);

  world.meshes.forEach((mesh) => {
    mesh.rotation.x += 0.001;
    mesh.rotation.z += 0.001;
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
