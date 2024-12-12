import * as THREE from "three";

import type { Loader, Asset, CollectAsset } from "./types";

const textureLoader = new THREE.TextureLoader();
const loader: Loader = {
  allAsset: null,
  init,
  collectAllAsset,
  getAllAsset,
};

function init() {
  const imageAssets = document.querySelectorAll(
    "[data-imageTexture]",
  ) as NodeListOf<Element>;
  const noiseAssets = ["/noise.png", "/perlin.png"];

  return { imageAssets, noiseAssets };
}

async function collectAllAsset({
  imageAssets,
  noiseAssets,
}: Asset): Promise<void> {
  //すべてのアセットを収集する
  const allAsset = [];

  for (const image of imageAssets) {
    const imageRect = image.getBoundingClientRect();
    const src = image.getAttribute("src");

    const asset: CollectAsset = {
      imageRect: null,
      imageAsset: null,
      noiseAsset: null,
      imageTexture: null,
      noiseTexture: null,
    };
    asset.imageRect = imageRect;
    asset.imageAsset = src;

    allAsset.push(asset);
  }

  allAsset.forEach((asset) => {
    const randomNum = Math.floor(Math.random() * noiseAssets.length);

    asset.noiseAsset = noiseAssets[randomNum];
  });

  //収集したアセットからtextureを読み込み設定する
  const texturePromise = [];
  for (const asset of allAsset) {
    if (!asset.imageAsset || !asset.noiseAsset) return;

    const imageTexture = _loadTexture(asset.imageAsset).then((texture) => {
      asset.imageTexture = texture;
    });

    const noiseTexture = _loadTexture(asset.noiseAsset).then((texture) => {
      asset.noiseTexture = texture;
    });

    texturePromise.push(imageTexture, noiseTexture);
  }

  await Promise.all(texturePromise);

  loader.allAsset = allAsset;
}

async function _loadTexture(src: string) {
  const texture = await textureLoader.loadAsync(src);

  return texture;
}

function getAllAsset() {
  return loader.allAsset;
}

export default loader;
