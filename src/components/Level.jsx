import React, { useRef } from "react";
import { useTexture, useGLTF } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { RigidBody } from "@react-three/rapier";
import { Quaternion, Vector3 } from "three";

// Shader support imports
import { extend, useFrame } from "@react-three/fiber";

/**
 *  Component import
 */
import {
  NexusMaterial,
  ProjectPortalMaterial,
  GamePortalMaterial,
  ExpPortalMaterial,
  CrystalBallMaterial,
  StaffGemMaterial,
  CandleMaterial,
} from "./Shaders";

import DebugControls from "./DebugControls";

/**
 * Extend is needed for material usage (Shaders.jsx utilizes shaderMaterial)
 */
extend({
  NexusMaterial,
  ProjectPortalMaterial,
  GamePortalMaterial,
  ExpPortalMaterial,
  CandleMaterial,
  CrystalBallMaterial,
  StaffGemMaterial,
});

export default function Experience() {
  /**
   * Loading Process
   */
  // Destructure model load
  const { nodes } = useGLTF("./model/baked.glb");

  // Initializing Control Function (Any leva value needed will begin with controls.)
  const controls = DebugControls();

  // Loads textures
  const bakedTexture = useTexture("./model/baked.jpg");
  bakedTexture.flipY = false;
  const bakedFloor = useTexture("./model/bakedFloor.jpg");
  bakedFloor.flipY = false;
  const bakedExtra = useTexture("./model/bakedExtra.jpg");
  bakedExtra.flipY = false;

  /**
   * Node Extraction
   */
  // Dynamically add emissions objects into scene (specify include name for group).
  const nodeNames = [];

  // Looping through the nodes property
  for (const nodeName in nodes) {
    if (nodes.hasOwnProperty(nodeName)) {
      const node = nodes[nodeName];
      if (node.isMesh && nodeName !== "baked" && nodeName !== "floorBaked") {
        nodeNames.push(nodeName);
      }
    }
  }

  /**
   * Animation Info
   */
  const nexusMaterial = useRef();
  const projectPortalMaterial = useRef();
  const gamePortalMaterial = useRef();
  const expPortalMaterial = useRef();
  const candleMaterial = useRef();
  const crystalBallMaterial = useRef();
  const staffGemMaterial = useRef();

  // Custom rotationSpeed for Pillars
  const nexusPillarRef = useRef();
  const rotationSpeed = 0.3; // Speed of rotation

  // Tick handler
  useFrame((state, delta) => {
    nexusMaterial.current.uTime += delta;
    projectPortalMaterial.current.uTime += delta;
    gamePortalMaterial.current.uTime += delta;
    expPortalMaterial.current.uTime += delta;
    candleMaterial.current.uTime += delta;
    crystalBallMaterial.current.uTime += delta;
    staffGemMaterial.current.uTime += delta;

    // Update rotation
    if (nexusPillarRef.current) {
      nexusPillarRef.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  /**
   * UseEffect updates
   */
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

  // Update crystalBall property's with Leva control changes
  React.useEffect(() => {
    crystalBallMaterial.current.uColorStart.set(controls.crystalColorStart);
    crystalBallMaterial.current.uColorEnd.set(controls.crystalColorEnd);
  }, [controls.crystalColorStart, controls.crystalColorEnd]);

  // Update staffGem property's with Leva control changes
  React.useEffect(() => {
    staffGemMaterial.current.uColorStart.set(controls.staffColorStart);
    staffGemMaterial.current.uColorEnd.set(controls.staffColorEnd);
  }, [controls.staffColorStart, controls.staffColorEnd]);

  // Update candleFire property's with Leva control changes
  React.useEffect(() => {
    candleMaterial.current.uColorStart.set(controls.candleColorStart);
    candleMaterial.current.uColorEnd.set(controls.candleColorEnd);
  }, [controls.candleColorStart, controls.candleColorEnd]);

  return (
    <>
      <color args={[controls.backgroundColor]} attach={"background"} />

      {/* Inject perf */}
      {controls.perfVisible ? <Perf position="top-left" /> : null}

      {/* Could have the type be "kinematicPosition" for just a square shell */}
      <RigidBody type="fixed" colliders="trimesh" friction={0}>
        {/* Load Scene */}
        <mesh
          geometry={nodes.baked.geometry}
          position={nodes.baked.position}
          receiveShadow
        >
          <meshBasicMaterial map={bakedTexture} />
        </mesh>

        {/* Load nexusPillar */}
        <mesh
          ref={nexusPillarRef}
          geometry={nodes.nexusPillar.geometry}
          position={nodes.nexusPillar.position}
        >
          <meshBasicMaterial map={bakedExtra} />
        </mesh>

        {/* Load Floor */}
        <mesh
          geometry={nodes.floorBaked.geometry}
          position={nodes.floorBaked.position}
          receiveShadow
        >
          <meshBasicMaterial map={bakedFloor} />
        </mesh>

        {/* Load Panels */}
        {/* frontEndBaked */}
        <mesh
          geometry={nodes.frontEndBaked.geometry}
          position={nodes.frontEndBaked.position}
        >
          <meshBasicMaterial map={bakedExtra} />
        </mesh>
        {/* backEndBaked */}
        <mesh
          geometry={nodes.backEndBaked.geometry}
          position={nodes.backEndBaked.position}
        >
          <meshBasicMaterial map={bakedExtra} />
        </mesh>

        {/* langBaked */}
        <mesh
          geometry={nodes.langBaked.geometry}
          position={nodes.langBaked.position}
        >
          <meshBasicMaterial map={bakedExtra} />
        </mesh>

        {/* contactBaked */}
        <mesh
          geometry={nodes.contactBaked.geometry}
          position={nodes.contactBaked.position}
        >
          <meshBasicMaterial map={bakedExtra} />
        </mesh>

        {/* Load Panels */}
      </RigidBody>

      {/* Load Nexus Crystal */}
      <mesh
        geometry={nodes.nexusCrystal.geometry}
        position={[
          controls.position.x,
          controls.position.y,
          nodes.nexusCrystal.position.z,
        ]}
        castShadow
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
      {/* Load crystalBall */}
      <mesh
        geometry={nodes.crystalBall.geometry}
        position={nodes.crystalBall.position}
      >
        <crystalBallMaterial ref={crystalBallMaterial} />
      </mesh>

      {/* Load staffGem */}
      <mesh
        geometry={nodes.staffGem.geometry}
        position={nodes.staffGem.position}
      >
        <staffGemMaterial ref={staffGemMaterial} />
      </mesh>

      {/* Load candles */}
      {nodeNames.map((nodeName, index) => {
        if (nodeName.includes("candle")) {
          const geometry = nodes[nodeName].geometry;
          const position = nodes[nodeName].position;

          return (
            <mesh key={index} geometry={geometry} position={position}>
              <candleMaterial ref={candleMaterial} />
            </mesh>
          );
        }
        return null;
      })}

      {/* Load fireBowl (needs update after glb reload) */}
      {nodeNames.map((nodeName, index) => {
        if (nodeName.includes("fireBowl")) {
          const geometry = nodes[nodeName].geometry;
          const position = nodes[nodeName].position;

          return <mesh key={index} geometry={geometry} position={position} />;
        }
        return null;
      })}
    </>
  );
}
