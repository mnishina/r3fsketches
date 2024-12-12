import * as THREE from "three";

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
  init: ({
    canvas,
    imageAssets,
  }: {
    canvas: HTMLCanvasElement;
    imageAssets: NodeListOf<Element>;
  }) => void;
}
