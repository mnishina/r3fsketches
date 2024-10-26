import * as THREE from "three";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";

const world = {
  init,
  sizes: {
    width: innerWidth,
    height: innerHeight,
  },
  canvas: document.querySelector("#canvas"),
  geometry: null,
  material: null,
  mesh: null,
  scene: new THREE.Scene(),
  camera: new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000),
  clock: new THREE.Clock(),
  time: 1,
};

function init() {
  console.log("init");

  world.camera.position.z = 2;

  //mesh
  world.geometry = new THREE.PlaneGeometry(1, 2, 30, 30);
  world.material = new THREE.ShaderMaterial({
    wireframe: true,
    uniforms: {
      uTime: { value: world.time },
    },
    vertexShader,
    fragmentShader,
  });
  world.mesh = new THREE.Mesh(world.geometry, world.material);
  world.scene.add(world.mesh);

  // renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: world.canvas,
  });
  renderer.setSize(world.sizes.width, world.sizes.height, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  _tick(renderer);
}

function _tick(renderer) {
  requestAnimationFrame(() => _tick(renderer));

  const elapsedTime = world.clock.getElapsedTime();
  world.material.uniforms.uTime.value = elapsedTime;

  renderer.render(world.scene, world.camera);
}

export default world;
