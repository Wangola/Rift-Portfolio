import React from "react";
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";

// Custom imports
import Level from "./components/Level";
import Lights from "./components/Lights";
import Player from "./components/Player";

export default function Experience() {
  return (
    <>
      <OrbitControls makeDefault />

      <Physics debug>
        <Lights />
        <Level />
        <Player />
      </Physics>
    </>
  );
}
