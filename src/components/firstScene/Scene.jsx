import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Model from "./Model";
import Rotate from "./Rotate";

const val = {
  modelURL: "/movie_camera.glb",
};

function Scene() {
  return (
    <>
      <Suspense fallback={<span className="loadText">Loading...</span>}>
        <Canvas dpr={[1, 2]} camera={{ position: [1, 1.25, 3.5], fov: 25 }}>
          <directionalLight position={[10, 10, 0]} intensity={1.5} />
          <directionalLight position={[-10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, 20, 0]} intensity={1.5} />
          <directionalLight position={[0, -10, 0]} intensity={0.25} />

          <Rotate scale={2.5} position-y={-0.25}>
            <Model url={val.modelURL} />
          </Rotate>
        </Canvas>
      </Suspense>
    </>
  );
}

export default Scene;
