import * as THREE from "three";

interface LoadedMedias {
  $image: Element;
  texture: THREE.Texture;
}

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
  createMesh: (loadedMedias: (LoadedMedias | undefined)[]) => void;
  render: (
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
  ) => void;
}

interface Loader {
  loadImage: ($images: NodeListOf<Element>) => Promise<unknown>;
  loadManager: THREE.LoadingManager;
  textureLoader: THREE.TextureLoader;
  loadedMedias: (LoadedMedias | undefined)[];
}

export type { Base, View, Loader, LoadedMedias };
