import * as THREE from "three";

import type { Page } from "./types";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

const page: Page = {
  numbers: {
    canvasWidth: undefined,
    canvasHeight: undefined,
    devicePixelRatio: Math.min(window.devicePixelRatio, 2),
    geometrySegments: 32,
    camera: {
      fov: 75,
      aspectRatio: undefined,
      near: 0.1,
      far: 1000,
    },
  },
  assets: [],
  noiseAssets: ["/noise.png", "/perlin.png"],
  scene: new THREE.Scene(),
  textureLoader: new THREE.TextureLoader(),
  init,
};

async function init({
  canvas,
  images,
}: {
  canvas: HTMLCanvasElement;
  images: NodeListOf<Element>;
}) {
  console.log("page init");

  const { width, height, aspectRatio } = _getViewportInfo(canvas);

  page.numbers.canvasWidth = width;
  page.numbers.canvasHeight = height;
  page.numbers.camera.aspectRatio = aspectRatio;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
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

  _getAssetsInfo(images);

  try {
    await _loadImage(images);
    _loadNoiseImage(page.noiseAssets);

    _createMesh();

    console.log(page.assets);

    _tick({ renderer, camera });
  } catch (error) {
    console.error("Failed to initialize:", error);
  }

  window.addEventListener("resize", () => {
    _onResize({ canvas, renderer, camera });
  });
}

function _createMesh() {
  const tempNum: number = 1000;

  page.assets.forEach((asset) => {
    if (asset.width !== undefined && asset.height !== undefined) {
      const { imageTexture, width, height } = asset;

      const geometry = new THREE.PlaneGeometry(
        width / tempNum,
        height / tempNum,
        page.numbers.geometrySegments,
        page.numbers.geometrySegments,
      );

      const material = new THREE.ShaderMaterial({
        // wireframe: true,
        vertexShader,
        fragmentShader,
        uniforms: {
          uTexture: { value: imageTexture },
        },
      });

      const mesh = new THREE.Mesh(geometry, material);
      page.scene.add(mesh);
    } else {
      console.warn("undefined image width and height");
    }
  });
}

function _tick({
  renderer,
  camera,
}: {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
}) {
  requestAnimationFrame(() => {
    _tick({ renderer, camera });
  });

  renderer.render(page.scene, camera);
}

function _getAssetsInfo(images: NodeListOf<Element>) {
  console.log("_getAssetsInfo");

  [...images].map((image: Element) => {
    const { src, naturalWidth, naturalHeight } = image as HTMLImageElement;

    page.assets.push({
      src: src,
      width: naturalWidth,
      height: naturalHeight,
      imageTexture: undefined,
      noiseTexture: undefined,
    });
  });
}

async function _loadImage(images: NodeListOf<Element>) {
  console.log("_loadImage");

  const imageTexture = [...images].map((image: Element, i: number) => {
    const { src } = image as HTMLImageElement;

    return new Promise((resolve, reject) => {
      page.textureLoader.load(
        src,
        (image) => {
          page.assets[i].imageTexture = image;
          console.log("imageTexture loaded.");

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
    return await Promise.all(imageTexture);
  } catch (error) {
    console.error("Error loading images", error);
    throw error;
  }
}

function _loadNoiseImage(noiseAssets: string[]) {
  console.log("_loadNoiseImage");

  // const noiseTexture = assets.map((asset) => {
  //   return new Promise((resolve, reject) => {
  //     page.textureLoader.load()
  //   });
  // });
}

function _onResize({
  canvas,
  renderer,
  camera,
}: {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
}) {
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
