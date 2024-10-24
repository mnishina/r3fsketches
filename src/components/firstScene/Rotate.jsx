import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Rotate(props) {
  const ref = useRef();

  useFrame((state) => {
    ref.current.rotation.y = state.clock.elapsedTime * 0.5;
  });

  return <group ref={ref} {...props} />;
}

export default Rotate;
