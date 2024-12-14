import page from "./page";
import loader from "./loader";

init();

async function init() {
  const { imageAssets, noiseAssets } = loader.init();
  await loader.collectAllAsset({ imageAssets, noiseAssets });

  const allAsset = loader.getAllAsset();
  if (!allAsset) return;

  console.log(allAsset);

  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  await page.init({ canvas, allAsset });

  if (page.renderer && page.camera) {
    page.render(page.renderer, page.camera);
  }

  console.log("end index init");
}
