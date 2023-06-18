import React from "react";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

// Custom imports
import Level from "./components/Level";
import Lights from "./components/Lights";
import Player from "./components/Player";
import DebugControls from "./components/DebugControls";

export default function Experience() {
  const controls = DebugControls();

  return (
    <>
      <OrbitControls makeDefault />

      <Physics debug={controls.physicsVisible}>
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}
