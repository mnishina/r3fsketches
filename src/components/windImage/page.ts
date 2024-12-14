import * as THREE from "three";

import type { Page, PageInitParams, CollectAsset, o } from "./types";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

const page: Page = {
  init,
  render,
  canvas: undefined,
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
  clock: new THREE.Clock(),
  camera: null,
  renderer: null,
  os: [],
};

async function init({ canvas, allAsset }: PageInitParams): Promise<void> {
  console.log("page init");

  page.canvas = canvas;

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

  await _createMesh(canvas, allAsset);

  window.addEventListener("resize", () => {
    if (!page.renderer || !page.camera) return;

    _onResize(canvas, page.renderer, page.camera);
  });
}

async function _createMesh(
  canvas: HTMLCanvasElement,
  allAsset: CollectAsset[],
): Promise<void> {
  const promise = [...allAsset].map(async (asset) => {
    if (!asset.imageRect) return;

    const { imageRect, imageTexture, noiseTexture } = asset;
    console.log(asset);

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
    // material.needsUpdate = true;

    // material.uniforms.uImageTexture.value = imageTexture;
    // material.uniforms.uNoiseTexture.value = noiseTexture;

    // console.log(material);
    // console.log(material.uniforms.uImageTexture.value);

    // if (imageTexture) imageTexture.needsUpdate = true;
    // if (noiseTexture) noiseTexture.needsUpdate = true;

    // console.log(material);
    // console.log(material.uniforms.uImageTexture.value);

    const mesh = new THREE.Mesh(geometry, material);

    const { x, y } = _getDomPosition(canvas, imageRect);
    mesh.position.set(x, y, 0);

    const o: o = {
      imageRect,
      geometry,
      material,
      mesh,
      $: {
        imageElement: asset.imageElement,
      },
    };
    page.os.push(o);

    mesh.userData.asset = asset;
    page.scene.add(mesh);

    return o;
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

  page.os.forEach((o) => _scrollElements(o));

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

    page.os.forEach((o) => _resizeElements(o, canvas));
  }, 500);
}

function _resizeElements(o: o, canvas: HTMLCanvasElement) {
  const {
    imageRect,
    geometry,
    mesh,
    $: { imageElement },
  } = o;

  const newImageRect = imageElement.getBoundingClientRect();
  const { x, y } = _getDomPosition(canvas, newImageRect);
  mesh.position.set(x, y, 0);

  geometry.scale(
    newImageRect.width / imageRect.width,
    newImageRect.height / imageRect.height,
    1,
  );

  o.imageRect = newImageRect;
}

function _scrollElements(o: o) {
  const {
    mesh,
    $: { imageElement },
  } = o;

  const newImageRect = imageElement.getBoundingClientRect();
  const { y } = _getDomPosition(page.canvas!, newImageRect);

  mesh.position.y = y;
}

function _getViewportInfo(canvas: HTMLCanvasElement): {
  canvasRect: DOMRect;
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

  return { canvasRect, width, height, aspectRatio, fov };
}

function _getDomPosition(canvas: HTMLCanvasElement, rect: DOMRect) {
  const canvasRect = canvas.getBoundingClientRect();
  const x = rect.left + rect.width / 2 - canvasRect.width / 2;
  const y = -rect.top - rect.height / 2 + canvasRect.height / 2;

  return { x, y };
}

export default page;
