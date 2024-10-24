import { Environment } from "@react-three/drei";
// import { useControls } from "leva";
import { useState, useTransition } from "react";

function Env() {
  const [preset, setPreset] = useState("dawn");
  const [inTransition, startTransition] = useTransition();
  // const { blur } = useControls({
  //   blur: { value: 0.2, min: 0, max: 1 },
  //   preset: {
  //     value: preset,
  //     options: [
  //       "sunset",
  //       "dawn",
  //       "night",
  //       "warehouse",
  //       "forest",
  //       "apartment",
  //       "studio",
  //       "city",
  //       "park",
  //       "lobby",
  //     ],
  //     // If onChange is present the value will not be reactive, see https://github.com/pmndrs/leva/blob/main/docs/advanced/controlled-inputs.md#onchange
  //     // Instead we transition the preset value, which will prevents the suspense bound from triggering its fallback
  //     // That way we can hang onto the current environment until the new one has finished loading ...
  //     onChange: (value) => startTransition(() => setPreset(value)),
  //   },
  // });
  // console.log("Current blur value:", blur);
  return (
    <Environment
      preset={preset}
      background
      backgroundBlurriness={0.77}
      // blur={blur} //なくなったっぽい https://drei.docs.pmnd.rs/staging/environment
    />
  );
}

export default Env;
