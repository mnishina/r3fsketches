import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import WaveMesh from "./WaveMesh";

function Scene() {
  return (
    <>
      <Canvas>
        <WaveMesh />
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default Scene;
