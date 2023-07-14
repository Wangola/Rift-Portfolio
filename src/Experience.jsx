import React from "react";
import { OrbitControls } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

// Custom imports
import Level from "./components/Level";
import Lights from "./components/Lights";
import DebugControls from "./components/DebugControls";
import CharacterMov from "./components/CharacterMov";

export default function Experience() {
  const controls = DebugControls();

  return (
    <>
      {controls.orbitActive ? <OrbitControls makeDefault /> : null}

      {/* Old ver needed debug={controls.physicsVisible} */}
      <Physics>
        {/* With latets version of rapier */}
        {controls.physicsVisible ? <Debug /> : null}
        <Lights />
        <Level />
        <CharacterMov />
      </Physics>
    </>
  );
}
