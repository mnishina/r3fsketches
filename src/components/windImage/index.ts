import page from "./page";
import loader from "./loader";

init();

async function init() {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const imageAssets = document.querySelectorAll(
    "[data-imageTexture]",
  ) as NodeListOf<Element>;
  const noiseAssets = ["/noise.png", "/perlin.png"];

  await loader.init(imageAssets, noiseAssets);

  page.init({ canvas, imageAssets });
}
