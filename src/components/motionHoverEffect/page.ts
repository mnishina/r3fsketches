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
  $: {
    ul: HTMLUListElement | undefined;
    li: NodeListOf<HTMLLIElement> | undefined;
  };
  scene: THREE.Scene;
  textureArray: any;
  init: (
    canvas: HTMLCanvasElement,
    ul: HTMLUListElement,
    li: NodeListOf<HTMLLIElement>,
    textures: NodeListOf<Element>,
  ) => void;
}

const page: Page = {
  numbers: {
    canvasWidth: undefined,
    canvasHeight: undefined,
    aspectRatio: undefined,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    camera: {
      fov: undefined,
      near: 0.1,
      far: 1000,
    },
  },
  $: {
    ul: undefined,
    li: undefined,
  },
  scene: new THREE.Scene(),
  textureArray: [],
  init,
};

async function init(
  canvas: HTMLCanvasElement,
  ul: HTMLUListElement,
  li: NodeListOf<HTMLLIElement>,
  textures: NodeListOf<Element>,
) {
  console.log("page init");

  page.$.ul = ul;
  page.$.li = li;

  const { width, height, aspectRatio } = _getViewPortSize(canvas);
  const fov = _getPixelFOV(height, page.numbers.camera.far);
  page.numbers.canvasWidth = width;
  page.numbers.canvasHeight = height;
  page.numbers.aspectRatio = aspectRatio;
  page.numbers.camera.fov = fov;

  const camera = new THREE.PerspectiveCamera(
    page.numbers.camera.fov,
    page.numbers.aspectRatio,
    page.numbers.camera.near,
    page.numbers.camera.far,
  );
  camera.position.set(0, 0, page.numbers.camera.far);

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

  page.$.ul.addEventListener("mousemove", (event) => {
    if (
      page.numbers.canvasWidth === undefined ||
      page.numbers.canvasHeight === undefined
    ) {
      const { width, height } = _getViewPortSize(canvas);

      page.numbers.canvasWidth = width;
      page.numbers.canvasHeight = height;
    }

    _onMouseMove(event, page.numbers.canvasWidth, page.numbers.canvasHeight);
  });

  page.$.ul.addEventListener("mouseleave", () => {
    _onMouseLeave();
  });

  page.$.li.forEach((item) => {
    item.addEventListener("mouseover", () => {
      _onMouseOver();
    });
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

  page.textureArray.forEach((tex: THREE.Texture) => {
    const { naturalWidth, naturalHeight } = tex.source.data;

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
    mesh.scale.set(naturalWidth, naturalHeight, 0);
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

    const { width, height, aspectRatio } = _getViewPortSize(canvas);
    const fov = _getPixelFOV(height, page.numbers.camera.far);
    renderer.setSize(width, height, false);

    camera.aspect = aspectRatio;
    camera.fov = fov;
    camera.updateProjectionMatrix();

    page.numbers.canvasWidth = width;
    page.numbers.canvasHeight = height;
    page.numbers.aspectRatio = aspectRatio;
    page.numbers.camera.fov = fov;
  }, 500);
}

function _onMouseMove(
  event: MouseEvent,
  canvasWidth: number,
  canvasHeight: number,
) {
  const mouseX = (event.clientX / canvasWidth) * 2 - 1;
  const mouseY = -(event.clientY / canvasHeight) * 2 + 1;
}

function _onMouseLeave() {
  console.log("mouseLeave");
}

function _onMouseOver() {
  console.log("mouseover");
}

function _getViewPortSize(canvas: HTMLCanvasElement) {
  const canvasRect = canvas.getBoundingClientRect();
  const { width, height } = canvasRect;
  const aspectRatio = width / height;

  return { width, height, aspectRatio };
}

function _getPixelFOV(height: number, cameraFar: number) {
  const fovRadian = 2 * Math.atan(height / 2 / cameraFar);
  const fov = (180 * fovRadian) / Math.PI;

  return fov;
}

export default page;
