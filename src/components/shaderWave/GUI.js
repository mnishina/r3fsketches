import { GUI } from "lil-gui";
import { useEffect } from "react";

export const useGUI = (uniforms) => {
  const gui = new GUI();

  useEffect(() => {
    console.log("GUI");
  });
};
