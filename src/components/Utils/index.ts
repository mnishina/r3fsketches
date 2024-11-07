import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

interface Utils {
  control?: OrbitControls;
  setupOrbitControl: (camera: THREE.Camera, canvas: HTMLCanvasElement) => void;
  gui: GUI | null;
  setupGUI: () => void;
  setupAxesHelper: () => THREE.AxesHelper;
}

const Utils: Utils = {
  control: undefined,
  setupOrbitControl,
  gui: null,
  setupGUI,
  setupAxesHelper,
};

function setupOrbitControl(camera: THREE.Camera, canvas: HTMLCanvasElement) {
  const control = new OrbitControls(camera, canvas);

  Utils.control = control;
}

function setupGUI() {
  Utils.gui = new GUI();
}

function setupAxesHelper() {
  const axesHelper = new THREE.AxesHelper();

  return axesHelper;
}

export default Utils;
