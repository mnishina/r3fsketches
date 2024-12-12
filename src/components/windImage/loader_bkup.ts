import * as THREE from "three";

interface Loader {
  allAssets: Map<string | null, THREE.Texture> | null;
  init: () => void;
  getAllAssets: (images: NodeListOf<Element>) => Promise<void>;
}

const textureLoader = new THREE.TextureLoader();
const loader: Loader = {
  allAssets: null,
  init,
  getAllAssets,
};

function init() {}

async function getAllAssets(images: NodeListOf<Element>) {
  console.log("loader > getAllAssets");

  const allAssets: Map<string | null, any> = new Map();
  const texturePromises: Promise<void>[] = [];

  for (const image of images) {
    const src = image.getAttribute("src");

    if (!src) {
      throw new Error("No src attribute.");
    }

    allAssets.set(src, null);
  }

  for (const src of allAssets.keys()) {
    if (!src) return;

    const texture = _loadTexture(src).then((tex) => {
      allAssets.set(src, tex);
    });

    texturePromises.push(texture);
  }

  await Promise.all(texturePromises);

  loader.allAssets = allAssets;
}

async function _loadTexture(src: string) {
  const texture = await textureLoader.loadAsync(src);

  return texture;
}

export default loader;
