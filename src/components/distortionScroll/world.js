console.log("world");
import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const $ = {
  canvas: document.querySelector("#canvas"),
  img: document.querySelectorAll("[data-webgl]"),
};

const world = {
  sizes: {
    width: innerWidth,
    height: innerHeight,
  },
  loadManager: new THREE.LoadingManager(),
  textureLoader: new THREE.TextureLoader(),
  scene: new THREE.Scene(),
  renderer: null,
  camera: null,
  near: 0.1,
  perspective: 1000,
  fov: 0,
  aspectRatio: 0,
  geometry: null,
  tex: null,
  images: [],
  material: null,
  materials: [],
  mesh: null,
  meshes: [],
  elems: [],
  clock: new THREE.Clock(),
  time: 0,
  init,
};

function init() {
  console.log("init");

  const { width, height } = $.canvas.getBoundingClientRect();
  world.sizes.canvasWidth = width;
  world.sizes.canvasHeight = height;

  world.textureLoader.manager = world.loadManager;
  world.loadManager.onError = (url) => console.log("error");
  world.loadManager.onStart = () => {
    _createCamera();
    _createRenderer();
  };
  world.loadManager.onProgress = (itemURL, itemLoaded, itemTotal) => {
    console.log("PROGRESS", itemURL, itemLoaded, itemTotal);
  };
  world.loadManager.onLoad = () => {
    console.log("loaded");

    _createMesh();
    _tick();
  };

  $.img.forEach((img) => {
    const image = {
      tex: world.textureLoader.load(img.getAttribute("src")),
    };
    world.images.push(image);
  });
}

function _createMesh() {
  let i = 0;
  $.img.forEach(function (img) {
    const { width, height, elementLeft, elementTop } = _getWorldPosition(img);
    const imgRect = img.getBoundingClientRect();

    world.geometry = new THREE.PlaneGeometry(width, height, 30, 30);
    world.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: {
          value: world.time,
        },
        uTex: {
          value: world.images[i].tex,
        },
      },
    });
    world.mesh = new THREE.Mesh(world.geometry, world.material);
    world.mesh.position.set(elementLeft, elementTop, 0);

    const elem = {
      imgRect,
      geometry: world.geometry,
      material: world.material,
      mesh: world.mesh,
      $: {
        img,
      },
    };
    world.elems.push(elem);

    world.meshes.push(world.mesh);
    world.materials.push(world.material);

    world.scene.add(world.mesh);

    i++;
  });
}

function _createCamera() {
  world.aspectRatio = world.sizes.width / world.sizes.height;
  world.fov =
    (2 * Math.atan(world.sizes.height / 2 / world.perspective) * 180) / Math.PI;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.perspective,
  );
  world.camera.position.set(0, 0, world.perspective);

  world.scene.add(world.camera);
}

function _createRenderer() {
  world.renderer = new THREE.WebGLRenderer({
    canvas: $.canvas,
    antialias: true,
    alpha: true,
  });
  world.renderer.setSize(
    world.sizes.canvasWidth,
    world.sizes.canvasHeight,
    false,
  );
}

function _tick() {
  requestAnimationFrame(_tick);

  world.time = world.clock.getElapsedTime();
  world.materials.forEach((material) => {
    material.uniforms.uTime.value = world.time;
  });

  world.elems.forEach((elem) => _scrollElem(elem));

  world.renderer.render(world.scene, world.camera);
}

function _scrollElem(elem) {
  const {
    mesh,
    $: { img },
  } = elem;

  const { elementTop } = _getWorldPosition(img);
  mesh.position.y = elementTop;
}

function _getWorldPosition(elem) {
  const { width, height, left, top } = elem.getBoundingClientRect();

  const elementLeft = left - world.sizes.canvasWidth / 2 + width / 2;
  const elementTop = -(top - world.sizes.canvasHeight / 2 + height / 2);

  return { width, height, elementLeft, elementTop };
}

export default world;
