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
  Vector2,
  Color,
  ACESFilmicToneMapping,
} from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

import Util from "../Utils/index";

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
  segments: number;
  renderer: WebGLRenderer | null;
  clock: Clock;
  objects: (ShaderMaterial | Mesh)[];
  debug: {
    depthColor: string;
    surfaceColor: string;
  };
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
  segments: 512,
  renderer: null,
  clock: new Clock(),
  objects: [],
  debug: {
    depthColor: "#ff4000",
    surfaceColor: "#151c37",
  },
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

  Util.setupOrbitControl(world.camera, canvas);

  // const axesHelper = Util.setupAxesHelper();
  // axesHelper.position.set(0, 0.25, 0);
  // world.scene.add(axesHelper);
}

function _createRenderer(canvas: HTMLCanvasElement) {
  world.renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  world.renderer.toneMapping = ACESFilmicToneMapping;
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

  world.camera.position.set(0.1, 0.75, 0.55);
}

function _createMesh() {
  const geometry = new PlaneGeometry(2.5, 3.5, world.segments, world.segments);
  geometry.deleteAttribute("normal");
  geometry.deleteAttribute("uv");

  const material = new ShaderMaterial({
    // wireframe: true,
    side: DoubleSide,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },

      uBigWavesElevation: {
        value: 0.2,
      },
      uBigWavesFrequency: {
        value: new Vector2(3, 1.8),
      },
      uBigWavesSpeed: { value: 0.75 },

      uSmallWavesElevation: { value: 0.15 },
      uSmallWavesFrequency: { value: 3 },
      uSmallWavesSpeed: { value: 0.2 },
      uSmallWavesIterations: { value: 4 },

      uDepthColor: { value: new Color(world.debug.depthColor) },
      uSurfaceColor: { value: new Color(world.debug.surfaceColor) },

      uColorOffset: { value: 0.925 },
      uColorMultiplier: { value: 1 },
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
