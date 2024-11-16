console.log("world particlesFireworks");
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  Mesh,
  ShaderMaterial,
} from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface World {
  scene: Scene;
  init: (canvas: HTMLCanvasElement) => void;
}

const world: World = {
  scene: new Scene(),
  init,
};

function init(canvas: HTMLCanvasElement) {
  console.log("world init particlesFireworks");

  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;

  //camera
  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 5;
  world.scene.add(camera);

  //renderer
  const renderer = new WebGLRenderer({ canvas });
  renderer.setSize(width, height, false);

  _createMesh();

  _tick(renderer, camera);
}

function _tick(renderer: WebGLRenderer, camera: PerspectiveCamera) {
  requestAnimationFrame(() => _tick(renderer, camera));

  renderer.render(world.scene, camera);
}

function _createMesh() {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new ShaderMaterial({
    wireframe: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
    },
  });
  const mesh = new Mesh(geometry, material);
  world.scene.add(mesh);
}

export default world;
