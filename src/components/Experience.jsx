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

// Shader import
import { extend, useFrame } from "@react-three/fiber";
import nexusVertexShader from "../shaders/nexus/vertex.glsl";
import nexusFragmentShader from "../shaders/nexus/fragment.glsl";
import portalVertexShader from "../shaders/portal/vertex.glsl";
import portalFragmentShader from "../shaders/portal/fragment.glsl";
import candleVertexShader from "../shaders/candleFire/vertex.glsl";
import candleFragmentShader from "../shaders/candleFire/fragment.glsl";

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
    uColorStart: new THREE.Color(), // light green
    uColorEnd: new THREE.Color(), // dark green
    uColorPerlin: new THREE.Color(), // red to make yellow/orange
    uDisplacedInt: 0.0,
    uPerlinInt: 0.0,
  },
  portalVertexShader,
  portalFragmentShader
);

const GamePortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color(), // light red
    uColorEnd: new THREE.Color(), // dark red
    uColorPerlin: new THREE.Color(), // light violet to improve portal brightness
    uDisplacedInt: 0.0,
    uPerlinInt: 0.0,
  },
  portalVertexShader,
  portalFragmentShader
);

const ExpPortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color(), // light blue #0E86D4
    uColorEnd: new THREE.Color(), // dark blue #003060
    uColorPerlin: new THREE.Color(), // red to remove black outlines #A30000. Or brown for yellowish tint. #964B00 #A30000
    uDisplacedInt: 0.0,
    uPerlinInt: 0.0,
  },
  portalVertexShader,
  portalFragmentShader
);

const CandleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color(),
    uColorEnd: new THREE.Color(),
  },
  candleVertexShader,
  candleFragmentShader
);

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

  // ----- LEVA/PERF INFO (debug) -----

  // Perf Visibility
  const { perfVisible } = useControls({
    perfVisible: false,
  });

  // Simple test for crystal movement
  const { position, visible } = useControls(
    "Nexus Crystal",
    {
      position: {
        value: {
          x: nodes.nexusCrystal.position.x,
          y: nodes.nexusCrystal.position.y,
        },
        step: 0.05,
        joystick: "invertY",
      },
      visible: true,
    },
    { collapsed: true }
  );

  // --- Portal color management ---
  // - Project Portal
  const {
    projectColorStart,
    projectColorEnd,
    projectColorPerlin,
    projectDisplacedInt,
    projectPerlinInt,
  } = useControls(
    "Project Portal",
    {
      projectColorStart: "#2EFF2E",
      projectColorEnd: "#00A300",
      projectColorPerlin: "#d00017",
      projectDisplacedInt: { value: 5.0, min: 0, max: 25, step: 0.1 },
      projectPerlinInt: { value: 5.0, min: 0, max: 25, step: 0.1 },
    },
    { collapsed: true }
  );

  // Game Portal
  const {
    gameColorStart,
    gameColorEnd,
    gameColorPerlin,
    gameDisplacedInt,
    gamePerlinInt,
  } = useControls(
    "Game Portal",
    {
      gameColorStart: "#FF2E2E",
      gameColorEnd: "#A30000",
      gameColorPerlin: "#9D52FF",
      gameDisplacedInt: { value: 15.0, min: 0, max: 25, step: 0.1 },
      gamePerlinInt: { value: 8.0, min: 0, max: 25, step: 0.1 },
    },
    { collapsed: true }
  );

  // Experience Portal
  const {
    expColorStart,
    expColorEnd,
    expColorPerlin,
    expDisplacedInt,
    expPerlinInt,
  } = useControls(
    "Experience Portal",
    {
      expColorStart: "#6bb8eb",
      expColorEnd: "#376796",
      expColorPerlin: "#A30000",
      expDisplacedInt: { value: 8.0, min: 0, max: 25, step: 0.1 },
      expPerlinInt: { value: 3.0, min: 0, max: 25, step: 0.1 },
    },
    { collapsed: true }
  );
  // --- Portal color management ---

  // Candle Fire
  const { candleColorStart, candleColorEnd } = useControls(
    "Candle Fire",
    {
      candleColorStart: "#FFBF00",
      candleColorEnd: "#FFCC00",
    },
    { collapsed: true }
  );

  // ----- LEVA/PERF INFO (debug) -----

  // ----- USEEFFECT UPDATES -----
  // Update projectPortal property's with Leva control changes
  React.useEffect(() => {
    projectPortalMaterial.current.uColorStart.set(projectColorStart);
    projectPortalMaterial.current.uColorEnd.set(projectColorEnd);
    projectPortalMaterial.current.uColorPerlin.set(projectColorPerlin);
    projectPortalMaterial.current.uniforms.uDisplacedInt.value =
      projectDisplacedInt;
    projectPortalMaterial.current.uniforms.uPerlinInt.value = projectPerlinInt;
  }, [
    projectColorStart,
    projectColorEnd,
    projectColorPerlin,
    projectDisplacedInt,
    projectPerlinInt,
  ]);

  // Update gamesPortal property's with Leva control changes.
  React.useEffect(() => {
    gamePortalMaterial.current.uColorStart.set(gameColorStart);
    gamePortalMaterial.current.uColorEnd.set(gameColorEnd);
    gamePortalMaterial.current.uColorPerlin.set(gameColorPerlin);
    gamePortalMaterial.current.uniforms.uDisplacedInt.value = gameDisplacedInt;
    gamePortalMaterial.current.uniforms.uPerlinInt.value = gamePerlinInt;
  }, [
    gameColorStart,
    gameColorEnd,
    gameColorPerlin,
    gameDisplacedInt,
    gamePerlinInt,
  ]);

  // Update expPortal property's with Leva control changes.
  React.useEffect(() => {
    expPortalMaterial.current.uColorStart.set(expColorStart);
    expPortalMaterial.current.uColorEnd.set(expColorEnd);
    expPortalMaterial.current.uColorPerlin.set(expColorPerlin);
    expPortalMaterial.current.uniforms.uDisplacedInt.value = expDisplacedInt;
    expPortalMaterial.current.uniforms.uPerlinInt.value = expPerlinInt;
  }, [
    expColorStart,
    expColorEnd,
    expColorPerlin,
    expDisplacedInt,
    expPerlinInt,
  ]);

  // Update candleFire property's with Leva control changes
  React.useEffect(() => {
    candleMaterial.current.uColorStart.set(candleColorStart);
    candleMaterial.current.uColorEnd.set(candleColorEnd);
  }, [candleColorStart, candleColorEnd]);
  // ----- USEEFFECT UPDATES -----

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
