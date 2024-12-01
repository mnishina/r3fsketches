import * as THREE from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

interface Page {
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
  scene: THREE.Scene;
  textureArray: any;
  init: (canvas: HTMLCanvasElement, textures: NodeListOf<Element>) => void;
}

const page: Page = {
  numbers: {
    canvasWidth: undefined,
    canvasHeight: undefined,
    aspectRatio: undefined,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    camera: {
      fov: 75,
      near: 0.1,
      far: 1000,
    },
  },
  scene: new THREE.Scene(),
  textureArray: [],
  init,
};

async function init(canvas: HTMLCanvasElement, textures: NodeListOf<Element>) {
  console.log("page init");

  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  page.numbers.canvasWidth = width;
  page.numbers.canvasHeight = height;
  page.numbers.aspectRatio = width / height;

  const camera = new THREE.PerspectiveCamera(
    page.numbers.camera.fov,
    page.numbers.aspectRatio,
    page.numbers.camera.near,
    page.numbers.camera.far,
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(page.numbers.canvasWidth, page.numbers.canvasHeight, false);

  await _loadTexture(textures);

  _createMesh();

  _tick(renderer, camera);

  window.addEventListener("resize", () => {
    _onResize(canvas, renderer, camera);
  });
}

async function _loadTexture(textures: NodeListOf<Element>) {
  console.log("_loadTexture");

  const urls: string[] = [];

  Array.from(textures).forEach((texture, i) => {
    const src = texture.getAttribute("src");
    if (src) urls.push(src);
  });

  //promisesの配列を作り、urlsをmapする
  const promises = urls.map((url: string, i: number) => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(
        url,
        (texture) => {
          page.textureArray.push(texture);
          resolve(texture);
        },
        undefined,
        (err) => {
          reject(err);
        },
      );
    });
  });

  // console.log(promises);

  //このファンクションのreturnでpromisesの配列をPromise.allする
  return Promise.all(promises);
}

function _createMesh() {
  console.log("_createMesh");

  page.textureArray.forEach((tex: THREE.TextureLoader) => {
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    const material = new THREE.ShaderMaterial({
      // wireframe: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTex: { value: tex },
        uAlpha: { value: 0 },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    page.scene.add(mesh);
  });
}

function _tick(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  requestAnimationFrame(() => {
    _tick(renderer, camera);
  });

  renderer.render(page.scene, camera);
}

function _onResize(
  canvas: HTMLCanvasElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
) {
  let timeoutID: number | undefined = undefined;

  timeoutID = setTimeout(() => {
    if (timeoutID) clearTimeout(timeoutID);

    const { width, height } = _getViewPortSize(canvas);
    page.numbers.canvasWidth = width;
    page.numbers.canvasHeight = height;
    page.numbers.aspectRatio = width / height;

    renderer.setSize(
      page.numbers.canvasWidth,
      page.numbers.canvasHeight,
      false,
    );

    camera.aspect = page.numbers.aspectRatio;
    camera.updateProjectionMatrix();
  }, 500);
}

function _getViewPortSize(canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;

  return { width, height };
}

export default page;
