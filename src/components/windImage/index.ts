import page from "./page";
import loader from "./loader";

init();

async function init() {
  const { imageAssets, noiseAssets } = loader.init();
  await loader.collectAllAsset({ imageAssets, noiseAssets });

  const allAsset = loader.getAllAsset();
  console.log(allAsset);

  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  page.init({ canvas, imageAssets });
}
