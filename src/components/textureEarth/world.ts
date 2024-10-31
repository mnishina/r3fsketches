// reference -> https://www.youtube.com/watch?v=UMqNHi1GDAE

console.log("world");

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const debug = {
  controls: undefined as OrbitControls | undefined,
};

const $ = {
  canvas: document.querySelector("#canvas") as HTMLCanvasElement,
};

const world = {
  sizes: {
    width: innerWidth,
    height: innerHeight,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  canvasRect: undefined as DOMRect | undefined,
  loadManager: new THREE.LoadingManager(),
  textureLoader: new THREE.TextureLoader(),
  scene: new THREE.Scene(),
  renderer: undefined as THREE.WebGLRenderer | undefined,
  camera: undefined as THREE.PerspectiveCamera | undefined,
  fov: 0,
  aspectRatio: 0,
  near: 0.1,
  far: 1000,
  EARTH_AXIS_TILT: (-23.4 * Math.PI) / 180,
  earthGroup: new THREE.Group(),
  earthTex_day: undefined as THREE.Texture | undefined,
  earthTex_day_spec: undefined as THREE.Texture | undefined,
  earthTex_day_bump: undefined as THREE.Texture | undefined,
  earthTex_night: undefined as THREE.Texture | undefined,
  earthTex_clouds: undefined as THREE.Texture | undefined,
  earthTex_clouds_alpha: undefined as THREE.Texture | undefined,
  earthMesh_day: undefined as THREE.Mesh | undefined,
  earthMesh_night: undefined as THREE.Mesh | undefined,
  earthMesh_clouds: undefined as THREE.Mesh | undefined,
  init,
};

function init() {
  console.log("world init");

  world.canvasRect = $.canvas!.getBoundingClientRect();

  world.loadManager.onError = (itemURL) => console.log("ERROR", itemURL);
  world.loadManager.onProgress = (itemURL, itemLoaded, itemTotal) => {
    console.log("... PROGRESS", itemURL, itemLoaded, itemTotal);
  };
  world.loadManager.onLoad = () => {
    console.log(">>> LOADED");

    _createRenderer(world.canvasRect!);
    _createCamera(world.canvasRect!);
    _createLight();
    _createMesh();
    _tick();

    _debug();
  };

  world.textureLoader.manager = world.loadManager;
  world.earthTex_day = world.textureLoader.load("/00_earthmap1k.jpg");
  world.earthTex_day_spec = world.textureLoader.load("/02_earthspec1k.jpg");
  world.earthTex_day_bump = world.textureLoader.load("/01_earthbump1k.jpg");
  world.earthTex_night = world.textureLoader.load("/03_earthlights1k.jpg");
  world.earthTex_clouds = world.textureLoader.load("/04_earthcloudmap.jpg");
  world.earthTex_clouds_alpha = world.textureLoader.load(
    "/05_earthcloudmaptrans.jpg",
  );
}

function _createRenderer(canvasRect: DOMRect) {
  const { width, height } = canvasRect;

  world.renderer = new THREE.WebGLRenderer({
    canvas: $.canvas!,
    antialias: true,
  });
  world.renderer.setSize(width, height, false);
  world.renderer.toneMapping = THREE.ACESFilmicToneMapping;
  world.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
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
  world.camera.position.set(0, 0, world.far);
}

function _createLight() {
  // const light = new THREE.HemisphereLight(0x555555, 0x000000, 10);
  const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
  sunLight.position.set(0, 0.5, 1.5);
  world.scene.add(sunLight);
}

function _createMesh() {
  world.earthGroup.rotation.z = world.EARTH_AXIS_TILT;
  world.earthGroup.scale.set(240, 240, 240);
  world.scene.add(world.earthGroup);

  const geometry = new THREE.IcosahedronGeometry(1, 12);
  const earthMaterial_day = new THREE.MeshPhongMaterial({
    map: world.earthTex_day,
    specularMap: world.earthTex_day_spec,
    bumpMap: world.earthTex_day_bump,
    bumpScale: 0.04,
  });
  const earthMaterial_night = new THREE.MeshBasicMaterial({
    map: world.earthTex_night,
    blending: THREE.AdditiveBlending,
  });
  const earthMaterial_clouds = new THREE.MeshBasicMaterial({
    map: world.earthTex_clouds,
    alphaMap: world.earthTex_clouds_alpha,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  });

  const earthMesh_day = new THREE.Mesh(geometry, earthMaterial_day);
  const earthMesh_night = new THREE.Mesh(geometry, earthMaterial_night);
  const earthMesh_clouds = new THREE.Mesh(geometry, earthMaterial_clouds);

  earthMesh_clouds.scale.setScalar(1.01);

  world.earthGroup.add(earthMesh_day);
  world.earthGroup.add(earthMesh_night);
  world.earthGroup.add(earthMesh_clouds);

  world.earthMesh_day = earthMesh_day;
  world.earthMesh_night = earthMesh_night;
  world.earthMesh_clouds = earthMesh_clouds;
}

function _tick() {
  requestAnimationFrame(_tick);

  world.earthMesh_day!.rotation.y += 0.0005;
  world.earthMesh_night!.rotation.y += 0.0005;
  world.earthMesh_clouds!.rotation.y += 0.0006;

  world.renderer!.render(world.scene, world.camera!);
}

function _debug() {
  debug.controls = new OrbitControls(world.camera!, $.canvas);
}

export default world;
