import * as THREE from "three";

import type { Page, Asset } from "./types";

import loader from "./loader";

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
    alpha: true,
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

  // await _getAssetsInfo(images);

  // console.log(page.assets);

  _createMesh(images);

  _tick({ renderer, camera });

  window.addEventListener("resize", () => {
    _onResize({ canvas, renderer, camera });
  });
}

async function _createMesh(images: NodeListOf<Element>) {
  const tempNum: number = 200;

  const promise = [...images].map(async (image) => {
    const imageRect = image.getBoundingClientRect();

    const src = image.getAttribute("src");
    const matchedAsset = loader.allAssets?.find(
      (asset) => asset.imageAsset === src,
    );
    const { imageTexture, noiseTexture } = matchedAsset;

    const geometry = new THREE.PlaneGeometry(
      imageRect.width / tempNum,
      imageRect.height / tempNum,
      page.numbers.geometrySegments,
      page.numbers.geometrySegments,
    );

    const material = new THREE.ShaderMaterial({
      // wireframe: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uImageTexture: { value: imageTexture },
        uNoiseTexture: { value: noiseTexture },
      },
    });

    const mesh = new THREE.Mesh(geometry, material);
    page.scene.add(mesh);
  });

  await Promise.all(promise);

  // assets.forEach((asset) => {
  //   if (asset.width !== undefined && asset.height !== undefined) {
  //     const { imageTexture, noiseTexture, width, height } = asset;

  //     const geometry = new THREE.PlaneGeometry(
  //       width / tempNum,
  //       height / tempNum,
  //       page.numbers.geometrySegments,
  //       page.numbers.geometrySegments,
  //     );

  //     const material = new THREE.ShaderMaterial({
  //       // wireframe: true,
  //       vertexShader,
  //       fragmentShader,
  //       uniforms: {
  //         uImageTexture: { value: imageTexture },
  //         uNoiseTexture: { value: noiseTexture },
  //       },
  //     });

  //     const mesh = new THREE.Mesh(geometry, material);
  //     page.scene.add(mesh);
  //   } else {
  //     console.warn("undefined image width and height");
  //   }
  // });
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

async function _getAssetsInfo(images: NodeListOf<Element>): Promise<void> {
  console.log("_getAssetsInfo");

  try {
    const assetsInfo = await Promise.all(
      [...images].map(async (image) => {
        const { src, naturalWidth, naturalHeight } = image as HTMLImageElement;
        const { width, height } = image.getBoundingClientRect();
        const imageTexture = await _setImageTexture(image);
        imageTexture.magFilter = THREE.LinearFilter;
        imageTexture.minFilter = THREE.LinearFilter;
        imageTexture.needsUpdate = false;

        const noiseTexture = await _setNoiseTexture(page.noiseAssets);
        noiseTexture.magFilter = THREE.LinearFilter;
        noiseTexture.minFilter = THREE.LinearFilter;
        noiseTexture.needsUpdate = false;

        return {
          src,
          width,
          height,
          imageTexture,
          noiseTexture,
        };
      }),
    );

    page.assets.push(...assetsInfo);
  } catch (error) {
    console.error("画像の読み込みに失敗しました:", error);
  }
}

async function _setImageTexture(image: Element): Promise<THREE.Texture> {
  console.log("_setImageTexture");
  const { src } = image as HTMLImageElement;

  try {
    return page.textureLoader.loadAsync(src);
  } catch (error) {
    console.error(`_setImageTexture: Load failed: ${src}`, error);
    throw error;
  }
}

async function _setNoiseTexture(noiseAssets: string[]) {
  console.log("_setNoiseTexture");
  const randomNum = Math.floor(Math.random() * noiseAssets.length);

  try {
    return page.textureLoader.loadAsync(noiseAssets[randomNum]);
  } catch (error) {
    console.error(
      `_setNoiseTexture: Load failed: ${noiseAssets[randomNum]}`,
      error,
    );
    throw error;
  }
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
