console.log("index");

import world from "./world";

const $ = {
  canvas: document.querySelector("#canvas") as HTMLCanvasElement,
};

const canvasRect = $.canvas.getBoundingClientRect();

world.init(canvasRect);
