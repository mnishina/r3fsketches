console.log("world");
import * as THREE from "three";

const $ = {
  canvas: document.querySelector("#canvas") as HTMLCanvasElement,
};

const world = {
  sizes: {
    width: innerWidth,
    height: innerHeight,
    canvasWidth: 0,
    canvasHeight: 0,
  },
  canvasRect: undefined as DOMRect | undefined,
  loadManager: new THREE.LoadingManager(),
  textureLoader: new THREE.TextureLoader(),
  scene: new THREE.Scene(),
  renderer: undefined as THREE.WebGLRenderer | undefined,
  camera: undefined as THREE.PerspectiveCamera | undefined,
  mesh: undefined as THREE.Mesh | undefined,
  wireMesh: undefined as THREE.Mesh | undefined,
  fov: 0,
  aspectRatio: 0,
  near: 0.1,
  far: 1000,
  init,
};

function init() {
  console.log("world init");

  world.canvasRect = $.canvas.getBoundingClientRect();

  const light = new THREE.HemisphereLight(0xcc1100, 0x0011cc, 50);
  world.scene.add(light);

  _createMesh();
  _createCamera(world.canvasRect);
  _createRenderer(world.canvasRect);
  _tick();
}

function _createMesh() {
  const geometry = new THREE.IcosahedronGeometry(100, 4);
  const material = new THREE.MeshStandardMaterial({
    color: 0x222222,
    // wireframe: true,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  world.mesh = mesh;

  const wireGeometry = new THREE.IcosahedronGeometry(100, 4);
  const wireMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    wireframe: true,
  });
  const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
  world.wireMesh = wireMesh;

  wireMesh.scale.setScalar(1.007);

  world.scene.add(mesh);
  world.scene.add(wireMesh);
}

function _createCamera(canvasRect: DOMRect) {
  const { width, height } = canvasRect;

  world.fov = (2 * Math.atan(height / 2 / world.far) * 180) / Math.PI;
  world.aspectRatio = width / height;

  world.camera = new THREE.PerspectiveCamera(
    world.fov,
    world.aspectRatio,
    world.near,
    world.far,
  );
  world.camera.position.set(0, 0, 300);

  world.scene.add(world.camera);
}

function _createRenderer(canvasRect: DOMRect) {
  const { width, height } = canvasRect;

  world.renderer = new THREE.WebGLRenderer({
    canvas: $.canvas,
    antialias: true,
  });
  world.renderer.setSize(width, height, false);
}

function _tick() {
  requestAnimationFrame(_tick);

  world.mesh!.rotation.x += 0.005;
  world.mesh!.rotation.z += 0.005;
  world.wireMesh!.rotation.x -= 0.005;
  world.wireMesh!.rotation.z -= 0.005;

  world.renderer!.render(world.scene, world.camera!);
}

export default world;
