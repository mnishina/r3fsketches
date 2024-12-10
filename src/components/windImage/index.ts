import page from "./page";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const images = document.querySelectorAll("[data-webgl-image]") as NodeListOf<Element>;

page.init({ canvas, images });
