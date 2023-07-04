import React from "react";
import { OrbitControls } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

// Custom imports
import Level from "./components/Level";
import Lights from "./components/Lights";
import Player from "./components/Player";
import DebugControls from "./components/DebugControls";
import Character from "./components/Character";
import Testing from "./components/Testing";

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
        {/* <Player /> */}
        <Testing />
      </Physics>
    </>
  );
}
