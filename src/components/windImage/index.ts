import page from "./page";
import loader from "./loader";

init();

async function init() {
  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const images = document.querySelectorAll(
    "[data-webgl-image]",
  ) as NodeListOf<Element>;

  await loader.getAllAssets(images);
  // console.log("index >");
  // console.log(loader.allAssets);
  page.init({ canvas, images });
}
