import * as THREE from "three";

interface assetsInfo {
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
    camera: {
      fov: number;
      aspectRatio: number | undefined;
      near: number;
      far: number;
    };
  };
  uniforms: {
    uTexture: { value: THREE.Texture };
  };
  assetsInfo: assetsInfo;
  assets: assetsInfo[];
  noiseAssets: [string, string];
  scene: THREE.Scene;
  textureLoader: THREE.TextureLoader;
  init: (canvas: HTMLCanvasElement, $image: NodeListOf<Element>) => void;
}
