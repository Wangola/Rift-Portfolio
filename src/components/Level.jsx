import React, { useRef, useEffect } from "react";
import { useTexture, Float } from "@react-three/drei";
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

function EnvLoad({ nodes, bakedTexture, bakedExtra, bakedFloor }) {
  /**
   * Custom rotationSpeed for Pillars
   */
  const nexusPillarRef = useRef();
  const rotationSpeed = 0.3; // Speed of rotation

  useFrame(() => {
    // Update rotation
    if (nexusPillarRef.current) {
      nexusPillarRef.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  return (
    <>
      {/* Load Scene */}
      <mesh geometry={nodes.baked.geometry} position={nodes.baked.position}>
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
      >
        <meshBasicMaterial map={bakedFloor} />
      </mesh>
    </>
  );
}

function PanelsLoad({ nodes, bakedExtra }) {
  return (
    <>
      {/* frontEndBaked */}
      <Float speed={3} rotationIntensity={0.1}>
        <mesh
          geometry={nodes.frontEndBaked.geometry}
          position={nodes.frontEndBaked.position}
        >
          <meshBasicMaterial map={bakedExtra} />
        </mesh>
      </Float>

      {/* backEndBaked */}
      <Float speed={4} rotationIntensity={0.15}>
        <mesh
          geometry={nodes.backEndBaked.geometry}
          position={nodes.backEndBaked.position}
        >
          <meshBasicMaterial map={bakedExtra} />
        </mesh>
      </Float>

      {/* langBaked */}
      <Float speed={3} rotationIntensity={0.1}>
        <mesh
          geometry={nodes.langBaked.geometry}
          position={nodes.langBaked.position}
        >
          <meshBasicMaterial map={bakedExtra} />
        </mesh>
      </Float>

      {/* Contact panel is loaded in PopUpHandler called in CharacterMov.jsx (had to have panel float animation match social media boxes) */}
    </>
  );
}

function MiscLoad({ nodes, bakedMisc }) {
  return (
    <>
      {/* Misc left */}
      <mesh
        geometry={nodes.miscLeftBaked.geometry}
        position={nodes.miscLeftBaked.position}
      >
        <meshBasicMaterial map={bakedMisc} />
      </mesh>

      {/* Misc right */}
      <mesh
        geometry={nodes.miscRightBaked.geometry}
        position={nodes.miscRightBaked.position}
      >
        <meshBasicMaterial map={bakedMisc} />
      </mesh>
    </>
  );
}

function LandscapeLoad({ nodes, bakedFloor }) {
  return (
    <>
      {/* Landscape load */}
      <mesh
        geometry={nodes.floorLandScape.geometry}
        position={nodes.floorLandScape.position}
      >
        <meshBasicMaterial map={bakedFloor} />
      </mesh>
    </>
  );
}

function NexusCrystalLoad({ nodes, controls }) {
  /**
   * Animation Info
   */
  const nexusMaterialRef = useRef();

  // Tick handler
  useFrame((state, delta) => {
    nexusMaterialRef.current.uTime += delta;
  });

  return (
    <>
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
        <nexusMaterial ref={nexusMaterialRef} />
      </mesh>
    </>
  );
}

function SignNamesLoad({ nodes }) {
  return (
    <>
      {/* Load signNames */}
      <mesh
        geometry={nodes.signNames.geometry}
        position={nodes.signNames.position}
      ></mesh>
    </>
  );
}

function PortalsLoad({ nodes, controls }) {
  /**
   * Animation Info
   */
  const projectPortalMaterialRef = useRef();
  const gamePortalMaterialRef = useRef();
  const expPortalMaterialRef = useRef();

  // Tick handler
  useFrame((state, delta) => {
    projectPortalMaterialRef.current.uTime += delta;
    gamePortalMaterialRef.current.uTime += delta;
    expPortalMaterialRef.current.uTime += delta;
  });

  /**
   * UseEffect updates
   */
  // Update projectPortal property's with Leva control changes
  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
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

  return (
    <>
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
    </>
  );
}

function CrystalBallLoad({ nodes, controls }) {
  /**
   * Animation Info
   */
  const crystalBallMaterialRef = useRef();

  // Tick handler
  useFrame((state, delta) => {
    crystalBallMaterialRef.current.uTime += delta;
  });

  /**
   * UseEffect updates
   */

  // Update crystalBall property's with Leva control changes
  useEffect(() => {
    crystalBallMaterialRef.current.uColorStart.set(controls.crystalColorStart);
    crystalBallMaterialRef.current.uColorEnd.set(controls.crystalColorEnd);
  }, [controls.crystalColorStart, controls.crystalColorEnd]);

  return (
    <>
      {/* Load crystalBall */}
      <mesh
        geometry={nodes.crystalBall.geometry}
        position={nodes.crystalBall.position}
      >
        <crystalBallMaterial ref={crystalBallMaterialRef} />
      </mesh>
    </>
  );
}

function StaffGemLoad({ nodes, controls }) {
  /**
   * Animation Info
   */
  const staffGemMaterialRef = useRef();

  // Tick handler
  useFrame((state, delta) => {
    staffGemMaterialRef.current.uTime += delta;
  });

  /**
   * UseEffect updates
   */
  // Update staffGem property's with Leva control changes
  useEffect(() => {
    staffGemMaterialRef.current.uColorStart.set(controls.staffColorStart);
    staffGemMaterialRef.current.uColorEnd.set(controls.staffColorEnd);
  }, [controls.staffColorStart, controls.staffColorEnd]);

  return (
    <>
      {/* Load staffGem */}
      <mesh
        geometry={nodes.staffGem.geometry}
        position={nodes.staffGem.position}
      >
        <staffGemMaterial ref={staffGemMaterialRef} />
      </mesh>
    </>
  );
}

function CandlesLoad({ nodes, nodeNames, controls }) {
  /**
   * Candle Material Handler
   */
  // Material array
  const candleMaterialRefs = useRef([]);

  // Update candleMaterial property's with Leva control changes
  useEffect(() => {
    candleMaterialRefs.current.forEach(({ material, properties }) => {
      material.current.uColorStart.set(properties.candleColorStart);
      material.current.uColorEnd.set(properties.candleColorEnd);
    });
  }, [controls.candleColorStart, controls.candleColorEnd]);

  return (
    <>
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
    </>
  );
}

function BowlsLoad({ nodes, nodeNames, controls }) {
  /**
   * Fire Bowl Material Handler
   */
  // Material array
  const bowlMaterialRefs = useRef([]);

  // Update bowlMaterial property's with Leva control changes
  useEffect(() => {
    bowlMaterialRefs.current.forEach(({ material, properties }) => {
      material.current.uColor.set(properties.bowlColor);
    });
  }, [controls.bowlColor]);

  return (
    <>
      {/* Load fireBowl */}
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

export default function Level({ nodes, controls }) {
  /**
   * Load Textures
   */
  // Area
  const bakedTexture = useTexture("./model/bakedArea.jpg");
  bakedTexture.flipY = false;

  // Floor
  const bakedFloor = useTexture("./model/bakedFloor.jpg");
  bakedFloor.flipY = false;

  // Panels
  const bakedExtra = useTexture("./model/bakedExtra.jpg");
  bakedExtra.flipY = false;

  // Items / Signs
  const bakedMisc = useTexture("./model/bakedMiscItems.jpg");
  bakedMisc.flipY = false;

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
  return (
    <>
      <color args={[controls.backgroundColor]} attach={"background"} />

      {/* Could have the type be "kinematicPosition" for just a square shell */}
      <RigidBody type="fixed" colliders="trimesh" friction={0}>
        <EnvLoad
          nodes={nodes}
          bakedTexture={bakedTexture}
          bakedExtra={bakedExtra}
          bakedFloor={bakedFloor}
        />

        <MiscLoad nodes={nodes} bakedMisc={bakedMisc} />

        <PanelsLoad nodes={nodes} bakedExtra={bakedExtra} />
      </RigidBody>

      <LandscapeLoad nodes={nodes} bakedFloor={bakedFloor} />

      <NexusCrystalLoad nodes={nodes} controls={controls} />

      <SignNamesLoad nodes={nodes} />

      <PortalsLoad nodes={nodes} controls={controls} />

      <CrystalBallLoad nodes={nodes} controls={controls} />

      <StaffGemLoad nodes={nodes} controls={controls} />

      <CandlesLoad nodes={nodes} nodeNames={nodeNames} controls={controls} />

      <BowlsLoad nodes={nodes} nodeNames={nodeNames} controls={controls} />
    </>
  );
}
