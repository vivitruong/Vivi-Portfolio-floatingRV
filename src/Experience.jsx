import { OrbitControls, Stars } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Suspense } from "react";
import FloatingRV from "./FloatingRV";

export default function Experience() {
  return (
    <Suspense fallback={null}>
      <OrbitControls
        makeDefault
        target={[0, 7, 0]}
        minDistance={18}
        maxDistance={120}
        enablePan={false}
        autoRotate
        autoRotateSpeed={-0.3}
      />

      <EffectComposer>
        <Bloom mipmapBlur intensity={0.4} luminanceThreshold={0} radius={0.3} />
      </EffectComposer>

      <ambientLight intensity={0.5} />

      <Stars count={1000} fade={true} />

      <fog attach="fog" color={"#E7C8C8"} near={1} far={400} />

      <FloatingRV />
    </Suspense>
  );
}
