import * as THREE from "three";
import { gsap, Power4 } from "gsap";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";

import functions from "./functions.ts";

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
    meshPosition: new THREE.Vector3(0, 0, 0),
    meshScale: new THREE.Vector3(1, 1, 1),
    strength: 0.001,
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
  state: {
    isMouseOver: false,
  },
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

  const { width, height, aspectRatio } = functions.getViewPortSize(canvas);
  const fov = functions.getPixelFOV(height, page.numbers.camera.far);
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
      const { width, height } = functions.getViewPortSize(canvas);

      page.numbers.canvasWidth = width;
      page.numbers.canvasHeight = height;
    }

    _onMouseMove(event, page.numbers.canvasWidth, page.numbers.canvasHeight);
  });

  page.$.ul.addEventListener("mouseenter", () => {
    _onMouseEnter();
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

    const { width, height, aspectRatio } = functions.getViewPortSize(canvas);
    const fov = functions.getPixelFOV(height, page.numbers.camera.far);
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
  if (!page.mesh) {
    console.log("no mesh");
    return;
  }

  const mouseX = (event.clientX / canvasWidth) * 2 - 1;
  const mouseY = -(event.clientY / canvasHeight) * 2 + 1;

  const x = functions.mapRange(
    mouseX,
    -1,
    1,
    -canvasWidth / 2,
    canvasWidth / 2,
  );
  const y = functions.mapRange(
    mouseY,
    -1,
    1,
    -canvasHeight / 2,
    canvasHeight / 2,
  );

  page.numbers.meshPosition = new THREE.Vector3(x, y, 0);
  // page.mesh.position.copy(page.numbers.meshPosition);

  gsap.to(page.mesh.position, {
    x: x,
    y: y,
    duration: 1,
    ease: Power4.easeOut,
    onUpdate: _onPositionUpdate,
  });
}

function _onMouseEnter() {
  gsap.to(page.uniforms.uAlpha, {
    value: 1,
    ease: Power4.easeOut,
  });

  page.state.isMouseOver = true;
}

function _onMouseLeave() {
  gsap.to(page.uniforms.uAlpha, {
    value: 0,
    ease: Power4.easeOut,
  });

  page.state.isMouseOver = false;
}

function _onMouseOver(index: number, event: MouseEvent) {
  page.currentItem = page.items[index];

  //set texture
  page.currentItem.texture = page.items[index].texture;
  page.uniforms.uTexture.value = page.currentItem.texture;

  //set mesh size
  const { naturalWidth, naturalHeight } = page.currentItem.texture?.source.data;
  // const imageAspectRatio = naturalWidth / naturalHeight;

  // page.numbers.meshScale = new THREE.Vector3(imageAspectRatio, 1, 1);
  // page.mesh?.scale.copy(page.numbers.meshScale);
  page.mesh?.scale.set(naturalWidth, naturalHeight, 0);
}

function _onPositionUpdate() {
  if (!page.mesh) return;

  let meshPos = page.mesh.position.clone();
  let posDelta = meshPos.sub(page.numbers.meshPosition); //現在のベクトル（meshPos）から引数のベクトル（page.numbers.meshPosition）の差。
  let offset = posDelta.multiplyScalar(-page.numbers.strength); //ベクトルのすべての成分（x, y, z）に同じ数値（スカラー値）を掛け算する操作です。
  let offset2d = new THREE.Vector2(offset.x, offset.y); //offsetは３次元ベクトルなので、vector2にするため、x,y成分を抽出する。

  page.uniforms.uOffset.value = offset2d;
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
