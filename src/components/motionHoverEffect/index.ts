import page from "./page";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ul = document.querySelector("ul") as HTMLUListElement;
const li = document.querySelectorAll("li") as NodeListOf<HTMLLIElement>;

page.init(canvas, ul, li);
