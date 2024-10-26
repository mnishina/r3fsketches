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
  textureLoader: new THREE.TextureLoader(),
  texture: {
    tex: null,
    imageURL: "/noise.png",
  },
  renderer: null,
  clock: new THREE.Clock(),
  time: 0,
};

function init() {
  console.log("world init");

  world.camera.position.y = 3;
  world.camera.position.z = 5;
  world.scene.add(world.camera);

  //texture
  world.texture.tex = world.textureLoader.load(
    world.texture.imageURL,
    (tex) => {
      console.log("onLoad");

      _createMesh(tex);
      _createRenderer();
      _tick(world.renderer);
    },
    () => console.log("onProgress"),
    () => console.log("onError"),
  );

  world.texture.tex.wrapS = THREE.RepeatWrapping;
  world.texture.tex.wrapT = THREE.RepeatWrapping;
}

function _createMesh(tex) {
  // console.log("_createMesh");

  //geometry
  world.geometry = new THREE.PlaneGeometry(1, 1, 16, 64);
  world.geometry.translate(0, 0.5, 0); //下辺を軸にする
  world.geometry.scale(1.5, 6, 1.5);

  //material
  world.material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
    // wireframe: true,
    uniforms: {
      uTime: { value: world.time },
      uTex: { value: tex },
    },
  });
  world.mesh = new THREE.Mesh(world.geometry, world.material);
  // world.mesh.rotation.y = -Math.PI / 4;
  world.scene.add(world.mesh);
}

function _createRenderer() {
  // console.log("_createRenderer");

  world.renderer = new THREE.WebGLRenderer({
    canvas: world.canvas,
  });
  world.renderer.setSize(world.sizes.width, world.sizes.height, false);
  world.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function _tick(renderer) {
  // console.log("_tick");

  requestAnimationFrame(() => _tick(renderer));

  const elapsedTime = world.clock.getElapsedTime();
  world.material.uniforms.uTime.value = elapsedTime;

  renderer.render(world.scene, world.camera);
}

export default world;
