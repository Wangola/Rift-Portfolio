import React, { useRef } from "react";
import { useTexture, useGLTF } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { RigidBody } from "@react-three/rapier";

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
  BowlMaterial,
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
  BowlMaterial,
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
  const nexusMaterialRef = useRef();
  const projectPortalMaterialRef = useRef();
  const gamePortalMaterialRef = useRef();
  const expPortalMaterialRef = useRef();
  const crystalBallMaterialRef = useRef();
  const staffGemMaterialRef = useRef();

  // Custom rotationSpeed for Pillars
  const nexusPillarRef = useRef();
  const rotationSpeed = 0.3; // Speed of rotation

  // Tick handler
  useFrame((state, delta) => {
    nexusMaterialRef.current.uTime += delta;
    projectPortalMaterialRef.current.uTime += delta;
    gamePortalMaterialRef.current.uTime += delta;
    expPortalMaterialRef.current.uTime += delta;
    crystalBallMaterialRef.current.uTime += delta;
    staffGemMaterialRef.current.uTime += delta;

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
    projectPortalMaterialRef.current.uColorStart.set(
      controls.projectColorStart
    );
    projectPortalMaterialRef.current.uColorEnd.set(controls.projectColorEnd);
    projectPortalMaterialRef.current.uColorPerlin.set(
      controls.projectColorPerlin
    );
    projectPortalMaterialRef.current.uniforms.uDisplacedInt.value =
      controls.projectDisplacedInt;
    projectPortalMaterialRef.current.uniforms.uPerlinInt.value =
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
    gamePortalMaterialRef.current.uColorStart.set(controls.gameColorStart);
    gamePortalMaterialRef.current.uColorEnd.set(controls.gameColorEnd);
    gamePortalMaterialRef.current.uColorPerlin.set(controls.gameColorPerlin);
    gamePortalMaterialRef.current.uniforms.uDisplacedInt.value =
      controls.gameDisplacedInt;
    gamePortalMaterialRef.current.uniforms.uPerlinInt.value =
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
    expPortalMaterialRef.current.uColorStart.set(controls.expColorStart);
    expPortalMaterialRef.current.uColorEnd.set(controls.expColorEnd);
    expPortalMaterialRef.current.uColorPerlin.set(controls.expColorPerlin);
    expPortalMaterialRef.current.uniforms.uDisplacedInt.value =
      controls.expDisplacedInt;
    expPortalMaterialRef.current.uniforms.uPerlinInt.value =
      controls.expPerlinInt;
  }, [
    controls.expColorStart,
    controls.expColorEnd,
    controls.expColorPerlin,
    controls.expDisplacedInt,
    controls.expPerlinInt,
  ]);

  // Update crystalBall property's with Leva control changes
  React.useEffect(() => {
    crystalBallMaterialRef.current.uColorStart.set(controls.crystalColorStart);
    crystalBallMaterialRef.current.uColorEnd.set(controls.crystalColorEnd);
  }, [controls.crystalColorStart, controls.crystalColorEnd]);

  // Update staffGem property's with Leva control changes
  React.useEffect(() => {
    staffGemMaterialRef.current.uColorStart.set(controls.staffColorStart);
    staffGemMaterialRef.current.uColorEnd.set(controls.staffColorEnd);
  }, [controls.staffColorStart, controls.staffColorEnd]);

  /**
   * Candle Material Handler
   */
  // Material array
  const candleMaterialRefs = useRef([]);

  // Update candleMaterial property's with Leva control changes
  React.useEffect(() => {
    candleMaterialRefs.current.forEach(({ material, properties }) => {
      material.current.uColorStart.set(properties.candleColorStart);
      material.current.uColorEnd.set(properties.candleColorEnd);
    });
  }, [controls.candleColorStart, controls.candleColorEnd]);

  /**
   * Fire Bowl Material Handler
   */
  // Material array
  const bowlMaterialRefs = useRef([]);

  // Update bowlMaterial property's with Leva control changes
  React.useEffect(() => {
    bowlMaterialRefs.current.forEach(({ material, properties }) => {
      material.current.uColor.set(properties.bowlColor);
    });
  }, [controls.bowlColor]);

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
        <nexusMaterial ref={nexusMaterialRef} />
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
        <projectPortalMaterial ref={projectPortalMaterialRef} />
      </mesh>
      {/* Load gamePortalEnt */}
      <mesh
        geometry={nodes.gamePortalEnt.geometry}
        position={nodes.gamePortalEnt.position}
      >
        <gamePortalMaterial ref={gamePortalMaterialRef} />
      </mesh>
      {/* Load expPortalEnt */}
      <mesh
        geometry={nodes.expPortalEnt.geometry}
        position={nodes.expPortalEnt.position}
      >
        <expPortalMaterial ref={expPortalMaterialRef} />
      </mesh>
      {/* Load crystalBall */}
      <mesh
        geometry={nodes.crystalBall.geometry}
        position={nodes.crystalBall.position}
      >
        <crystalBallMaterial ref={crystalBallMaterialRef} />
      </mesh>

      {/* Load staffGem */}
      <mesh
        geometry={nodes.staffGem.geometry}
        position={nodes.staffGem.position}
      >
        <staffGemMaterial ref={staffGemMaterialRef} />
      </mesh>

      {/* Load candles */}
      {nodeNames.map((nodeName, index) => {
        if (nodeName.includes("candle")) {
          const geometry = nodes[nodeName].geometry;
          const position = nodes[nodeName].position;

          // Create a new ref for each candle material instance
          const candleMaterialRef = useRef();

          // Store the ref and additional properties in the candleMaterialRefs array
          candleMaterialRefs.current[index] = {
            material: candleMaterialRef,
            properties: {
              candleColorStart: controls.candleColorStart,
              candleColorEnd: controls.candleColorEnd,
            },
          };

          // Update the uTime uniform for each object
          useFrame((state, delta) => {
            candleMaterialRef.current.uTime += delta;
          });

          return (
            <mesh key={index} geometry={geometry} position={position}>
              <candleMaterial ref={candleMaterialRef} />
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

          // Create a new ref for each candle material instance
          const bowlMaterialRef = useRef();

          // Store the ref and additional properties in the candleMaterialRefs array
          bowlMaterialRefs.current[index] = {
            material: bowlMaterialRef,
            properties: {
              bowlColor: controls.bowlColor,
            },
          };

          // Update the uTime uniform for each object
          useFrame((state, delta) => {
            bowlMaterialRef.current.uTime += delta;
          });

          return (
            <mesh key={index} geometry={geometry} position={position}>
              <bowlMaterial ref={bowlMaterialRef} />
            </mesh>
          );
        }
        return null;
      })}
    </>
  );
}
