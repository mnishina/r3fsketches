import * as THREE from "three";

export interface Asset {
  imageAssets: NodeListOf<Element>;
  noiseAssets: string[];
}

export interface CollectAsset {
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

export interface Page {
  numbers: {
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
    devicePixelRatio: number;
    geometrySegments: number;
    camera: {
      fov: number;
      aspectRatio: number | undefined;
      near: number;
      far: number;
    };
  };
  scene: THREE.Scene;
  init: (params: PageInitParams) => Promise<void>;
}
