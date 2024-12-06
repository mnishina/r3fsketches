import * as THREE from "three";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

import type { Page } from "./type.ts";

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
    texturePosition: new THREE.Vector3(0, 0, 0),
    textureScale: new THREE.Vector3(1, 1, 1),
  },
  $: {
    ul: undefined,
    li: undefined,
  },
  scene: new THREE.Scene(),
  mesh: undefined,
  textureLoader: new THREE.TextureLoader(),
  items: [
    {
      $item: undefined,
      $img: null,
      texture: undefined,
      index: undefined,
    },
  ],
  currentItem: undefined,
  textures: [],
  uniforms: {
    uAlpha: { value: 0 },
    uOffset: { value: new THREE.Vector2(0, 0) },
    uTexture: { value: undefined },
  },
  init,
};

async function init(
  canvas: HTMLCanvasElement,
  ul: HTMLUListElement,
  li: NodeListOf<HTMLLIElement>,
) {
  console.log("page init");

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

  page.$.ul = ul;
  page.$.li = li;

  page.items = _getItems();

  await _loadTextureFromItems(page.items);

  _createBaseMesh();

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

  page.items.forEach((item, index) => {
    const { $item } = item;

    if (!$item) return;

    $item.addEventListener("mouseover", (event) => {
      _onMouseOver(index, event as MouseEvent);
    });
  });
}

function _createBaseMesh() {
  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader,
    fragmentShader,
    uniforms: page.uniforms,
  });
  const mesh = new THREE.Mesh(geometry, material);
  page.scene.add(mesh);

  page.mesh = mesh;
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

function _onMouseOver(index: number, event: MouseEvent) {
  // console.log("mouseover", index, event);
  page.currentItem = page.items[index];

  //set texture
  page.currentItem.texture = page.items[index].texture;
  page.uniforms.uTexture.value = page.currentItem.texture;

  //set mesh size
  const { naturalWidth, naturalHeight } = page.currentItem.texture?.source.data;
  // const imageAspectRatio = naturalWidth / naturalHeight;

  // page.numbers.textureScale = new THREE.Vector3(imageAspectRatio, 1, 1);
  // page.mesh?.scale.copy(page.numbers.textureScale);
  page.mesh?.scale.set(naturalWidth, naturalHeight, 0);
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

function _getItems() {
  const items = document.querySelectorAll(".link");

  return [...items].map((item, index) => ({
    $item: item,
    $img: item.querySelector("img") || null,
    texture: undefined,
    index: index,
  }));
}

async function _loadTextureFromItems(
  items: {
    $item: Element | undefined;
    $img: HTMLImageElement | null;
    texture: THREE.Texture | undefined;
    index: number | undefined;
  }[],
): Promise<THREE.Texture[]> {
  const promises: Promise<THREE.Texture>[] = [];

  items.forEach((item) => {
    const url = item.$img?.src;

    promises.push(
      new Promise((resolve, reject) => {
        if (!url) {
          reject(new Error("no url"));
          return;
        }

        page.textureLoader.load(
          url,
          (texture) => {
            page.textures.push(texture);
            item.texture = texture;
            resolve(texture);
          },
          undefined,
          (err) => {
            reject(err);
          },
        );
      }),
    );
  });

  return Promise.all(promises);
}

export default page;
