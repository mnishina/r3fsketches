import loader from "./loader";
import base from "./base";
import view from "./view";

async function init() {
  const $canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const $image = document.querySelectorAll(
    "[data-webgl]",
  ) as NodeListOf<Element>;

  await loader.loadImage($image);

  base.init($canvas);

  view.init($canvas);
  view.createMesh(loader.loadedMedias, $canvas);

  const { renderer, camera, scene } = base;
  if (!renderer || !camera || !scene) return;
  view.render(renderer, camera, scene);
}

init();
