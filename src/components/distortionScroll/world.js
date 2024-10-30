// reference -> https://www.youtube.com/watch?v=DdQn82X1G3I

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
    canvasWidth: null,
    canvasHeight: null,
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

  tex: null,
  images: [],
  materials: [],
  meshes: [],
  elems: [],
  clock: new THREE.Clock(),
  time: 0,
  target: 0,
  current: 0,
  ease: 0.075,
  init,
};

function init() {
  console.log("init");

  const canvasRect = $.canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  world.sizes.canvasWidth = width;
  world.sizes.canvasHeight = height;

  world.textureLoader.manager = world.loadManager;
  world.loadManager.onError = (url) => console.log("error");
  world.loadManager.onStart = () => {};
  world.loadManager.onProgress = (itemURL, itemLoaded, itemTotal) => {
    console.log("PROGRESS", itemURL, itemLoaded, itemTotal);
  };
  world.loadManager.onLoad = () => {
    console.log("loaded");

    _createCamera(canvasRect);
    _createRenderer($.canvas, canvasRect);
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
    const imgRect = img.getBoundingClientRect();
    const { width, height, elementLeft, elementTop } = _getWorldPosition(img);
    const uniforms = {
      uTime: {
        value: world.time,
      },
      uOffset: {
        value: new THREE.Vector2(0, 0),
      },
      uAlpha: {
        value: 1.0,
      },
      uTex: {
        value: world.images[i].tex,
      },
    };

    const geometry = new THREE.PlaneGeometry(1, 1, 30, 30);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(elementLeft, elementTop, 0);
    mesh.scale.set(width, height, 0);

    const elem = {
      $: {
        img,
      },
      imgRect,
      geometry,
      material,
      mesh,
    };
    world.elems.push(elem);

    world.meshes.push(mesh);
    world.materials.push(material);

    world.scene.add(mesh);

    i++;
  });
}

function _createCamera(canvasRect) {
  const { width, height } = canvasRect;

  world.aspectRatio = width / height;
  world.fov = (2 * Math.atan(height / 2 / world.perspective) * 180) / Math.PI;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.perspective,
  );
  world.camera.position.set(0, 0, world.perspective);

  world.scene.add(world.camera);
}

function _createRenderer(canvas, canvasRect) {
  const { width, height } = canvasRect;

  world.renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  world.renderer.setSize(width, height, false);
}

function _tick() {
  requestAnimationFrame(_tick);

  // world.time = world.clock.getElapsedTime();
  // world.materials.forEach((material) => {
  //   material.uniforms.uTime.value = world.time;
  // });

  world.elems.forEach((elem) => _scrollElem(elem));

  world.renderer.render(world.scene, world.camera);
}

function _scrollElem(elem) {
  const {
    material,
    mesh,
    $: { img },
  } = elem;

  const { elementLeft, elementTop } = _getWorldPosition(img);
  mesh.position.y = elementTop;

  world.target = scrollY;
  world.current = _lerp(world.current, world.target, world.ease);
  material.uniforms.uOffset.value.set(
    elementLeft,
    -(world.target - world.current) * 0.003,
  );
}

function _getWorldPosition(elem) {
  const { width, height, left, top } = elem.getBoundingClientRect();

  const elementLeft = left - world.sizes.canvasWidth / 2 + width / 2;
  const elementTop = -(top - world.sizes.canvasHeight / 2 + height / 2);

  return { width, height, elementLeft, elementTop };
}

function _lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

export default world;
