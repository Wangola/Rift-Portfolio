import React from "react";
import * as THREE from "three";
import {
  shaderMaterial,
  useTexture,
  useGLTF,
  OrbitControls,
  Center,
} from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

// Shader imports
import { extend, useFrame } from "@react-three/fiber";
import nexusVertexShader from "./shaders/nexus/vertex.glsl";
import nexusFragmentShader from "./shaders/nexus/fragment.glsl";
import projectPVertexShader from "./shaders/projectPortal/vertex.glsl";
import projectPFragmentShader from "./shaders/projectPortal/fragment.glsl";

// Animation
import { useRef } from "react";

// Custom Shaders
const NexusMaterial = shaderMaterial(
  {
    uTime: 0,
    uRotationSpeed: 0.3,
    uColorStart: new THREE.Color("#2EFFFF"), // light blue
    uColorEnd: new THREE.Color("#00008B"), // dark blue
    uColorPerlin: new THREE.Color("#0000E7"),
  },
  nexusVertexShader,
  nexusFragmentShader
);

const ProjectPortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#2EFF2E"), // light green
    uColorEnd: new THREE.Color("#00A300"), // dark green
    uColorPerlin: new THREE.Color("#d00017"), // red to make yellow/orange
  },
  projectPVertexShader,
  projectPFragmentShader
);

extend({ NexusMaterial, ProjectPortalMaterial });

export default function Experience() {
  // ----- LOADING GEO/TEX INFO -----
  // Destructure model load
  const { nodes } = useGLTF("./model/testing.glb");

  // // Loads texture
  const bakedTexture = useTexture("./model/testingBaked.jpg");
  bakedTexture.flipY = false;
  const bakedFloor = useTexture("./model/testing.jpg");
  bakedFloor.flipY = false;

  // ----- LOADING GEO/TEX INFO -----

  // ----- ANIMATION INFO -----
  const nexusMaterial = useRef();
  const projectPortalMaterial = useRef();

  // Tick handler
  useFrame((state, delta) => {
    nexusMaterial.current.uTime += delta;
    projectPortalMaterial.current.uTime += delta;
  });
  // ----- ANIMATION INFO -----

  // ----- LEVA/PERF INFO (debug) -----

  // Perf Visibility
  const { perfVisible } = useControls({
    perfVisible: false,
  });

  // Simple test for crystal movement
  const { position, visible } = useControls("Nexus Crystal", {
    position: {
      value: {
        x: nodes.nexusCrystal.position.x,
        y: nodes.nexusCrystal.position.y,
      },
      step: 0.05,
      joystick: "invertY",
    },
    visible: true,
  });

  // ----- LEVA/PERF INFO (debug) -----

  return (
    <>
      <color args={["#030202"]} attach={"background"} />

      {/* Inject perf */}
      {perfVisible ? <Perf position="top-left" /> : null}

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
          position={[position.x, position.y, nodes.nexusCrystal.position.z]}
          visible={visible}
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
