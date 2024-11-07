console.log("index");

import world from "./world";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;

world.init(canvas);
