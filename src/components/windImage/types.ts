import * as THREE from "three";

export interface Asset {
  imageAssets: NodeListOf<Element>;
  noiseAssets: string[];
}

export interface CollectAsset {
  imageElement: Element;
  imageRect: DOMRect | null;
  imageAsset: string | null;
  noiseAsset: string | null;
  imageTexture: THREE.Texture | null;
  noiseTexture: THREE.Texture | null;
}

export interface Loader {
  allAsset: CollectAsset[] | null;
  init: () => Asset;
  collectAllAsset: (asset: Asset) => Promise<void>;
  getAllAsset: () => CollectAsset[] | null;
}

export interface PageInitParams {
  canvas: HTMLCanvasElement;
  allAsset: CollectAsset[];
}

export interface o {
  imageRect: DOMRect;
  geometry: THREE.PlaneGeometry;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  $: {
    imageElement: Element;
  };
}

export interface Page {
  init: (params: PageInitParams) => Promise<void>;
  render: (
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera,
  ) => void;
  canvas: HTMLCanvasElement | undefined;
  numbers: {
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
    devicePixelRatio: number;
    geometrySegments: number;
    camera: {
      fov: number | undefined;
      aspectRatio: number | undefined;
      near: number;
      far: number;
    };
  };
  scene: THREE.Scene;
  clock: THREE.Clock;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  os: o[];
}
