import * as THREE from "three";

import type { Loader } from "./type";

const loader: Loader = {
  loadImage,
  loadManager: new THREE.LoadingManager(),
  textureLoader: new THREE.TextureLoader(),
  loadedTextures: [],
};

async function loadImage($image: NodeListOf<Element>) {
  return new Promise((resolve, reject) => {
    _manager(resolve, reject);

    const texture = [...$image].map((img) => {
      const src = img.getAttribute("src");
      if (!src) return;

      return loader.textureLoader.load(src);
    });

    loader.loadedTextures.push(...texture);
  });
}

function _manager(
  resolve: (value: unknown) => void,
  reject: (reason?: any) => void,
) {
  loader.textureLoader.manager = loader.loadManager;
  const manager = loader.textureLoader.manager;

  _progress(manager);
  _loaded(manager, resolve);
  _error(manager, reject);
}

function _loaded(
  manager: THREE.LoadingManager,
  resolve: (value: unknown) => void,
) {
  manager.onLoad = () => {
    console.log("loaded.");
    console.log(loader.loadedTextures);

    resolve(undefined);
  };
}

function _progress(manager: THREE.LoadingManager) {
  manager.onProgress = (url, loaded, total) => {
    console.log(url, loaded, total);
  };
}

function _error(manager: THREE.LoadingManager, reject: (reason?: any) => void) {
  manager.onError = (url) => {
    reject(new Error(`Failed to load texture: ${url}`));
  };
}

export default loader;
