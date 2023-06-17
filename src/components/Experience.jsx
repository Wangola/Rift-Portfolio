import React, { useRef } from "react";
import { useTexture, useGLTF, OrbitControls, Center } from "@react-three/drei";
import { Perf } from "r3f-perf";

// Shader support imports
import { extend, useFrame } from "@react-three/fiber";

// ----- Component import -----
import {
  NexusMaterial,
  ProjectPortalMaterial,
  GamePortalMaterial,
  ExpPortalMaterial,
  CandleMaterial,
} from "./Shaders";

import Controls from "./DebugControls";

// ----- Component import -----

// Extend is needed for material usage (Shaders.jsx utalizes shaderMaterial)
extend({
  NexusMaterial,
  ProjectPortalMaterial,
  GamePortalMaterial,
  ExpPortalMaterial,
  CandleMaterial,
});

export default function Experience() {
  // ----- LOADING GEO/TEX INFO -----
  // Destructure model load
  const { nodes } = useGLTF("./model/testing.glb");

  // Initializing Control Function (Any leva value needed will begin with controls.)
  const controls = Controls();

  // // Loads texture
  const bakedTexture = useTexture("./model/testingBaked.jpg");
  bakedTexture.flipY = false;
  const bakedFloor = useTexture("./model/testing.jpg");
  bakedFloor.flipY = false;

  // ----- LOADING GEO/TEX INFO -----

  // ----- ANIMATION INFO -----
  const nexusMaterial = useRef();
  const projectPortalMaterial = useRef();
  const gamePortalMaterial = useRef();
  const expPortalMaterial = useRef();
  const candleMaterial = useRef();

  // Tick handler
  useFrame((state, delta) => {
    nexusMaterial.current.uTime += delta;
    projectPortalMaterial.current.uTime += delta;
    gamePortalMaterial.current.uTime += delta;
    expPortalMaterial.current.uTime += delta;
    candleMaterial.current.uTime += delta;
  });
  // ----- ANIMATION INFO -----

  // ----- USEEFFECT UPDATES -----
  // Update projectPortal property's with Leva control changes
  React.useEffect(() => {
    projectPortalMaterial.current.uColorStart.set(controls.projectColorStart);
    projectPortalMaterial.current.uColorEnd.set(controls.projectColorEnd);
    projectPortalMaterial.current.uColorPerlin.set(controls.projectColorPerlin);
    projectPortalMaterial.current.uniforms.uDisplacedInt.value =
      controls.projectDisplacedInt;
    projectPortalMaterial.current.uniforms.uPerlinInt.value =
      controls.projectPerlinInt;
  }, [
    controls.projectColorStart,
    controls.projectColorEnd,
    controls.projectColorPerlin,
    controls.projectDisplacedInt,
    controls.projectPerlinInt,
  ]);

  // Update gamesPortal property's with Leva control changes.
  React.useEffect(() => {
    gamePortalMaterial.current.uColorStart.set(controls.gameColorStart);
    gamePortalMaterial.current.uColorEnd.set(controls.gameColorEnd);
    gamePortalMaterial.current.uColorPerlin.set(controls.gameColorPerlin);
    gamePortalMaterial.current.uniforms.uDisplacedInt.value =
      controls.gameDisplacedInt;
    gamePortalMaterial.current.uniforms.uPerlinInt.value =
      controls.gamePerlinInt;
  }, [
    controls.gameColorStart,
    controls.gameColorEnd,
    controls.gameColorPerlin,
    controls.gameDisplacedInt,
    controls.gamePerlinInt,
  ]);

  // Update expPortal property's with Leva control changes.
  React.useEffect(() => {
    expPortalMaterial.current.uColorStart.set(controls.expColorStart);
    expPortalMaterial.current.uColorEnd.set(controls.expColorEnd);
    expPortalMaterial.current.uColorPerlin.set(controls.expColorPerlin);
    expPortalMaterial.current.uniforms.uDisplacedInt.value =
      controls.expDisplacedInt;
    expPortalMaterial.current.uniforms.uPerlinInt.value = controls.expPerlinInt;
  }, [
    controls.expColorStart,
    controls.expColorEnd,
    controls.expColorPerlin,
    controls.expDisplacedInt,
    controls.expPerlinInt,
  ]);

  // Update candleFire property's with Leva control changes
  React.useEffect(() => {
    candleMaterial.current.uColorStart.set(controls.candleColorStart);
    candleMaterial.current.uColorEnd.set(controls.candleColorEnd);
  }, [controls.candleColorStart, controls.candleColorEnd]);
  // ----- USEEFFECT UPDATES -----

  return (
    <>
      <color args={["#030202"]} attach={"background"} />

      {/* Inject perf */}
      {controls.perfVisible ? <Perf position="top-left" /> : null}

      <OrbitControls makeDefault />

      <Center>
        {/* Load Scene */}
        <mesh geometry={nodes.baked.geometry} position={nodes.baked.position}>
          <meshBasicMaterial map={bakedTexture} />
        </mesh>

        {/* Load Floor */}
        <mesh
          geometry={nodes.floorBaked.geometry}
          position={nodes.floorBaked.position}
        >
          <meshBasicMaterial map={bakedFloor} />
        </mesh>

        {/* Load Nexus Crystal */}
        <mesh
          geometry={nodes.nexusCrystal.geometry}
          position={[
            controls.position.x,
            controls.position.y,
            nodes.nexusCrystal.position.z,
          ]}
          visible={controls.visible}
        >
          <nexusMaterial ref={nexusMaterial} />
        </mesh>

        {/* Load Names */}
        <mesh
          geometry={nodes.names.geometry}
          position={nodes.names.position}
        ></mesh>

        {/* Load projectPortalEnt */}
        <mesh
          geometry={nodes.projectPortalEnt.geometry}
          position={nodes.projectPortalEnt.position}
        >
          <projectPortalMaterial ref={projectPortalMaterial} />
        </mesh>

        {/* Load gamePortalEnt */}
        <mesh
          geometry={nodes.gamePortalEnt.geometry}
          position={nodes.gamePortalEnt.position}
        >
          <gamePortalMaterial ref={gamePortalMaterial} />
        </mesh>

        {/* Load expPortalEnt */}
        <mesh
          geometry={nodes.expPortalEnt.geometry}
          position={nodes.expPortalEnt.position}
        >
          <expPortalMaterial ref={expPortalMaterial} />
        </mesh>

        {/* Load candleFire */}
        <mesh
          geometry={nodes.candleFire.geometry}
          position={nodes.candleFire.position}
        >
          <candleMaterial ref={candleMaterial} />
        </mesh>
      </Center>
    </>
  );
}

// // Dynamically add emissions objects into scene. (added before return)
// const nodeNames = [];

// // Looping through the nodes property
// for (const nodeName in nodes) {
//   // If nodes has a property match set true.
//   if (nodes.hasOwnProperty(nodeName)) {
//     // Set current node with nodes[name]
//     const node = nodes[nodeName];

//     // If node is a mesh and is not baked (add to map)
//     if (node.isMesh && nodeName !== "baked" && nodeName !== "floorBaked") {
//       // Store the node name in the array
//       nodeNames.push(nodeName);
//     }
//   }
// }

// {/* Load all emissions */}  (add in return)
// {nodeNames.map((nodeName, index) => {
//   // Dynamically access the geometry using the nodeName
//   const geometry = nodes[nodeName].geometry;
//   const position = nodes[nodeName].position;

//   return <mesh key={index} geometry={geometry} position={position} />;
// })}
