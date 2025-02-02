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
    meshPosition: THREE.Vector3;
    meshScale: THREE.Vector3;
    strength: number;
  };
  $: {
    ul: HTMLUListElement | undefined;
    li: NodeListOf<HTMLLIElement> | undefined;
  };
  scene: THREE.Scene;
  mesh: THREE.Mesh | undefined;
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
  state: {
    isMouseOver: Boolean;
  };
  uniforms: {
    uAlpha: { value: number };
    uOffset: { value: THREE.Vector2 };
    uTexture: { value: THREE.Texture | undefined };
  };
  init: (
    canvas: HTMLCanvasElement,
    ul: HTMLUListElement,
    li: NodeListOf<HTMLLIElement>,
  ) => void;
}
