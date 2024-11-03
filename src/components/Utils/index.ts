import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

interface Utils {
  control?: OrbitControls;
  setupOrbitControl: (camera: THREE.Camera, canvas: HTMLCanvasElement) => void;
}

const Utils: Utils = {
  control: undefined,
  setupOrbitControl,
};

function setupOrbitControl(camera: THREE.Camera, canvas: HTMLCanvasElement) {
  const control = new OrbitControls(camera, canvas);

  Utils.control = control;
}

export default Utils;
