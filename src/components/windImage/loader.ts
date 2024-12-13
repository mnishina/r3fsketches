import * as THREE from "three";

import type { Loader, Asset, CollectAsset } from "./types";

let total: number = 0;
let progress: number = 0;

const textureLoader = new THREE.TextureLoader();
const loader: Loader = {
  allAsset: null,
  init,
  collectAllAsset,
  getAllAsset,
};

function init(): Asset {
  const imageAssets = document.querySelectorAll(
    "[data-webglTexture]",
  ) as NodeListOf<Element>;
  const noiseAssets = ["/noise.png", "/perlin.png"];

  return { imageAssets, noiseAssets };
}

async function collectAllAsset({
  imageAssets,
  noiseAssets,
}: Asset): Promise<void> {
  //すべてのアセットを収集する
  const allAsset: CollectAsset[] = [...imageAssets].map((image) => {
    const imageRect = image.getBoundingClientRect();
    const src = image.getAttribute("src");

    return {
      imageRect: imageRect,
      imageAsset: src,
      noiseAsset: null,
      imageTexture: null,
      noiseTexture: null,
    };
  });

  total = allAsset.length * 2;

  allAsset.forEach((asset) => {
    const randomNum = Math.floor(Math.random() * noiseAssets.length);

    asset.noiseAsset = noiseAssets[randomNum];
  });

  //収集したアセットからtextureを読み込み設定する
  const texturePromise: Promise<void>[] = allAsset.map(async (asset) => {
    if (!asset.imageAsset || !asset.noiseAsset) return;

    const [imageTexture, noiseTexture] = await Promise.all([
      _loadTexture(asset.imageAsset),
      _loadTexture(asset.noiseAsset),
    ]);

    asset.imageTexture = imageTexture;
    asset.noiseTexture = noiseTexture;
  });

  await Promise.all(texturePromise);

  loader.allAsset = allAsset;
}

async function _loadTexture(src: string): Promise<THREE.Texture> {
  const texture = await textureLoader.loadAsync(src);

  progress++;

  console.log(`${progress} / ${total}`);

  return texture;
}

function getAllAsset(): CollectAsset[] | null {
  return loader.allAsset;
}

export default loader;
