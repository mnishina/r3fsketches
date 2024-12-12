import * as THREE from "three";

interface Loader {
  allAssets:
    | {
        imageAsset: string | null;
        noiseAsset: string | null;
        imageTexture: THREE.Texture | null;
        noiseTexture: THREE.Texture | null;
      }[]
    | null;
  init: (
    imageAssets: NodeListOf<Element>,
    noiseAssets: string[],
  ) => Promise<void>;
}

const textureLoader = new THREE.TextureLoader();
const loader: Loader = {
  allAssets: null,
  init,
};

async function init(imageAssets: NodeListOf<Element>, noiseAssets: string[]) {
  console.log(imageAssets, noiseAssets);

  //すべてのアセットを収集する
  const allAssets = [];

  for (const image of imageAssets) {
    const src = image.getAttribute("src");

    const texture: {
      imageAsset: string | null;
      noiseAsset: string | null;
      imageTexture: THREE.Texture | null;
      noiseTexture: THREE.Texture | null;
    } = {
      imageAsset: null,
      noiseAsset: null,
      imageTexture: null,
      noiseTexture: null,
    };
    texture.imageAsset = src;

    allAssets.push(texture);
  }

  allAssets.forEach((texture) => {
    const randomNum = Math.floor(Math.random() * noiseAssets.length);

    texture.noiseAsset = noiseAssets[randomNum];
  });

  //収集したアセットからtextureを読み込み設定する
  const texturePromise = [];
  for (const asset of allAssets) {
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

  console.log(allAssets);
  loader.allAssets = allAssets;
}

async function _loadTexture(src: string) {
  const texture = await textureLoader.loadAsync(src);

  return texture;
}

export default loader;
