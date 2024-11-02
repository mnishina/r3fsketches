console.log("world");

const world = {
  init,
};

function init(canvasRect: DOMRect) {
  console.log("world init", canvasRect);
}

export default world;
