import base from "./base";
import view from "./view";

console.log("index");

function init() {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement;
  const canvasRect = canvas.getBoundingClientRect() as DOMRect;

  base.init(canvas, canvasRect);

  const { renderer, camera, scene } = base;
  if (!renderer || !camera || !scene) return;
  view.render(renderer, camera, scene);
}

init();
