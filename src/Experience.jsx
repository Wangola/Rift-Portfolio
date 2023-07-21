import React, { useState } from "react";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

// Custom imports
import Level from "./components/Level";
import Lights from "./components/Lights";
import DebugControls from "./components/DebugControls";
import CharacterMov from "./components/CharacterMov";
import LoadingTest from "./components/LoadingTest";

export default function Experience() {
  const controls = DebugControls();

  /**
   * State to handle the transition
   */
  const [isLoading, setIsLoading] = useState(true);

  // Handler function for the "Start" button click
  const handleStarted = () => {
    setIsLoading(false); // Update the state to stop showing the loading screen
  };

  return (
    <>
      {isLoading ? (
        // Show the loading screen until the user clicks "Start"
        <LoadingTest onStarted={handleStarted} />
      ) : (
        // Once the user clicks "Start", show the rest of the experience
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
      )}
    </>
  );
}
