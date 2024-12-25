import * as THREE from "three";

interface Base {
  init: ($canvas: HTMLCanvasElement) => void;
  scene: THREE.Scene;
  renderer: null | THREE.WebGLRenderer;
  camera: null | THREE.PerspectiveCamera;
  geometry: null | THREE.PlaneGeometry;
  material: null | THREE.ShaderMaterial;
  mesh: null | THREE.Mesh;
  pixelRatio: number;
  cameraInfo: {
    fov: null | number;
    aspectRatio: null | number;
    near: number;
    far: number;
  };
}

interface View {
  init: ($canvas: HTMLCanvasElement) => void;
  createMesh: (loadedTextures: (THREE.Texture | undefined)[]) => void;
  render: (
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
  ) => void;
}

interface Loader {
  loadImage: ($image: NodeListOf<Element>) => Promise<unknown>;
  loadManager: THREE.LoadingManager;
  textureLoader: THREE.TextureLoader;
  loadedTextures: (THREE.Texture | undefined)[];
}

export type { Base, View, Loader };
