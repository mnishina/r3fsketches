console.log("world particlesFireworks");
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  Points,
  ShaderMaterial,
  Float32BufferAttribute,
  Vector3,
  Vector2,
  TextureLoader,
  LoadingManager,
  Texture,
  AdditiveBlending,
} from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

import Util from "../Utils/index";

interface World {
  sizes: {
    width: number | undefined;
    height: number | undefined;
    pixelRatio: number;
  };
  scene: Scene;
  loadManager: LoadingManager;
  textureLoader: TextureLoader;
  init: (canvas: HTMLCanvasElement) => void;
}

const world: World = {
  sizes: {
    width: undefined,
    height: undefined,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  },
  scene: new Scene(),
  loadManager: new LoadingManager(),
  textureLoader: new TextureLoader(),
  init,
};

function init(canvas: HTMLCanvasElement) {
  console.log("world init particlesFireworks");

  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  world.sizes.width = width * world.sizes.pixelRatio;
  world.sizes.height = height * world.sizes.pixelRatio;

  world.textureLoader.manager = world.loadManager;
  const texture = [
    world.textureLoader.load("/particles/1.png"),
    world.textureLoader.load("/particles/2.png"),
    world.textureLoader.load("/particles/3.png"),
    world.textureLoader.load("/particles/4.png"),
    world.textureLoader.load("/particles/5.png"),
    world.textureLoader.load("/particles/6.png"),
    world.textureLoader.load("/particles/7.png"),
    world.textureLoader.load("/particles/8.png"),
  ];

  //camera
  const camera = new PerspectiveCamera(25, width / height, 0.1, 100);
  camera.position.set(1.5, 0, 6);
  world.scene.add(camera);

  //renderer
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(world.sizes.pixelRatio);

  _createFireworks(100, new Vector3(), 0.5, texture[7]);

  _tick(renderer, camera);

  Util.setupOrbitControl(camera, canvas);
}

function _tick(renderer: WebGLRenderer, camera: PerspectiveCamera) {
  requestAnimationFrame(() => _tick(renderer, camera));

  renderer.render(world.scene, camera);
}

function _createFireworks(
  count: number,
  position: Vector3,
  size: number,
  texture: Texture,
) {
  const positionsArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    positionsArray[i3] = Math.random() - 0.5;
    positionsArray[i3 + 1] = Math.random() - 0.5;
    positionsArray[i3 + 2] = Math.random() - 0.5;

    sizesArray[i] = Math.random();
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(positionsArray, 3),
  );
  geometry.setAttribute("aSize", new Float32BufferAttribute(sizesArray, 1));

  texture.flipY = false; //これをやらないとテクスチャの上下を反転する

  const material = new ShaderMaterial({
    wireframe: true,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader,
    fragmentShader,
    uniforms: {
      uSize: { value: size },
      uResolution: {
        value: new Vector2(world.sizes.width, world.sizes.height),
      },
      uTexture: { value: texture },
    },
  });

  const firework = new Points(geometry, material);
  firework.position.copy(position); //花火の出現位置を設定するために設定する
  world.scene.add(firework);
}

export default world;
