console.log("world");
import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

const $ = {
  canvas: document.querySelector("#canvas"),
  img: document.querySelectorAll("[data-webgl]"),
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
  materials: [],
  mesh: null,
  meshes: [],
  near: 0.1,
  perspective: 1000,
  fov: 0,
  aspectRatio: 0,
  clock: new THREE.Clock(),
  time: 0,
  init,
};

function init() {
  console.log("init");

  _createMesh();
  _createCamera();
  _createRenderer();

  _tick();
}

function _createMesh() {
  for (let index = 0; index < 3; index++) {
    world.geometry = new THREE.PlaneGeometry(100, 100, 30, 30);
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
    world.mesh.position.set(index * 100, 0, 0);

    world.meshes.push(world.mesh);
    world.materials.push(world.material);

    console.log(world.meshes);

    world.scene.add(world.mesh);
  }
}

function _createCamera() {
  world.aspectRatio = world.sizes.width / world.sizes.height;
  world.fov =
    (2 * Math.atan(world.sizes.height / 2 / world.perspective) * 180) / Math.PI;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.perspective,
  );
  world.camera.position.set(0, 0, world.perspective);

  world.scene.add(world.camera);
}

function _createRenderer() {
  world.renderer = new THREE.WebGLRenderer({
    canvas: $.canvas,
    antialias: true,
    alpha: true,
  });
  world.renderer.setSize(world.sizes.width, world.sizes.height, false);
}

function _tick() {
  requestAnimationFrame(_tick);

  world.time = world.clock.getElapsedTime();

  world.materials.forEach((material) => {
    material.uniforms.uTime.value = world.time;
  });

  world.renderer.render(world.scene, world.camera);
}

export default world;
