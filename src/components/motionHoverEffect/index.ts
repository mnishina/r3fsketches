import page from "./page";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const textures = document.querySelectorAll(
  "[data-webGLTexture]",
) as NodeListOf<Element>;

page.init(canvas, textures);
