import {
  Center,
  Float,
  OrbitControls,
  PerspectiveCamera,
  RenderTexture,
  Text3D,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function FunMonitor() {
  const torusRef = useRef();

  useFrame((state, delta) => {
    torusRef.current.rotation.z -= delta / 2;
  });

  return (
    <RenderTexture attach="map">
      <OrbitControls
        target={[0, -2, 0]}
        minDistance={15}
        maxDistance={25}
        enablePan={false}
        maxAzimuthAngle={0.5}
        minAzimuthAngle={-0.5}
        maxPolarAngle={1.8}
        minPolarAngle={1.5}
      />
      <ambientLight intensity={1} />
      <directionalLight position={[0, 0.2, 0]} intensity={3} />
      <PerspectiveCamera
        makeDefault
        manual
        aspect={1 / 1}
        position={[-10, -5, 25]}
      />
      <color attach="background" args={["#B87474"]} />
      <Float floatIntensity={5}>
        <Center>
          <Text3D
            font={"./fonts/Concert_One/Concert One_Regular.json"}
            scale={2}
            rotation={[0, Math.PI, 0]}
            bevelEnabled={true}
            bevelThickness={0.02}
            bevelSize={0.02}
          >
            Hello World
            <meshStandardMaterial color={"#B87474"} />
          </Text3D>
        </Center>
      </Float>
      <mesh
        rotation={[0, Math.PI / 2, 0]}
        position={[0, 20, 10]}
        ref={torusRef}
      >
        <torusGeometry args={[25, 13, 16, 30]} />
        <meshNormalMaterial side={THREE.DoubleSide} flatShading={true} />
      </mesh>
    </RenderTexture>
  );
}
