import * as THREE from "three";

interface Loader {
  allAssets: {}[] | null;
  init: () => Promise<void>;
  getAllAssets: (images: NodeListOf<Element>) => Promise<void>;
}

const textureLoader = new THREE.TextureLoader();
const loader: Loader = {
  allAssets: null,
  init,
  // getAllAssets,
};

async function init(imageAssets, noiseAssets) {
  console.log(imageAssets, noiseAssets);

  //すべてのアセットを収集する
  const allAssets = [];

  for (const image of imageAssets) {
    const src = image.getAttribute("src");

    const texture = {};
    texture.imageAsset = src;

    allAssets.push(texture);
  }

  allAssets.forEach((texture) => {
    const randomNum = Math.floor(Math.random() * noiseAssets.length);
    // console.log(texture, randomNum);

    texture.noiseAsset = noiseAssets[randomNum];
  });

  //収集したアセットからtextureを読み込み設定する
  const texturePromise = [];
  for (const asset of allAssets) {
    const imageTexture = _loadTexture(asset.imageAsset).then((texture) => {
      asset.imageTexture = texture;
    });

    const noiseTexture = _loadTexture(asset.noiseAsset).then((texture) => {
      asset.noiseTexture = texture;
    });

    texturePromise.push(imageTexture, noiseTexture);
  }

  await Promise.all(texturePromise);

  console.log(allAssets);
  loader.allAssets = allAssets;
}

// async function getAllAssets(images: NodeListOf<Element>) {
//   console.log("loader > getAllAssets");

//   const allAssets: Map<string | null, any> = new Map();
//   const texturePromises: Promise<void>[] = [];

//   for (const image of images) {
//     const src = image.getAttribute("src");

//     if (!src) {
//       throw new Error("No src attribute.");
//     }

//     allAssets.set(src, null);
//   }

//   for (const src of allAssets.keys()) {
//     if (!src) return;

//     const texture = _loadTexture(src).then((tex) => {
//       allAssets.set(src, tex);
//     });

//     texturePromises.push(texture);
//   }

//   await Promise.all(texturePromises);

//   loader.allAssets = allAssets;
// }

async function _loadTexture(src: string) {
  const texture = await textureLoader.loadAsync(src);

  return texture;
}

export default loader;
