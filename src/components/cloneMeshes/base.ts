import * as THREE from "three";

import vertexShader from "./shader/vertexShader.glsl";
import fragmentShader from "./shader/fragmentShader.glsl";

import { getViewportInfo, getCameraFov } from "./utils";
import type { Base } from "./type";

const base: Base = {
  init,
  scene: new THREE.Scene(),
  renderer: null,
  camera: null,
  geometry: null,
  material: null,
  mesh: null,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
  cameraInfo: {
    fov: null,
    aspectRatio: null,
    near: 0.1,
    far: 1000,
  },
};

function init($canvas: HTMLCanvasElement) {
  console.log("base init");

  const { width, height, aspectRatio } = getViewportInfo($canvas);

  const fov = getCameraFov(height, base.cameraInfo.far);
  base.camera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    base.cameraInfo.near,
    base.cameraInfo.far,
  );
  base.camera.position.z = base.cameraInfo.far;

  base.renderer = new THREE.WebGLRenderer({
    canvas: $canvas,
    antialias: true,
    alpha: true,
  });
  base.renderer.setSize(width, height, false);
  base.renderer.setPixelRatio(base.pixelRatio);

  base.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  base.material = new THREE.ShaderMaterial({
    // wireframe: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: null },
    },
  });
}

export default base;
