import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGUI } from "./GUI";

const debugObject = {
  depthColor: "#555",
  surfaceColor: "#ccc",
};

const shaderUniforms = {
  uTime: { value: 0 },
  uBigWavesElevation: {
    value: 0.2,
  },
  uBigWavesFrequency: {
    value: new THREE.Vector2(4, 1.5),
  },
  uBigWavesSpeed: { value: 3 },
  uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
  uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
};

const vertexShader = `
  uniform float uTime;
  uniform float uBigWavesSpeed;
  uniform float uBigWavesElevation;
  uniform vec2 uBigWavesFrequency;

  varying float vElevation;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                      sin(modelPosition.y * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
                      uBigWavesElevation;

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;

    //varying
    vElevation = elevation;
  }
`;

const fragmentShader = `
  uniform vec3 uDepthColor;
  uniform vec3 uSurfaceColor;

  varying float vElevation;

  void main() {

    float bottomUpValue = 0.2;
    vec3 color = mix(uDepthColor, uSurfaceColor, vElevation) + bottomUpValue;

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
  }
`;

function WaveMesh() {
  useFrame((state) => {
    shaderUniforms.uTime.value = state.clock.elapsedTime;
  });

  useGUI(shaderUniforms);

  return (
    <>
      <mesh rotation={[-1.2, 0, -1]} scale={2.5}>
        <planeGeometry args={[2, 2, 128, 128]} />
        <shaderMaterial
          side={THREE.DoubleSide}
          uniforms={shaderUniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  );
}

export default WaveMesh;
