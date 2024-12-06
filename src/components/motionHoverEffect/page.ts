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
  textureLoader: THREE.TextureLoader;
  items: {
    $item: Element | undefined;
    $img: HTMLImageElement | null;
    index: number | undefined;
  }[];
  textures: THREE.Texture[];
  texturePosition: THREE.Vector3;
  textureScale: THREE.Vector3;
  init: (
    canvas: HTMLCanvasElement,
    ul: HTMLUListElement,
    li: NodeListOf<HTMLLIElement>,
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
  textureLoader: new THREE.TextureLoader(),
  items: [
    {
      $item: undefined,
      $img: null,
      index: undefined,
    },
  ],
  textures: [],
  texturePosition: new THREE.Vector3(0, 0, 0),
  textureScale: new THREE.Vector3(1, 1, 1),
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
  console.log(await _loadTextureFromItems(page.items));

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

  page.$.li.forEach((item) => {
    item.addEventListener("mouseover", () => {
      _onMouseOver();
    });
  });
}

// async function _loadTexture(textures: NodeListOf<Element>) {
//   console.log("_loadTexture");

//   const urls: string[] = [];

//   Array.from(textures).forEach((texture, i) => {
//     const src = texture.getAttribute("src");
//     if (src) urls.push(src);
//   });

//   //promisesの配列を作り、urlsをmapする
//   const promises = urls.map((url: string, i: number) => {
//     return new Promise((resolve, reject) => {
//       const loader = new THREE.TextureLoader();
//       loader.load(
//         url,
//         (texture) => {
//           page.textures.push(texture);
//           resolve(texture);
//         },
//         undefined,
//         (err) => {
//           reject(err);
//         },
//       );
//     });
//   });

//   // console.log(promises);

//   //このファンクションのreturnでpromisesの配列をPromise.allする
//   return Promise.all(promises);
// }

// function _createMesh(textures: THREE.Texture[]) {
//   console.log("_createMesh");

//   textures.forEach((tex: THREE.Texture) => {
//     const { naturalWidth, naturalHeight } = tex.source.data;

//     const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
//     const material = new THREE.ShaderMaterial({
//       // wireframe: true,
//       vertexShader,
//       fragmentShader,
//       uniforms: {
//         uTex: { value: tex },
//         uAlpha: { value: 0 },
//       },
//     });
//     const mesh = new THREE.Mesh(geometry, material);
//     mesh.scale.set(naturalWidth, naturalHeight, 0);
//     page.scene.add(mesh);
//   });
// }

function _createBaseMesh() {
  const uniforms = {
    uAlpha: { value: 0 },
    uOffset: { value: new THREE.Vector2(0, 0) },
    uTexture: { value: null },
  };
  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader,
    fragmentShader,
    uniforms,
  });
  const mesh = new THREE.Mesh(geometry, material);
  page.scene.add(mesh);
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

function _getItems() {
  const items = document.querySelectorAll(".link");

  return [...items].map((item, index) => ({
    $item: item,
    $img: item.querySelector("img") || null,
    index: index,
  }));
}

async function _loadTextureFromItems(
  items: {
    $item: Element | undefined;
    $img: HTMLImageElement | null;
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
