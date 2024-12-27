import * as THREE from "three";

interface LoadedMedias {
  $image: Element;
  texture: THREE.Texture;
}

interface ObjectStore {
  $image: Element;
  $imageWidth: number;
  $imageHeight: number;
  $imageX: number;
  $imageY: number;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
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
    $canvas: HTMLCanvasElement,
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene,
  ) => void;
  objectStore: (ObjectStore | undefined)[];
}

interface Loader {
  loadImage: ($images: NodeListOf<Element>) => Promise<unknown>;
  loadManager: THREE.LoadingManager;
  textureLoader: THREE.TextureLoader;
  loadedMedias: (LoadedMedias | undefined)[];
}

export type { Base, View, Loader, LoadedMedias, ObjectStore };
