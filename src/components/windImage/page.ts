import * as THREE from "three";

import type { Page, PageInitParams, CollectAsset } from "./types";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

const page: Page = {
  init,
  render,
  numbers: {
    canvasWidth: undefined,
    canvasHeight: undefined,
    devicePixelRatio: Math.min(window.devicePixelRatio, 2),
    geometrySegments: 32,
    camera: {
      fov: undefined,
      aspectRatio: undefined,
      near: 0.1,
      far: 1000,
    },
  },
  scene: new THREE.Scene(),
  camera: null,
  renderer: null,
};

async function init({ canvas, allAsset }: PageInitParams): Promise<void> {
  console.log("page init");

  const { width, height, aspectRatio, fov } = _getViewportInfo(canvas);

  page.numbers.canvasWidth = width;
  page.numbers.canvasHeight = height;
  page.numbers.camera.fov = fov;
  page.numbers.camera.aspectRatio = aspectRatio;

  page.renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });
  page.renderer.setSize(
    page.numbers.canvasWidth,
    page.numbers.canvasHeight,
    false,
  );
  page.renderer.setPixelRatio(page.numbers.devicePixelRatio);

  // camera
  page.camera = new THREE.PerspectiveCamera(
    page.numbers.camera.fov,
    page.numbers.camera.aspectRatio,
    page.numbers.camera.near,
    page.numbers.camera.far,
  );
  page.camera.position.set(0, 0, page.numbers.camera.far);

  await _createMesh(allAsset);

  window.addEventListener("resize", () => {
    if (!page.renderer || !page.camera) return;

    _onResize(canvas, page.renderer, page.camera);
  });
}

async function _createMesh(allAsset: CollectAsset[]): Promise<void> {
  const promise = [...allAsset].map(async (asset) => {
    if (!asset.imageRect) return;

    const { imageRect, imageTexture, noiseTexture } = asset;

    const geometry = new THREE.PlaneGeometry(
      imageRect.width,
      imageRect.height,
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
    material.needsUpdate = true;

    material.uniforms.uImageTexture.value = imageTexture;
    material.uniforms.uNoiseTexture.value = noiseTexture;

    console.log(material);
    console.log(material.uniforms.uImageTexture.value);

    if (imageTexture) imageTexture.needsUpdate = true;
    if (noiseTexture) noiseTexture.needsUpdate = true;

    console.log(material);
    console.log(material.uniforms.uImageTexture.value);

    const mesh = new THREE.Mesh(geometry, material);

    mesh.userData.asset = asset;
    page.scene.add(mesh);
  });

  await Promise.all(promise);
}

function render(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
): void {
  requestAnimationFrame(() => {
    render(renderer, camera);
  });

  renderer.render(page.scene, camera);
}

function _onResize(
  canvas: HTMLCanvasElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
): void {
  let timeoutID: number | undefined = undefined;

  timeoutID = setTimeout(() => {
    if (timeoutID) clearTimeout(timeoutID);

    const { width, height, aspectRatio, fov } = _getViewportInfo(canvas);

    renderer.setSize(width, height, false);

    camera.fov = fov;
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
  fov: number;
} {
  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  const aspectRatio = width / height;

  const radian = 2 * Math.atan(height / 2 / page.numbers.camera.far);
  const fov = radian * (180 / Math.PI);

  return { width, height, aspectRatio, fov };
}

export default page;
