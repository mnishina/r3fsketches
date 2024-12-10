import * as THREE from "three";

import type { Page } from "./types";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

const page: Page = {
  numbers: {
    canvasWidth: undefined,
    canvasHeight: undefined,
    devicePixelRatio: Math.min(window.devicePixelRatio, 2),
    camera: {
      fov: 75,
      aspectRatio: undefined,
      near: 0.1,
      far: 1000,
    },
  },
  uniforms: {
    uTexture: { value: new THREE.Texture() },
  },
  imageInfo: {
    imageTexture: undefined,
    noiseTexture: undefined,
    src: undefined,
    width: undefined,
    height: undefined,
  },
  imageInformations: [],
  noiseAssets: ["/noise.png", "/perlin.png"],
  scene: new THREE.Scene(),
  init,
};

async function init(canvas: HTMLCanvasElement) {
  console.log("page init");

  const { width, height, aspectRatio } = _getViewportInfo(canvas);

  page.numbers.canvasWidth = width;
  page.numbers.canvasHeight = height;
  page.numbers.camera.aspectRatio = aspectRatio;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(page.numbers.canvasWidth, page.numbers.canvasHeight, false);
  renderer.setPixelRatio(page.numbers.devicePixelRatio);

  // camera
  const camera = new THREE.PerspectiveCamera(
    page.numbers.camera.fov,
    page.numbers.camera.aspectRatio,
    page.numbers.camera.near,
    page.numbers.camera.far,
  );
  camera.position.set(0, 0, 5);

  await _loadImage();

  _createMesh();

  _tick(renderer, camera);

  window.addEventListener("resize", () => {
    _onResize(canvas, renderer, camera);
  });
}

function _createMesh() {
  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  const material = new THREE.ShaderMaterial({
    // wireframe: true,
    vertexShader,
    fragmentShader,
    uniforms: page.uniforms,
  });

  const tempNum: number = 1000;

  page.imageInformations.forEach((info) => {
    if (info.width !== undefined && info.height !== undefined) {
      const { imageTexture, width, height } = info;

      material.uniforms.uTexture.value = imageTexture;

      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(width / tempNum, height / tempNum, 0);
      page.scene.add(mesh);
    } else {
      console.warn("undefined image width and height");
    }
  });
}

function _tick(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  requestAnimationFrame(() => {
    _tick(renderer, camera);
  });

  renderer.render(page.scene, camera);
}

async function _loadImage() {
  const $image = document.querySelectorAll("[data-webgl-image]");

  const textureLoader = new THREE.TextureLoader();
  const loadTexture = [...$image].map((image: Element, i: number) => {
    const { src, naturalWidth, naturalHeight } = image as HTMLImageElement;

    return new Promise((resolve, reject) => {
      textureLoader.load(
        src,
        (image) => {
          page.imageInfo.imageTexture = image;
          page.imageInfo.src = src;
          page.imageInfo.width = naturalWidth;
          page.imageInfo.height = naturalHeight;

          page.imageInformations.push(page.imageInfo);

          resolve(image);
        },
        undefined,
        (err) => {
          console.error(`Load failed: ${src}`);
          reject(err);
        },
      );
    });
  });

  try {
    return await Promise.all(loadTexture);
  } catch (error) {
    console.error("Error loading images", error);
    throw error;
  }
}

function _onResize(
  canvas: HTMLCanvasElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
) {
  let timeoutID: number | undefined = undefined;

  timeoutID = setTimeout(() => {
    if (timeoutID) clearTimeout(timeoutID);

    const { width, height, aspectRatio } = _getViewportInfo(canvas);

    renderer.setSize(width, height, false);

    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    page.numbers.canvasWidth = width;
    page.numbers.canvasHeight = height;
    page.numbers.camera.aspectRatio = aspectRatio;
  }, 500);
}

function _getViewportInfo(canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  const aspectRatio = width / height;

  return { width, height, aspectRatio };
}

export default page;
