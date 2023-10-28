import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import {
  useGLTF,
  useTexture,
  Float,
  shaderMaterial,
  useVideoTexture,
  Text,
  useProgress,
} from "@react-three/drei";
import { useFrame, extend, useThree } from "@react-three/fiber";
import fragmentShader from "./shaders/screen/fragment.glsl";
import vertexShader from "./shaders/screen/vertex.glsl";
import mouseFragmentShader from "./shaders/screen/mouseFragment.glsl";
import mouseVertexShader from "./shaders/screen/mouseVertex.glsl";
import FunMonitor from "./FunMonitor";
import ProjectsInfo from "./ProjectsInfo";

/**
 * Monitor shader material
 */
// Main monitor shader
const MonitorShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#dedede"),
    uColorEnd: new THREE.Color("#ff9c96"),
  },
  vertexShader,
  fragmentShader
);

// Mouse monitor shader
const MouseMonitorShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#4249ff"),
    uColorEnd: new THREE.Color("#ff4249"),
  },
  mouseVertexShader,
  mouseFragmentShader
);

extend({ MonitorShaderMaterial, MouseMonitorShaderMaterial });

export default function FloatingRV() {
  /**
   * Get loading progress
   */
  const { active, progress, errors, item, loaded, total } = useProgress();

  // Prepare state
  const [appStarting, setAppStarting] = useState(false);
  let appStartingTimeout;

  /**
   * Prepare ref
   */
  const projectsSignRef = useRef();
  const monitorShaderRef = useRef();
  const monitorShaderRef2 = useRef();
  const mouseMonitorShaderRef = useRef();
  const mouseMonitorShaderRef2 = useRef();
  const batteryLevel1 = useRef();
  const batteryLevel2 = useRef();
  const batteryLevel3 = useRef();
  const batteryLevel4 = useRef();

  /**
   * Loading models
   */
  const rvBody = useGLTF("./model/rvBody.glb");
  const rvBodyInside = useGLTF("./model/rvBodyInside.glb");
  const rvBodyParts = useGLTF("./model/rvBodyParts.glb");
  const rvItemSet = useGLTF("./model/rvItemSet.glb");
  const rvComplexItems = useGLTF("./model/rvComplexItems.glb");
  const rvFloatingClouds = useGLTF("./model/rvFloatingClouds.glb");
  const rvCharacters = useGLTF("./model/rvCharacters.glb");
  const rvBodyMonitors = useGLTF("./model/rvMonitors.glb");
  const rvGlasses = useGLTF("./model/rvGlasses.glb");
  const rvEmission = useGLTF("./model/rvEmission.glb");
  const rvPlanets = useGLTF("./model/rvPlanets.glb");
  const rvBitcoin = useGLTF("./model/rvBitcoin.glb");
  const rvBattery = useGLTF("./model/rvBattery.glb");

  /**
   * Loading textures
   */
  const bakedRVBody = useTexture("./model/textures/baked-rvbody.jpg");
  bakedRVBody.flipY = false;

  const bakedRVBodyInside = useTexture(
    "./model/textures/baked-rvBodyInside.jpg"
  );
  bakedRVBodyInside.flipY = false;

  const bakedRVBodyParts = useTexture("./model/textures/baked-rvBodyParts.jpg");
  bakedRVBodyParts.flipY = false;

  const bakedItemSet = useTexture("./model/textures/baked-itemSet.jpg");
  bakedItemSet.flipY = false;

  const bakedComplexItems = useTexture(
    "./model/textures/baked-complexItems.jpg"
  );
  bakedComplexItems.flipY = false;

  const bakedCharacters = useTexture("./model/textures/baked-characters.jpg");
  bakedCharacters.flipY = false;

  const planetMatcap1 = useTexture(
    "./model/textures/matcaps/906867_C7B6BC_5D2E26_BEA4A3-256px.png"
  );

  const planetMatcap2 = useTexture(
    "./model/textures/matcaps/DFDFCA_4D2D07_6B5224_857145-64px.png"
  );

  const bitcoinMatcap = useTexture(
    "./model/textures/matcaps/E6BF3C_5A4719_977726_FCFC82-256px.png"
  );

  const characterGlassesMatcap = useTexture(
    "./model/textures/matcaps/7A7A7A_D9D9D9_BCBCBC_B4B4B4-256px.png"
  );

  const floatingCloudsMatcap = useTexture(
    "./model/textures/matcaps/C8C8C8_3F3F3F_787878_5C5C5C-256px.png"
  );

  const projectMonitorTexture = useTexture(
    "./images/pexels-madison-inouye-1831234.jpg"
  );

  const chargingMonitorTexture = useTexture("./images/gradientPG.png");
  chargingMonitorTexture.rotation = Math.PI / 0.4;
  chargingMonitorTexture.offset = new THREE.Vector2(0.5, 0.5);

  const musicTexture = useVideoTexture("./mp4/music.mp4");
  musicTexture.flipY = false;

  const dogecoinTexture = useTexture("./images/dogecoin.png");
  dogecoinTexture.flipY = false;
  dogecoinTexture.offset.x = -0.21;
  dogecoinTexture.offset.y = -0.42;
  dogecoinTexture.repeat.x = 1.4;
  dogecoinTexture.repeat.y = 1.4;

  /**
   * Glasses materials
   */
  const blueGlassMaterial = new THREE.MeshPhysicalMaterial();
  blueGlassMaterial.color = new THREE.Color(0xdef2ff);
  blueGlassMaterial.transmission = 1;
  blueGlassMaterial.roughness = 0;
  blueGlassMaterial.ior = 1.7;
  blueGlassMaterial.thickness = 0.1;
  blueGlassMaterial.specularIntensity = 1;
  blueGlassMaterial.clearcoat = 1;

  const headLightGlassMaterial = new THREE.MeshPhysicalMaterial();
  headLightGlassMaterial.color = new THREE.Color(0xffe0d0);
  headLightGlassMaterial.transmission = 1;
  headLightGlassMaterial.roughness = 0.1;
  headLightGlassMaterial.ior = 2;
  headLightGlassMaterial.thickness = 0;
  headLightGlassMaterial.specularIntensity = 1;
  headLightGlassMaterial.clearcoat = 1;

  /**
   * Emission sign state
   */
  const [projectsSignHover, setProjectsSignHover] = useState(false);
  const [aboutSignHover, setAboutSignHover] = useState(false);
  const [emailSignHover, setEmailSignHover] = useState(false);
  const [linkedinSignHover, setLinkedinSignHover] = useState(false);
  const [githubSignHover, setGithubSignHover] = useState(false);

  const [focusProject, setFocusProject] = useState(false);
  const [focusAbout, setFocusAbout] = useState(false);
  const [focusAboutStage, setFocusAboutStage] = useState(1);
  const [exitingAboutFocus, setExitingAboutFocus] = useState(false);
  const [exitingProjectFocus, setExitingProjectFocus] = useState(false);

  /**
   * Emission indensity setup
   */
  const headLightIndensity = 10;
  const neonWhiteIndensity = 1.1;
  const neonBlueIndensity = 1.2;
  let projectsSignIndensity = projectsSignHover ? 0.3 : 1;
  let aboutSignIndensity = aboutSignHover ? 0.3 : 1;
  let emailSignIndensity = emailSignHover ? 0.3 : 1;
  let linkedinSignIndensity = linkedinSignHover ? 0.3 : 1;
  let githubSignIndensity = githubSignHover ? 0.3 : 1;

  /**
   * Event functions
   */
  const handleHoverEvent = (item) => {
    if (item.name === "projectsSign") {
      setProjectsSignHover(true);
      document.body.style.cursor = "pointer";
    } else if (item.name === "aboutSign") {
      setAboutSignHover(true);
      document.body.style.cursor = "pointer";
    } else if (item.name === "emailSign") {
      setEmailSignHover(true);
      document.body.style.cursor = "pointer";
    } else if (item.name === "linkedinSign") {
      setLinkedinSignHover(true);
      document.body.style.cursor = "pointer";
    } else if (item.name === "githubSign") {
      setGithubSignHover(true);
      document.body.style.cursor = "pointer";
    }
  };

  const handleLeaveEvent = (item) => {
    if (item.name === "projectsSign") {
      setProjectsSignHover(false);
      document.body.style.cursor = "auto";
    } else if (item.name === "aboutSign") {
      setAboutSignHover(false);
      document.body.style.cursor = "auto";
    } else if (item.name === "emailSign") {
      setEmailSignHover(false);
      document.body.style.cursor = "auto";
    } else if (item.name === "linkedinSign") {
      setLinkedinSignHover(false);
      document.body.style.cursor = "auto";
    } else if (item.name === "githubSign") {
      setGithubSignHover(false);
      document.body.style.cursor = "auto";
    }
  };

  const handleClickEvent = (item) => {
    if (activateControlTimeout == null) {
      if (item.name === "projectsSign") {
        setFocusProject(true);
      } else if (item.name === "aboutSign") {
        setFocusAbout(true);
      } else if (item.name === "emailSign") {
        window.open("mailto:vivitruong1506@gmail.com")
      } else if (item.name === "linkedinSign") {
        window.open("https://www.linkedin.com/in/vi-truong-421698253", "_blank")
      } else if (item.name === "githubSign") {
        window.open("https://github.com/vivitruong", "_blank")
      }
    }
  };

  const exitAboutFocus = () => {
    setFocusAbout(false);
    setExitingAboutFocus(true);
    document.body.style.cursor = "auto";
    clearTimeout(activateControlTimeout);
  };

  const exitProjectFocus = () => {
    setFocusProject(false);
    setExitingProjectFocus(true);
    document.body.style.cursor = "auto";
    clearTimeout(activateControlTimeout);
  };

  // Getting camera focus positions
  const cameraInitialPosition = new THREE.Vector3(30, 0, 27);
  const lerpProjectInitail = new THREE.Vector3(25, 7, 0);
  const lookAtInitial = new THREE.Vector3(0, 7, 0);
  const lerpProjectPosition = new THREE.Vector3(15, 7, -3);
  const lerpProjectLookAt = new THREE.Vector3(0, 7, -3);
  const lerpAboutPosition1 = new THREE.Vector3(0, 4, -25);
  const lerpAboutPosition2 = new THREE.Vector3(0, 4, -6);
  const lerpAboutLookAt = new THREE.Vector3(0, 4, -3);
  let lookAtPoaition = new THREE.Vector3(0, 7, 0);

  let cameraStageTimeout;
  let activateControlTimeout;

  useEffect(() => {
    // Loading state
    if (progress === 100) {
      setAppStarting(true);
      appStartingTimeout = setTimeout(() => {
        setAppStarting(false);
      }, 3000);
    }

    return () => {
      clearTimeout(appStartingTimeout);
      setAppStarting(false);
    };
  }, []);

  useFrame((state, delta) => {
    // Change camera view once app started
    if (appStarting && state.controls) {
      state.camera.lookAt(0, 7, 0);
      state.camera.position.lerp(cameraInitialPosition, 0.05);
    }

    // Animate monitor shader
    monitorShaderRef.current.uTime += delta;
    monitorShaderRef2.current.uTime += delta;
    mouseMonitorShaderRef.current.uTime += delta;
    mouseMonitorShaderRef2.current.uTime += delta;

    // Animate battery level
    batteryLevel1.current.position.x =
      Math.abs(0.15 * Math.sin(state.clock.elapsedTime + 0.8)) + 5.19 - 0.25;
    batteryLevel2.current.position.x =
      Math.abs(0.15 * Math.sin(state.clock.elapsedTime + 0.6)) + 5.19 - 0.25;
    batteryLevel3.current.position.x =
      Math.abs(0.15 * Math.sin(state.clock.elapsedTime + 0.4)) + 5.19 - 0.25;
    batteryLevel4.current.position.x =
      Math.abs(0.15 * Math.sin(state.clock.elapsedTime + 0.2)) + 5.19 - 0.25;

    // Change camera focus area
    if (focusProject) {
      state.controls.enabled = false;
      state.camera.position.lerp(lerpProjectPosition, 0.06);
      lookAtPoaition.lerp(lerpProjectLookAt, 0.06);
      state.camera.lookAt(lerpProjectLookAt);
    }
    if (focusAbout) {
      state.controls.enabled = false;
      if (focusAboutStage === 1) {
        state.camera.position.lerp(lerpAboutPosition1, 0.06);
      } else if (focusAboutStage === 2) {
        state.camera.position.lerp(lerpAboutPosition2, 0.06);
      }

      cameraStageTimeout = setTimeout(() => {
        setFocusAboutStage(2);
      }, 1000);

      lookAtPoaition.lerp(lerpAboutLookAt, 0.1);
      state.camera.lookAt(lerpAboutLookAt);
    }
    if (!focusAbout && exitingAboutFocus) {
      clearTimeout(cameraStageTimeout);
      state.camera.position.lerp(lerpAboutPosition1, 0.06);
      lookAtPoaition.lerp(lookAtInitial, 0.06);
      state.camera.lookAt(lookAtPoaition);
      activateControlTimeout = setTimeout(() => {
        state.controls.enabled = true;
        setExitingAboutFocus(false);
        setFocusAboutStage(1);
      }, 1500);
    }
    if (!focusProject && exitingProjectFocus) {
      state.camera.position.lerp(lerpProjectInitail, 0.06);
      lookAtPoaition.lerp(lookAtInitial, 0.06);
      state.camera.lookAt(lookAtPoaition);
      activateControlTimeout = setTimeout(() => {
        state.controls.enabled = true;
        setExitingProjectFocus(false);
      }, 500);
    }
  });

  return (
    <>
      {/* RV Body */}
      <mesh
        geometry={rvBody.nodes.RVBodyOutside.geometry}
        onPointerEnter={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <meshBasicMaterial map={bakedRVBody} />
      </mesh>

      {/* RV Body Inside*/}
      {rvBodyInside.nodes.Scene.children.map((child, index) => {
        return (
          <mesh
            geometry={child.geometry}
            key={index}
            onPointerEnter={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <meshBasicMaterial map={bakedRVBodyInside} />
          </mesh>
        );
      })}

      {/* RV Body Parts*/}
      {rvBodyParts.nodes.Scene.children.map((child, index) => {
        return (
          <mesh
            geometry={child.geometry}
            key={index}
            onPointerEnter={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <meshBasicMaterial map={bakedRVBodyParts} />
          </mesh>
        );
      })}

      {/* RV Item Set*/}
      {rvItemSet.nodes.Scene.children.map((child, index) => {
        const isChairBase = child.name === "chair001";
        return (
          <mesh
            geometry={child.geometry}
            key={index}
            onPointerEnter={() => handleHoverEvent(child)}
            onPointerLeave={() => handleLeaveEvent(child)}
            onClick={() => handleClickEvent(child)}
          >
            <meshBasicMaterial
              map={bakedItemSet}
              side={isChairBase && THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* RV Complex Item Set*/}
      {rvComplexItems.nodes.Scene.children.map((child, index) => {
        return (
          <mesh
            geometry={child.geometry}
            key={index}
            onPointerEnter={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <meshBasicMaterial map={bakedComplexItems} />
          </mesh>
        );
      })}

      {/* RV floating clouds*/}
      <Float floatIntensity={0.5} rotationIntensity={0.6}>
        <mesh
          geometry={rvFloatingClouds.nodes.floatingClouds.geometry}
          onPointerEnter={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <meshMatcapMaterial matcap={floatingCloudsMatcap} />
        </mesh>
      </Float>
      <Float floatIntensity={0.6} rotationIntensity={0.5}>
        <mesh
          geometry={rvFloatingClouds.nodes.floatingClouds001.geometry}
          onPointerEnter={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <meshMatcapMaterial matcap={floatingCloudsMatcap} />
        </mesh>
      </Float>
      <Float floatIntensity={0.8} rotationIntensity={0.3}>
        <mesh
          geometry={rvFloatingClouds.nodes.floatingClouds002.geometry}
          onPointerEnter={(event) => event.stopPropagation()}
          onClick={(event) => event.stopPropagation()}
        >
          <meshMatcapMaterial matcap={floatingCloudsMatcap} />
        </mesh>
      </Float>

      {/* RV Characters*/}
      <mesh geometry={rvCharacters.nodes.character.geometry}>
        <meshBasicMaterial map={bakedCharacters} />
      </mesh>
      <mesh geometry={rvCharacters.nodes.characterGlasses.geometry}>
        <meshMatcapMaterial matcap={characterGlassesMatcap} />
      </mesh>
      <mesh geometry={rvCharacters.nodes.glassesFrame.geometry}>
        <meshBasicMaterial color={"#000000"} />
      </mesh>

      {/* Bitcoin*/}
      <mesh geometry={rvBitcoin.nodes.bitcoin.geometry}>
        <meshMatcapMaterial matcap={bitcoinMatcap} />
      </mesh>

      {/* Monitors */}
      {/* About monitor */}
      <group>
        <mesh geometry={rvBodyMonitors.nodes.mainMonitorOne.geometry}>
          <monitorShaderMaterial ref={monitorShaderRef} />
        </mesh>
        {/* About info */}
        <Text
          font={"./fonts/Concert_One/ConcertOne-Regular.ttf"}
          scale={0.25}
          position={[0, 5.15, 4]}
          rotation={[0, Math.PI, 0]}
          maxWidth={18}
          lineHeight={1.3}
          outlineWidth={0.02}
          outlineColor={"gray"}
        >
          Hi, I'm Vivi. I'm a full-stack software engineer with a passion for
          Blockchain and Web3 technologies.
          <meshBasicMaterial color={"gray"} />
        </Text>

        <Text
          font={"./fonts/Concert_One/ConcertOne-Regular.ttf"}
          scale={0.18}
          position={[0.1, 4.15, 4]}
          rotation={[0, Math.PI, 0]}
          maxWidth={24}
          lineHeight={1}
          outlineWidth={0.01}
          outlineColor={"gray"}
        >
          Skillset: JavaScript, Python, CSS, HTML, PostgreSQL, Express,
          React, Redux, SQLAlchemy, Node, Solidity, Flask, TypeScript,
          Threejs, Blender ...
          <meshBasicMaterial color={"gray"} />
        </Text>

        {/* go back buttom */}
        {focusAbout && (
          <group
            position={[0, 3.6, 4]}
            rotation={[0, Math.PI, 0]}
            onPointerEnter={() => (document.body.style.cursor = "pointer")}
            onPointerLeave={() => (document.body.style.cursor = "auto")}
            onClick={exitAboutFocus}
          >
            <Text
              font={"./fonts/Concert_One/ConcertOne-Regular.ttf"}
              scale={0.18}
            >
              Go back
              <meshBasicMaterial color={"gray"} />
            </Text>
            <mesh position={[0, -0.05, -0.05]}>
              <planeGeometry args={[0.8, 0.25]} />
              <meshBasicMaterial color={"#ff9c96"} />
            </mesh>
          </group>
        )}
      </group>
      <mesh geometry={rvBodyMonitors.nodes.mainMonitorTwo.geometry}>
        <monitorShaderMaterial ref={monitorShaderRef2} />
      </mesh>
      <mesh geometry={rvBodyMonitors.nodes.miniMonitorOne.geometry}>
        <meshBasicMaterial map={dogecoinTexture} />
      </mesh>
      <mesh geometry={rvBodyMonitors.nodes.miniMonitorTwo.geometry}>
        <meshBasicMaterial map={dogecoinTexture} />
      </mesh>

      {/* Music monitor */}
      <group>
        <mesh geometry={rvBodyMonitors.nodes.pianoScreen.geometry}>
          <meshBasicMaterial map={musicTexture} />
        </mesh>
        <Text
          font={"./fonts/Concert_One/ConcertOne-Regular.ttf"}
          scale={0.27}
          position={[0.2, 13, -6.7]}
          lineHeight={1}
          maxWidth={10}
        >
          Background music: "Away" by Meydän
          <meshBasicMaterial />
        </Text>
        <Text
          font={"./fonts/Concert_One/ConcertOne-Regular.ttf"}
          scale={0.14}
          position={[0.2, 12.45, -6.7]}
          lineHeight={1}
          maxWidth={20}
        >
          Licensed under Creative Commons: By Attribution 4.0 International (CC
          BY 4.0)
          <meshBasicMaterial />
        </Text>
      </group>
      <mesh geometry={rvBodyMonitors.nodes.subMonitorOne.geometry}>
        <mouseMonitorShaderMaterial ref={mouseMonitorShaderRef} />
      </mesh>
      {/* Projects Monitor */}
      <group>
        <mesh geometry={rvBodyMonitors.nodes.subMonitorTwo.geometry}>
          <mouseMonitorShaderMaterial ref={mouseMonitorShaderRef2} />
        </mesh>
        <ProjectsInfo />
        {focusProject && (
          <group
            position={[4.8, 4.72, -2.93]}
            rotation={[0, Math.PI / 2, 0]}
            onPointerEnter={() => (document.body.style.cursor = "pointer")}
            onPointerLeave={() => (document.body.style.cursor = "auto")}
            onClick={exitProjectFocus}
          >
            <Text
              font={"./fonts/Concert_One/ConcertOne-Regular.ttf"}
              scale={0.18}
            >
              Go back
              <meshBasicMaterial color={"black"} />
            </Text>
            <mesh position={[0, -0.05, -0.05]}>
              <planeGeometry args={[0.8, 0.25]} />
              <meshBasicMaterial color={"pink"} />
            </mesh>
          </group>
        )}
      </group>
      <mesh geometry={rvBodyMonitors.nodes.subMonitorThree.geometry}>
        <meshBasicMaterial map={chargingMonitorTexture} />
      </mesh>
      <mesh geometry={rvBodyMonitors.nodes.subMonitorFour.geometry}>
        <meshStandardMaterial>
          <FunMonitor />
        </meshStandardMaterial>
      </mesh>

      {/* Battery */}
      <mesh
        geometry={rvBattery.nodes.battery.geometry}
        position={[5.09, 2.81, -6.19]}
      >
        <meshBasicMaterial
          color={[
            0.1 * neonBlueIndensity,
            1 * neonBlueIndensity,
            1 * neonBlueIndensity,
          ]}
        />
      </mesh>
      <mesh
        geometry={rvBattery.nodes.battery001.geometry}
        position={[5.09, 2.81, -6.19]}
        ref={batteryLevel1}
      >
        <meshBasicMaterial
          color={[
            0.1 * neonBlueIndensity,
            1 * neonBlueIndensity,
            1 * neonBlueIndensity,
          ]}
        />
      </mesh>
      <mesh
        geometry={rvBattery.nodes.battery002.geometry}
        position={[5.09, 2.81, -6.19]}
        ref={batteryLevel2}
      >
        <meshBasicMaterial
          color={[
            0.1 * neonBlueIndensity,
            1 * neonBlueIndensity,
            1 * neonBlueIndensity,
          ]}
        />
      </mesh>
      <mesh
        geometry={rvBattery.nodes.battery003.geometry}
        position={[5.09, 2.81, -6.19]}
        ref={batteryLevel3}
      >
        <meshBasicMaterial
          color={[
            0.1 * neonBlueIndensity,
            1 * neonBlueIndensity,
            1 * neonBlueIndensity,
          ]}
        />
      </mesh>
      <mesh
        geometry={rvBattery.nodes.battery004.geometry}
        position={[5.09, 2.81, -6.19]}
        ref={batteryLevel4}
      >
        <meshBasicMaterial
          color={[
            0.1 * neonBlueIndensity,
            1 * neonBlueIndensity,
            1 * neonBlueIndensity,
          ]}
        />
      </mesh>

      {/* Glasses */}
      <mesh
        geometry={rvGlasses.nodes.headlightGlass.geometry}
        material={headLightGlassMaterial}
      />
      <mesh
        geometry={rvGlasses.nodes.RVBodyGlass.geometry}
        material={blueGlassMaterial}
      />
      <mesh
        geometry={rvGlasses.nodes.subMonitorGlass.geometry}
        material={blueGlassMaterial}
      />

      {/* Emission */}
      <mesh geometry={rvEmission.nodes.headLight.geometry}>
        <meshBasicMaterial
          color={[
            1 * headLightIndensity,
            0.94 * headLightIndensity,
            0.53 * headLightIndensity,
          ]}
        />
      </mesh>
      <mesh geometry={rvEmission.nodes.backlight.geometry}>
        <meshBasicMaterial color={[1 * neonWhiteIndensity, 0, 0]} />
      </mesh>
      <mesh geometry={rvEmission.nodes.neonBlue.geometry}>
        <meshBasicMaterial
          color={[
            0.1 * neonBlueIndensity,
            1 * neonBlueIndensity,
            1 * neonBlueIndensity,
          ]}
        />
      </mesh>
      <mesh geometry={rvEmission.nodes.neonGreen.geometry}>
        <meshBasicMaterial
          color={[
            0.07 * neonWhiteIndensity,
            1 * neonWhiteIndensity,
            0.1 * neonWhiteIndensity,
          ]}
        />
      </mesh>
      <mesh geometry={rvEmission.nodes.neonPink.geometry}>
        <meshBasicMaterial
          color={[
            1 * neonWhiteIndensity,
            0.2 * neonWhiteIndensity,
            0.5 * neonWhiteIndensity,
          ]}
        />
      </mesh>
      <mesh geometry={rvEmission.nodes.neonWhite.geometry}>
        <meshBasicMaterial
          color={[
            1 * neonWhiteIndensity,
            1 * neonWhiteIndensity,
            1 * neonWhiteIndensity,
          ]}
        />
      </mesh>
      <mesh geometry={rvEmission.nodes.neonYellow.geometry}>
        <meshBasicMaterial
          color={[
            0.95 * neonWhiteIndensity,
            1 * neonWhiteIndensity,
            0.1 * neonWhiteIndensity,
          ]}
        />
      </mesh>

      {/* Emission Sign*/}
      <mesh
        geometry={rvEmission.nodes.projectsSign001.geometry}
        ref={projectsSignRef}
      >
        <meshBasicMaterial
          color={[
            1 * neonWhiteIndensity,
            1 * neonWhiteIndensity * projectsSignIndensity,
            1 * neonWhiteIndensity * projectsSignIndensity,
          ]}
        />
      </mesh>
      <mesh geometry={rvEmission.nodes.aboutSign001.geometry}>
        <meshBasicMaterial
          color={[
            1 * neonWhiteIndensity,
            1 * neonWhiteIndensity * aboutSignIndensity,
            1 * neonWhiteIndensity * aboutSignIndensity,
          ]}
        />
      </mesh>
      <mesh geometry={rvEmission.nodes.emailSign001.geometry}>
        <meshBasicMaterial
          color={[
            1 * neonWhiteIndensity,
            1 * neonWhiteIndensity * emailSignIndensity,
            1 * neonWhiteIndensity * emailSignIndensity,
          ]}
        />
      </mesh>
      <mesh geometry={rvEmission.nodes.linkedinSign001.geometry}>
        <meshBasicMaterial
          color={[
            1 * neonWhiteIndensity,
            1 * neonWhiteIndensity * linkedinSignIndensity,
            1 * neonWhiteIndensity * linkedinSignIndensity,
          ]}
        />
      </mesh>
      <mesh geometry={rvEmission.nodes.githubSign001.geometry}>
        <meshBasicMaterial
          color={[
            1 * neonWhiteIndensity,
            1 * neonWhiteIndensity * githubSignIndensity,
            1 * neonWhiteIndensity * githubSignIndensity,
          ]}
        />
      </mesh>

      {/* Planets */}
      <mesh
        geometry={rvPlanets.nodes.planet.geometry}
        position={[-28.29, 37.83, -79.44]}
      >
        <meshMatcapMaterial matcap={planetMatcap1} />
      </mesh>
      <mesh
        geometry={rvPlanets.nodes.planet001.geometry}
        position={[-110.15, 21.45, -5.38]}
      >
        <meshMatcapMaterial matcap={planetMatcap2} />
      </mesh>
      <mesh
        geometry={rvPlanets.nodes.planet002.geometry}
        position={[59.94, 31.99, 44.94]}
      >
        <meshMatcapMaterial matcap={planetMatcap1} />
      </mesh>
      <mesh
        geometry={rvPlanets.nodes.planetRing.geometry}
        position={[-110.15, 21.45, -5.38]}
      >
        <meshBasicMaterial
          color={[
            1 * neonWhiteIndensity,
            1 * neonWhiteIndensity,
            1 * neonWhiteIndensity,
          ]}
        />
      </mesh>
    </>
  );
}
