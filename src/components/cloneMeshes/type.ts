import * as THREE from "three";

interface Base {
  init: (canvas: HTMLCanvasElement, canvasRect: DOMRect) => void;
  scene: THREE.Scene;
  renderer: null | THREE.WebGLRenderer;
  camera: null | THREE.PerspectiveCamera;
  geometry: null | THREE.PlaneGeometry;
  material: null | THREE.ShaderMaterial;
  mesh: null | THREE.Mesh;
}

export type { Base };
