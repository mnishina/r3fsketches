import { Center } from "@react-three/drei";

function Sphere() {
  return (
    <>
      <Center top>
        <mesh castShadow>
          <sphereGeometry args={[0.75, 64, 64]} />
          <meshStandardMaterial metalness={1} roughness={0.37} />
        </mesh>
      </Center>
    </>
  );
}

export default Sphere;
