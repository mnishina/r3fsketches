import page from "./page";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const $images = document.querySelectorAll("[data-webgl-image]");

page.init(canvas, $images);
