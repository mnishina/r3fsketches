console.log("world");
import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const $ = {
  canvas: document.querySelector("#canvas"),
};

const world = {
  sizes: {
    width: innerWidth,
    height: innerHeight,
  },
  scene: new THREE.Scene(),
  renderer: null,
  camera: null,
  geometry: null,
  material: null,
  mesh: null,
  clock: new THREE.Clock(),
  time: 0,
  init,
};

function init() {
  console.log("init");

  world.geometry = new THREE.PlaneGeometry(1, 1, 30, 30);
  world.material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: {
        value: world.time,
      },
    },
  });
  world.mesh = new THREE.Mesh(world.geometry, world.material);
  world.scene.add(world.mesh);

  // camera
  world.camera = new THREE.PerspectiveCamera(
    75,
    world.sizes.width / world.sizes.height,
    0.1,
    1000,
  );
  world.camera.position.set(0, 0, 1);
  world.scene.add(world.camera);

  world.renderer = new THREE.WebGLRenderer({
    canvas: $.canvas,
    antialias: true,
  });
  world.renderer.setSize(world.sizes.width, world.sizes.height, false);

  _tick();
}

function _tick() {
  requestAnimationFrame(_tick);

  world.time = world.clock.getElapsedTime();
  world.material.uniforms.uTime.value = world.time;

  world.renderer.render(world.scene, world.camera);
}

export default world;
