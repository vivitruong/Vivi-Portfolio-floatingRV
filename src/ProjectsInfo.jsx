import {
  Center,
  Text,
  Text3D,
  RoundedBox,
  useTexture,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import { useState, useRef } from "react";

export default function ProjectsInfo() {
  // Projects state
  const [project1Active, setProject1Active] = useState(false);
  const [project2Active, setProject2Active] = useState(false);
  const [project3Active, setProject3Active] = useState(false);
  const [project4Active, setProject4Active] = useState(false);

  // Projects Refs
  const project1Ref = useRef();
  const project2Ref = useRef();
  const project3Ref = useRef();
  const project4Ref = useRef();
  //Projects Links
  const project1Link = 'https://vivi-portfolio.vercel.app/';
  const project2Link = 'https://tradix.onrender.com/';
  const project3Link = 'https://vivi-projects.onrender.com/';
  const project4Link = 'https://gegrooves.onrender.com';

  // Project images
  const projectTexture = useTexture("./images/dogecoin-image.png");
  projectTexture.offset.y = 0;

  // 3D Text matcap
  const textMatcap = useTexture(
    "./model/textures/matcaps/6E524D_8496C5_AF6624_100B11-256px.png"
  );

  // Projects Events
  const handleHover = (e) => {
    if (e.eventObject.name === "project1") {
      setProject1Active(true);
    }
    if (e.eventObject.name === "project2") {
      setProject2Active(true);
    }
    if (e.eventObject.name === "project3") {
      setProject3Active(true);
    }
    if (e.eventObject.name === "project4") {
      setProject4Active(true);
    }
    document.body.style.cursor = "pointer";
  };

  const handleLeave = (e) => {
    if (e.eventObject.name === "project1") {
      setProject1Active(false);
    }
    if (e.eventObject.name === "project2") {
      setProject2Active(false);
    }
    if (e.eventObject.name === "project3") {
      setProject3Active(false);
    }
    if (e.eventObject.name === "project4") {
      setProject4Active(false);
    }
    document.body.style.cursor = "auto";
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.eventObject.name === "project1") {
      console.log(e.eventObject.name);
      // window.open("https://www.google.ca", "_blank")
    }
    if (e.eventObject.name === "project2") {
      console.log(e.eventObject.name);
      window.open("https://tradix.onrender.com/", "_blank");
    }
    if (e.eventObject.name === "project3") {
      console.log(e.eventObject.name);
      window.open("https://vivi-projects.onrender.com/", "_blank");
    }
    if (e.eventObject.name === "project4") {
      console.log(e.eventObject.name);
      window.open("https://gegrooves.onrender.com", "_blank");
    }
  };

  /**
   * Projects animations
   */
  const { project1Scale, project2Scale, project3Scale, project4Scale } =
    useSpring({
      project1Scale: project1Active ? 1.2 : 1,
      project2Scale: project2Active ? 1.2 : 1,
      project3Scale: project3Active ? 1.2 : 1,
      project4Scale: project4Active ? 1.2 : 1,
    });

  return (
    <>
      {/* Project title */}
      <Center rotation={[0, Math.PI / 2, 0]} position={[4.8, 9.45, -2.95]}>
        <Text3D
          font="./fonts/Concert_One/Concert One_Regular.json"
          scale={0.4}
          bevelEnabled={true}
          bevelThickness={0.05}
          bevelSize={0.05}
        >
          PROJECTS
          {/* <meshNormalMaterial /> */}
          <meshMatcapMaterial matcap={textMatcap} />
        </Text3D>
      </Center>

      {/* Project 1 */}
      <a href={project1Link}>
      <animated.group
        name={"project1"}
        scale={project1Scale}
        rotation={[0, Math.PI / 2, 0]}
        position={[4.8, 8.6, -2.95]}
        onPointerEnter={handleHover}
        onPointerLeave={handleLeave}
        onClick={handleClick}
        ref={project1Ref}

      >
        <RoundedBox args={[2.8, 0.8, 0.2]} radius={0.1}>
          <meshBasicMaterial color={"pink"} />
        </RoundedBox>
        <mesh
          rotation={[Math.PI / 2, Math.PI / 2, 0]}
          position={[-0.75, 0, 0.1]}
        >
          <cylinderGeometry args={[0.3, 0.3, 0.1, 10]} />
          <meshBasicMaterial map={projectTexture} />
        </mesh>
        <Text
          font="./fonts/Concert_One/ConcertOne-Regular.ttf"
          fontSize={0.3}
          position={[-0.15, 0.05, 0.15]}
          anchorX="left"
          color={"#5E5E5E"}
        >
          Project 1
        </Text>
      </animated.group>
      </a>

      {/* Project 2 */}
      <a href={project2Link} >
      <animated.group
        name={"project2"}
        scale={project2Scale}
        rotation={[0, Math.PI / 2, 0]}
        position={[4.8, 7.5, -2.95]}
        onPointerEnter={handleHover}
        onPointerLeave={handleLeave}
        onClick={handleClick}
        ref={project2Ref}
      >
        <RoundedBox args={[2.8, 0.8, 0.2]} radius={0.1}>
          <meshBasicMaterial color={"pink"} />
        </RoundedBox>
        <mesh
          rotation={[Math.PI / 2, Math.PI / 2, 0]}
          position={[-0.75, 0, 0.1]}
        >
          <cylinderGeometry args={[0.3, 0.3, 0.1, 10]} />
          <meshBasicMaterial map={projectTexture} />
        </mesh>
        <Text
          font="./fonts/Concert_One/ConcertOne-Regular.ttf"
          fontSize={0.3}
          position={[-0.15, 0.05, 0.15]}
          anchorX="left"
          color={"#5E5E5E"}
        >
          Project 2
        </Text>
      </animated.group>
      </a>

      {/* Project 3 */}
      <a href={project3Link}>
      <animated.group
        name={"project3"}
        scale={project3Scale}
        rotation={[0, Math.PI / 2, 0]}
        position={[4.8, 6.4, -2.95]}
        onPointerEnter={handleHover}
        onPointerLeave={handleLeave}
        onClick={handleClick}
        ref={project3Ref}
      >
        <RoundedBox args={[2.8, 0.8, 0.2]} radius={0.1}>
          <meshBasicMaterial color={"pink"} />
        </RoundedBox>
        <mesh
          rotation={[Math.PI / 2, Math.PI / 2, 0]}
          position={[-0.75, 0, 0.1]}
        >
          <cylinderGeometry args={[0.3, 0.3, 0.1, 10]} />
          <meshBasicMaterial map={projectTexture} />
        </mesh>
        <Text
          font="./fonts/Concert_One/ConcertOne-Regular.ttf"
          fontSize={0.3}
          position={[-0.15, 0.05, 0.15]}
          anchorX="left"
          color={"#5E5E5E"}
        >
          Project 3
        </Text>
      </animated.group>
      </a>

      {/* Project 4 */}
      <a href={project4Link}>
      <animated.group
        name={"project4"}
        scale={project4Scale}
        rotation={[0, Math.PI / 2, 0]}
        position={[4.8, 5.3, -2.95]}
        onPointerEnter={handleHover}
        onPointerLeave={handleLeave}
        onClick={handleClick}
        ref={project4Ref}
      >
        <RoundedBox args={[2.8, 0.8, 0.2]} radius={0.1}>
          <meshBasicMaterial color={"pink"} />
        </RoundedBox>
        <mesh
          rotation={[Math.PI / 2, Math.PI / 2, 0]}
          position={[-0.75, 0, 0.1]}
        >
          <cylinderGeometry args={[0.3, 0.3, 0.1, 10]} />
          <meshBasicMaterial map={projectTexture} />
        </mesh>
        <Text
          font="./fonts/Concert_One/ConcertOne-Regular.ttf"
          fontSize={0.3}
          position={[-0.15, 0.05, 0.15]}
          anchorX="left"
          color={"#5E5E5E"}
        >
          Project 4
        </Text>
      </animated.group>
      </a>
    </>
  );
}
