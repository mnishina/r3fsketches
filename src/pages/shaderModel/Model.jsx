import { shaderMaterial } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { useRef } from "react";

// カスタムシェーダーマテリアルの定義
const CustomShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
    uColor: new THREE.Color(1.0, 1.0, 1.0),
  },
  // vert
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // frag
  `
    uniform float uTime;
    uniform vec3 uColor;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      // 時間によって色が変化するエフェクト
      vec3 color = uColor;
      color.r *= sin(uTime + vUv.x * 3.0) * 0.5 + 0.5;
      color.g *= cos(uTime + vUv.y * 3.0) * 0.5 + 0.5;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
);

function Model() {
  const gltf = useLoader(GLTFLoader, "/interior_plant_calathea.glb");
  const materialRef = useRef();
  console.log(gltf);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime();
    }
  });

  return (
    <primitive object={gltf.scene}>
      {gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material = new CustomShaderMaterial();
          materialRef.current = child.material;
        }
      })}
    </primitive>
  );
}

export default Model;
