import * as THREE from "three";

export interface Asset {
  imageTexture: THREE.Texture | undefined;
  noiseTexture: THREE.Texture | undefined;
  src: string | undefined;
  width: number | undefined;
  height: number | undefined;
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
  assets: Asset[];
  noiseAssets: [string, string];
  scene: THREE.Scene;
  textureLoader: THREE.TextureLoader;
  init: ({
    canvas,
    images,
  }: {
    canvas: HTMLCanvasElement;
    images: NodeListOf<Element>;
  }) => void;
}
