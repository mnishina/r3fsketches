console.log("world noiseShaderWave");

import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const debug = {
  controls: null,
};

const $ = {
  canvas: document.querySelector("#canvas"),
};

const world = {
  init,
  sizes: {
    width: innerWidth,
    height: innerHeight,
  },
  scene: new THREE.Scene(),
  camera: null,
  geometry: null,
  material: null,
  mesh: null,
  renderer: null,
  clock: new THREE.Clock(),
  time: 0,
};

function init() {
  console.log("world init");

  world.camera = new THREE.PerspectiveCamera(
    35,
    world.sizes.width / world.sizes.height,
    0.1,
    1000,
  );
  world.camera.position.z = 6;
  world.scene.add(world.camera);

  world.renderer = new THREE.WebGLRenderer({
    canvas: $.canvas,
  });
  world.renderer.setSize(world.sizes.width, world.sizes.height, false);

  world.geometry = new THREE.PlaneGeometry(2, 3, 30, 30);
  world.material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    wireframe: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: {
        value: world.elapsedTime,
      },
    },
  });
  world.mesh = new THREE.Mesh(world.geometry, world.material);
  world.scene.add(world.mesh);

  _debug();
  _tick();
}

function _debug() {
  debug.controls = new OrbitControls(world.camera, $.canvas);
}

function _tick() {
  requestAnimationFrame(_tick);

  world.time = world.clock.getElapsedTime();
  world.material.uniforms.uTime.value = world.time;

  debug.controls.update();

  world.renderer.render(world.scene, world.camera);
}

export default world;
