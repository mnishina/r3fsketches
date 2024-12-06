import * as THREE from "three";

export interface Page {
  numbers: {
    canvasWidth: number | undefined;
    canvasHeight: number | undefined;
    aspectRatio: number | undefined;
    pixelRatio: number | undefined;
    camera: {
      fov: number | undefined;
      near: number;
      far: number;
    };
  };
  $: {
    ul: HTMLUListElement | undefined;
    li: NodeListOf<HTMLLIElement> | undefined;
  };
  scene: THREE.Scene;
  textureLoader: THREE.TextureLoader;
  items: {
    $item: Element | undefined;
    $img: HTMLImageElement | null;
    texture: THREE.Texture | undefined;
    index: number | undefined;
  }[];
  currentItem:
    | {
        $item: Element | undefined;
        $img: HTMLImageElement | null;
        texture: THREE.Texture | undefined;
        index: number | undefined;
      }
    | undefined;
  textures: THREE.Texture[];
  texturePosition: THREE.Vector3;
  textureScale: THREE.Vector3;
  uniforms: {
    uAlpha: { value: number };
    uOffset: { value: THREE.Vector2 };
    uTexture: { value: THREE.Texture | null };
  };
  init: (
    canvas: HTMLCanvasElement,
    ul: HTMLUListElement,
    li: NodeListOf<HTMLLIElement>,
  ) => void;
}
