interface Page {
  init: (canvas: HTMLCanvasElement) => void;
}

const page: Page = {
  init,
};

function init(canvas: HTMLCanvasElement) {
  console.log("page init");
}

export default page;
