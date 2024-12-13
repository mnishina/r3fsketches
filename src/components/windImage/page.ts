import * as THREE from "three";

import type { Page, PageInitParams, CollectAsset } from "./types";

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
  scene: new THREE.Scene(),
  init,
};

function init({ canvas, allAsset }: PageInitParams): void {
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

  _createMesh(allAsset);

  _tick({ renderer, camera });

  window.addEventListener("resize", () => {
    _onResize({ canvas, renderer, camera });
  });
}

async function _createMesh(allAsset: CollectAsset[]): Promise<void> {
  const tempNum: number = 200;

  const promise = [...allAsset].map(async (asset) => {
    if (!asset.imageRect) return;

    const { imageRect, imageTexture, noiseTexture } = asset;

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
}

function _tick({
  renderer,
  camera,
}: {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
}): void {
  requestAnimationFrame(() => {
    _tick({ renderer, camera });
  });

  renderer.render(page.scene, camera);
}

function _onResize({
  canvas,
  renderer,
  camera,
}: {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
}): void {
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

function _getViewportInfo(canvas: HTMLCanvasElement): {
  width: number;
  height: number;
  aspectRatio: number;
} {
  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  const aspectRatio = width / height;

  return { width, height, aspectRatio };
}

export default page;
