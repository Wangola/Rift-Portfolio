import React from "react";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

// Custom imports
import Level from "./components/Level";
import Lights from "./components/Lights";
import DebugControls from "./components/DebugControls";
import CharacterMov from "./components/CharacterMov";

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

  return (
    <>
      {controls.orbitActive ? <OrbitControls makeDefault /> : null}

      {/* Old ver needed debug={controls.physicsVisible} */}
      <Physics>
        {/* With latets version of rapier */}
        {controls.physicsVisible ? <Debug /> : null}
        <Lights />
        <Level
          nodes={nodes}
          nodeNames={nodeNames}
          controls={controls}
          bakedTexture={bakedTexture}
          bakedFloor={bakedFloor}
          bakedExtra={bakedExtra}
        />
        <CharacterMov />
      </Physics>
    </>
  );
}
