import base from "./base";
import view from "./view";

function init() {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;

  base.init(canvas);

  view.init(canvas);
  
  const { renderer, camera, scene } = base;
  if (!renderer || !camera || !scene) return;
  view.render(renderer, camera, scene);
}

init();
