import { Canvas } from "@react-three/fiber";
import Experience from "./Experience.jsx";
import { Loader } from "@react-three/drei";
import { useState } from "react";
import muteIcon from "../public/images/muteIcon.png";
import unmuteIcon from "../public/images/unmuteIcon.png";

export default function App() {
  /**
   * Prepare state
   */
  const [muteState, setMuteState] = useState(muteIcon);

  /**
   * Prepare music
   */
  // Background music: "Away" by Meydän
  // Licensed under Creative Commons: By Attribution 4.0 International (CC BY 4.0)
  const [backgroundMusic] = useState(
    () => new Audio("./mp3/Meydän - Away.mp3")
  );

  /**
   * Mute Event
   */
  const handleMute = (e) => {
    if (muteState === muteIcon) {
      setMuteState(unmuteIcon);
      backgroundMusic.play();
      backgroundMusic.loop = true;
    }
    if (muteState === unmuteIcon) {
      setMuteState(muteIcon);
      backgroundMusic.pause();
    }
  };

  return (
    <>
      <img
        id="muteButtom"
        src={muteState}
        alt="Mute Buttom"
        style={{ cursor: "pointer" }}
        onClick={handleMute}
      />
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 500,
          position: [0, 0, 80],
        }}
      >
        <Experience />
      </Canvas>
      <Loader />
    </>
  );
}
