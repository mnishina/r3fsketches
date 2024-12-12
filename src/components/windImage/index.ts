import page from "./page";
import loader from "./loader";

init();

async function init() {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const images = document.querySelectorAll(
    "[data-webgl-image]",
  ) as NodeListOf<Element>;

  const imageAssets = document.querySelectorAll(
    "[data-imageTexture]",
  ) as NodeListOf<Element>;
  const noiseAssets = ["/noise.png", "/perlin.png"];

  await loader.init(imageAssets, noiseAssets);

  // await loader.getAllAssets(images);
  // console.log("index >");
  // console.log(loader.allAssets);
  page.init({ canvas, images });
}
