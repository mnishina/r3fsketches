console.log("world particlesFireworks");
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  Points,
  Spherical,
  ShaderMaterial,
  Float32BufferAttribute,
  Vector3,
  Vector2,
  TextureLoader,
  LoadingManager,
  Texture,
  AdditiveBlending,
  Color,
  MathUtils,
} from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";

import gsap from "gsap";

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
  texture: Texture[];
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
  texture: [],
  init,
};

function init(canvas: HTMLCanvasElement) {
  console.log("world init particlesFireworks");

  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  world.sizes.width = width * world.sizes.pixelRatio;
  world.sizes.height = height * world.sizes.pixelRatio;

  //camera
  const camera = new PerspectiveCamera(25, width / height, 0.1, 100);
  camera.position.set(1.5, 0, 6);
  world.scene.add(camera);

  //renderer
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height, false);
  renderer.setPixelRatio(world.sizes.pixelRatio);

  world.textureLoader.manager = world.loadManager;

  world.texture = [
    world.textureLoader.load("/particles/1.png"),
    world.textureLoader.load("/particles/2.png"),
    world.textureLoader.load("/particles/3.png"),
    world.textureLoader.load("/particles/4.png"),
    world.textureLoader.load("/particles/5.png"),
    world.textureLoader.load("/particles/6.png"),
    world.textureLoader.load("/particles/7.png"),
    world.textureLoader.load("/particles/8.png"),
  ];

  world.loadManager.onError = (url) => {
    console.log("error", url);
  };
  world.loadManager.onProgress = (url, loaded, total) => {
    console.log("progress", url, loaded, total);
  };
  world.loadManager.onLoad = () => {
    console.log("load");

    _createSky(renderer, camera);
    _genarateRandomFireworks();
    _tick(renderer, camera);

    Util.setupOrbitControl(camera, canvas);
  };
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
  radius: number,
  color: Color,
) {
  const positionsArray = new Float32Array(count * 3);
  const sizesArray = new Float32Array(count);
  const timeMultipliersArray = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    //球面座標系による位置の設定
    const spherical = new Spherical(
      radius * (0.75 + Math.random() * 0.25), //0.75から1.0までのランダムな半径を設定
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
    );
    const position = new Vector3();
    position.setFromSpherical(spherical);

    positionsArray[i3] = position.x;
    positionsArray[i3 + 1] = position.y;
    positionsArray[i3 + 2] = position.z;

    sizesArray[i] = Math.random();

    timeMultipliersArray[i] = 1 + Math.random(); //1をプラスして少し早くする。
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(positionsArray, 3),
  );
  geometry.setAttribute("aSize", new Float32BufferAttribute(sizesArray, 1));
  geometry.setAttribute(
    "aTimeMultiplier",
    new Float32BufferAttribute(timeMultipliersArray, 1),
  );

  texture.flipY = false; //これをやらないとテクスチャの上下が反転する

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
      uColor: { value: color },
      uProgress: { value: 0 },
    },
  });

  const firework = new Points(geometry, material);
  firework.position.copy(position); //花火の出現位置を設定するために設定する
  world.scene.add(firework);

  //destroy
  const destroy = () => {
    console.log("destroy");
    console.log("Creating fireworks with count:", count);
    console.log("Buffer sizes:", {
      positions: positionsArray.length,
      sizes: sizesArray.length,
      timeMultipliers: timeMultipliersArray.length,
    });

    world.scene.remove(firework);
    material.dispose();
    geometry.dispose();
  };

  //animate
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    duration: 3,
    ease: "linear",
    onComplete: destroy,
  });
}

function _genarateRandomFireworks() {
  const count = Math.round(100 + Math.random() * 50);
  const position = new Vector3(
    (Math.random() - 0.5) * 2,
    Math.random(),
    (Math.random() - 0.5) * 2,
  );
  const size = 0.1 + Math.random() * 0.1;
  const textureIndex = Math.floor(Math.random() * world.texture.length);
  const texture = world.texture[textureIndex];
  const radius = 0.5 + Math.random();
  const color = new Color();
  color.setHSL(
    Math.random(), // Hue: 0-1 (0=赤, 0.33=緑, 0.66=青, 1=赤)
    1, // Saturation: 0-1 (0=グレー, 1=鮮やか)
    0.7, // Lightness: 0-1 (0=黒, 0.5=通常, 1=白)
  );

  console.log(textureIndex);

  _createFireworks(count, position, size, texture, radius, color);
}

window.addEventListener("click", () => _genarateRandomFireworks());

function _createSky(renderer: WebGLRenderer, camera: PerspectiveCamera) {
  const sky = new Sky();
  sky.scale.setScalar(450000);
  world.scene.add(sky);

  const sun = new Vector3();

  /// GUI

  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure,
  };

  function guiChanged() {
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    const phi = MathUtils.degToRad(90 - effectController.elevation);
    const theta = MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(sun);

    renderer.toneMappingExposure = effectController.exposure;
    renderer.render(world.scene, camera);
  }

  // const gui = new GUI();

  // gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange(guiChanged);
  // gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
  // gui
  //   .add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
  //   .onChange(guiChanged);
  // gui
  //   .add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
  //   .onChange(guiChanged);
  // gui.add(effectController, "elevation", 0, 90, 0.1).onChange(guiChanged);
  // gui.add(effectController, "azimuth", -180, 180, 0.1).onChange(guiChanged);
  // gui.add(effectController, "exposure", 0, 1, 0.0001).onChange(guiChanged);

  guiChanged();
}

export default world;
