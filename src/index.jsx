import "./style.css";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { Loader } from "@react-three/drei";

const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <>
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 500,
        position: [30, 0, 27],
      }}
    >
      <Experience />
    </Canvas>
    <Loader />
  </>
);
