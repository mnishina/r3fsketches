console.log("world");
import Utils from "../Utils/index";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Points,
  BufferGeometry,
  BufferAttribute,
  PointsMaterial,
  ShaderMaterial,
  AdditiveBlending,
  Color,
} from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface World {
  init: (canvas: HTMLCanvasElement, canvasRect: DOMRect) => void;
  sizes: {
    width: number;
    height: number;
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
  };
  canvas: HTMLCanvasElement | undefined;
  canvasRect: DOMRect | undefined;
  renderer: WebGLRenderer | undefined;
  scene: Scene;
  camera: PerspectiveCamera | undefined;
  fov: number;
  aspectRatio: number | undefined;
  near: number;
  far: number;
  points: Points | undefined;
}

const world: World = {
  init,
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: undefined,
    canvasHeight: undefined,
  },
  canvas: undefined,
  canvasRect: undefined,
  renderer: undefined,
  scene: new Scene(),
  camera: undefined,
  fov: 50,
  aspectRatio: undefined,
  near: 0.1,
  far: 1000,
  points: undefined,
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

  _addGUI();
  Utils.setupOrbitControl(world.camera!, canvas);
}

function _createRenderer(canvas: HTMLCanvasElement) {
  world.renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  world.renderer.setSize(world.sizes.canvasWidth!, world.sizes.canvasHeight!);
  world.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function _createCamera() {
  world.aspectRatio = world.sizes.canvasWidth! / world.sizes.canvasHeight!;

  world.camera = new PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
  );

  world.camera.position.set(5, 7, 10);
}

function _tick() {
  requestAnimationFrame(_tick);

  world.renderer?.render(world.scene, world.camera!);

  // if (world.points) {
  //   world.points.rotation.y += 0.0005;
  // }
}

function _addGUI() {
  Utils.setupGUI();
}

interface Parameters {
  count: number;
  // size: number;
  radius: number;
  branches: number;
  spin: number;
  randomness: number;
  randomnessPower: number;
  colorInside: string;
  colorOutside: string;
}

const parameters: Parameters = {
  count: 100000,
  // size: 0.005,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.5,
  randomnessPower: 3,
  colorInside: "#ff6030",
  colorOutside: "#1b3984",
};

function _createMesh() {
  const geometry = new BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const scale = new Float32Array(parameters.count * 1);

  const colorInside = new Color(parameters.colorInside);
  const colorOutside = new Color(parameters.colorOutside);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * parameters.radius;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    // if (i < 20) {
    //   console.log(branchAngle);
    // }

    positions[i3 + 0] = Math.cos(branchAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle) * radius + randomZ;

    // colors
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);
    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // scale
    scale[i] = Math.random();
  }

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new BufferAttribute(scale, 1));

  const material = new ShaderMaterial({
    depthWrite: false,
    blending: AdditiveBlending,
    vertexColors: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uSize: { value: 8 * world.renderer!.getPixelRatio() },
    },
  });

  const points = new Points(geometry, material);
  world.scene.add(points);

  world.points = points;
}

export default world;
