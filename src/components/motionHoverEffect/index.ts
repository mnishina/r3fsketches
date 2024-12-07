// reference: https://tympanus.net/codrops/2019/10/21/how-to-create-motion-hover-effects-with-image-distortions-using-three-js/

import page from "./page";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ul = document.querySelector("ul") as HTMLUListElement;
const li = document.querySelectorAll("li") as NodeListOf<HTMLLIElement>;

page.init(canvas, ul, li);
