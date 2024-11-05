console.log("world");

interface World {
  init: (canvas: HTMLCanvasElement, canvasRect: DOMRect) => void;
}

const world: World = {
  init,
};

function init(canvas: HTMLCanvasElement, canvasRect: DOMRect) {
  console.log("world init");
}

function _tick() {
  requestAnimationFrame(_tick);
}

export default world;
