import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";

function Scene() {
  return (
    <>
      <Canvas camera={{ position: [0, 0.9, -0.8], fov: 50 }}>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Model />
      </Canvas>
    </>
  );
}

export default Scene;
