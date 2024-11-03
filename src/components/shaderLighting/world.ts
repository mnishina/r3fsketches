console.log("world");
import * as THREE from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface World {
  init: (canvas: HTMLCanvasElement, canvasRect: DOMRect) => void;
  sizes: {
    width: number;
    height: number;
    canvasWidth: number;
    canvasHeight: number;
  };
  canvasRect?: DOMRect;
  renderer?: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  fov: number;
  aspectRatio: number;
  near: number;
  far: number;
  meshes: THREE.Mesh[];
}

const world: World = {
  init,
  sizes: {
    width: innerWidth,
    height: innerHeight,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  canvasRect: undefined,
  renderer: undefined,
  scene: new THREE.Scene(),
  camera: undefined,
  fov: 10,
  aspectRatio: 0,
  near: 0.1,
  far: 1000,
  meshes: [],
};

function init(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  console.log("world init", canvasRect);

  _defineCanvasRect(canvasRect);

  _createRenderer(canvas, canvasRect);
  _createCamera(canvasRect);
  _createMesh();
  _tick();
}

function _createMesh() {
  const material = new THREE.ShaderMaterial({
    // wireframe: true,
    uniforms: {
      uColor: { value: new THREE.Vector3(1, 1, 1) },
    },
    vertexShader,
    fragmentShader,
  });

  const geometries = [
    {
      geometry: new THREE.TorusKnotGeometry(1, 0.3, 128, 16),
    },
    {
      geometry: new THREE.SphereGeometry(),
    },
  ];

  let i = 0;
  geometries.forEach((geometry: { geometry: THREE.BufferGeometry }) => {
    const mesh = new THREE.Mesh(geometry.geometry, material);
    // mesh.position.set(100 * i - 100, -100 * i + 100, 0);
    // mesh.scale.setScalar(75);

    world.scene.add(mesh);
    world.meshes.push(mesh);

    i++;
  });

  _addHelper();
}

function _createCamera(canvasRect: DOMRect) {
  const { width, height } = canvasRect;

  // const radian = 2 * Math.atan(height / 2 / world.far);
  // world.fov = radian * (180 / Math.PI);

  world.aspectRatio = width / height;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
  );
  world.camera.position.set(35, 15, 15);
  world.camera.lookAt(new THREE.Vector3(0));

  world.scene.add(world.camera);
}

function _createRenderer(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  world.renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  world.renderer.setSize(world.sizes.canvasWidth, world.sizes.canvasHeight);
  world.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function _tick() {
  requestAnimationFrame(_tick);

  world.meshes.forEach((mesh) => {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
  });

  world.renderer && world.renderer.render(world.scene, world.camera!);
}

function _defineCanvasRect(canvasRect: DOMRect) {
  const { width, height } = canvasRect;
  world.sizes.canvasWidth = width;
  world.sizes.canvasHeight = height;

  world.canvasRect = canvasRect;

  return { width, height };
}

function _addHelper() {
  // Directional light helper
  const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial(),
  );
  directionalLightHelper.material.color.setRGB(0.1, 0.1, 1);
  directionalLightHelper.material.side = THREE.DoubleSide;
  directionalLightHelper.position.set(0, 0, 3);
  world.scene.add(directionalLightHelper);

  // point light helper
  const pointLightHelper = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial(),
  );
  pointLightHelper.material.color.setRGB(1, 0.1, 0.1);
  pointLightHelper.position.set(0, 2.5, 0);
  world.scene.add(pointLightHelper);

  // point light helper
  const pointLightHelper2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.1, 2),
    new THREE.MeshBasicMaterial(),
  );
  pointLightHelper2.material.color.setRGB(0.1, 1.0, 0.5);
  pointLightHelper2.position.set(2, 2, 2);
  world.scene.add(pointLightHelper2);
}

export default world;
