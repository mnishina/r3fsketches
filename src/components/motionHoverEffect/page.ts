import * as THREE from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface Page {
  numbers: {
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
    aspectRatio: number | undefined;
    pixelRatio: number | undefined;
    camera: {
      fov: number | undefined;
      near: number;
      far: number;
    };
  };
  scene: THREE.Scene;
  init: (canvas: HTMLCanvasElement) => void;
}

const page: Page = {
  numbers: {
    canvasWidth: undefined,
    canvasHeight: undefined,
    aspectRatio: undefined,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    camera: {
      fov: 75,
      near: 0.1,
      far: 1000,
    },
  },
  scene: new THREE.Scene(),
  init,
};

function init(canvas: HTMLCanvasElement) {
  console.log("page init");

  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  page.numbers.canvasWidth = width;
  page.numbers.canvasHeight = height;
  page.numbers.aspectRatio = width / height;

  const camera = new THREE.PerspectiveCamera(
    page.numbers.camera.fov,
    page.numbers.aspectRatio,
    page.numbers.camera.near,
    page.numbers.camera.far,
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(page.numbers.canvasWidth, page.numbers.canvasHeight);

  _createMesh();

  _tick(renderer, camera);
}

function _createMesh() {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 32, 32),
    new THREE.ShaderMaterial({
      wireframe: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uAlpha: { value: 0 },
      },
    }),
  );
  page.scene.add(mesh);
}

function _tick(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  requestAnimationFrame(() => {
    _tick(renderer, camera);
  });

  renderer.render(page.scene, camera);
}

export default page;
