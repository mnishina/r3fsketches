import { Canvas } from "@react-three/fiber";
import Sphere from "./Sphere";
import {
  AccumulativeShadows,
  OrbitControls,
  RandomizedLight,
} from "@react-three/drei";
import Env from "./Env";

function scene() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <group position={[0, -0.65, 0]}>
          <Sphere />
          <AccumulativeShadows
            temporal={true}
            frames={200}
            color="purple"
            colorBlend={0.5}
            opacity={1}
            scale={14}
            alphaTest={0.65} //床のふちが見える場合こちらを調整
          >
            <RandomizedLight
              amount={8}
              radius={5}
              ambient={0.5}
              position={[5, 5, -10]}
              bias={0.001}
            />
          </AccumulativeShadows>
        </group>
        <Env />
        <OrbitControls
          autoRotate
          autoRotateSpeed={2}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.1}
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </>
  );
}

export default scene;
