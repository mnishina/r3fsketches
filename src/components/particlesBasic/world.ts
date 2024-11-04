console.log("world");
import * as THREE from "three";
import Utils from "../Utils";

interface World {
  init: (canvas: HTMLCanvasElement, canvasRect: DOMRect) => void;
  sizes: {
    width: number;
    height: number;
    canvasWidth: number;
    canvasHeight: number;
  };
  canvasRect: DOMRect | null;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.Camera | null;
  fov: number;
  aspectRatio: number;
  near: number;
  far: number;
  loadManager: THREE.LoadingManager;
  textureLoader: THREE.TextureLoader;
  particleTex: THREE.Texture | null;
  texPath: string;
}

const world: World = {
  init,
  sizes: {
    width: window.innerWidth,
    height: window.innerHeight,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  canvasRect: null,
  scene: new THREE.Scene(),
  renderer: null,
  camera: null,
  fov: 50,
  aspectRatio: 0,
  near: 0.1,
  far: 1000,
  loadManager: new THREE.LoadingManager(),
  textureLoader: new THREE.TextureLoader(),
  particleTex: null,
  texPath: "/star.png",
};

async function init(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  console.log("world init");

  _defineCanvas(canvasRect);

  _createRenderer(canvas);
  _createCamera();
  Utils.setupOrbitControl(world.camera!, canvas);

  await _loadTex();

  _createMesh();

  _tick();
}

function _createRenderer(canvas: HTMLCanvasElement) {
  world.renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  world.renderer.setSize(world.sizes.canvasWidth, world.sizes.canvasHeight);
  world.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function _createCamera() {
  world.aspectRatio = world.sizes.canvasWidth / world.sizes.canvasHeight;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
  );
  world.camera.position.set(0, 0, 5);
}

function _tick() {
  requestAnimationFrame(_tick);

  Utils.control?.update();

  world.renderer && world.renderer.render(world.scene, world.camera!);
}

function _defineCanvas(canvasRect: DOMRect) {
  const { width, height } = canvasRect;
  world.sizes.canvasWidth = width;
  world.sizes.canvasHeight = height;

  world.canvasRect = canvasRect;
}

async function _loadTex() {
  console.log("_loadTex");

  world.textureLoader.manager = world.loadManager;

  world.loadManager.onError = (url) => {
    console.log("Error", url);
  };
  world.loadManager.onProgress = (url, loaded, total) => {
    console.log("> progress", url, loaded, total);
  };
  world.loadManager.onLoad = () => {
    console.log("∟ loaded.");
  };

  world.particleTex = await world.textureLoader.loadAsync(world.texPath);
}

function _createMesh() {
  console.log("_createMesh");

  // const geometry = new THREE.SphereGeometry();
  // const material = new THREE.PointsMaterial();
  // material.size = 0.02;
  // material.sizeAttenuation = true;
  // const mesh = new THREE.Points(geometry, material);

  const particlesGeometry = new THREE.BufferGeometry();
  const count = 50000;

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    sizeAttenuation: true,
    // color: new THREE.Color("#ff88cc"),
    // map: world.particleTex,
    transparent: true,
    map: world.particleTex,
    // alphaMap: world.particleTex,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false,
    // blending: THREE.AdditiveBlending,
    vertexColors: true,
  });
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  world.scene.add(particlesMesh);

  // const mesh = new THREE.Mesh(
  //   new THREE.BoxGeometry(),
  //   new THREE.MeshBasicMaterial(),
  // );
  // world.scene.add(mesh);
}

export default world;
