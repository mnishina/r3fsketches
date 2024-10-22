import { useGLTF } from "@react-three/drei";

function Model({ url }) {
  const { scene } = useGLTF(url);

  return <primitive object={scene} />;
}

export default Model;
