import React, { Suspense, useEffect, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";

// Custom imports
import Level from "./components/Level";
import Lights from "./components/Lights";
import DebugControls from "./components/DebugControls";
import CharacterMov from "./components/CharacterMov";
import LoadingScreen from "./components/LoadingScreen";

export default function Experience() {
  // State for once spawn button is selected
  const [start, setStart] = useState(false);

  // Function to play the audio
  const playAudio = () => {
    // Trickling Up - Godmode || Somnia II - Reed Mathis
    const audio = new Audio("./audios/Trickling Up - Godmode.mp3");
    audio.loop = true;
    audio.volume = 0.15;
    audio.play();
  };

  // Play audio
  useEffect(() => {
    if (start) {
      playAudio();
    }
  }, [start]);

  /**
   * Loading Process (for some reason attempting to bring over the useTexture cause R3F hook errors)
   */
  // Destructure model load
  const { nodes } = useGLTF("./model/baked.glb");

  // Initializing Control Function (Any leva value needed will begin with controls.)
  const controls = DebugControls();

  return (
    <>
      {/* Conditionally render Leva only when needed */}
      <Leva collapsed hidden={window.location.hash !== "#debug"} />

      <Canvas camera={{ fov: 75 }}>
        <Suspense fallback={null}>
          {start && (
            <>
              {controls.orbitActive ? <OrbitControls makeDefault /> : null}

              {/* Inject perf */}
              {controls.perfVisible ? <Perf position="top-left" /> : null}

              {/* Old ver needed debug={controls.physicsVisible} */}
              <Physics>
                {/* With latets version of rapier */}
                {controls.physicsVisible ? <Debug /> : null}

                <Lights controls={controls} />
                <Level nodes={nodes} controls={controls} />

                {/* Pasing nodes to CharacterMov which calls PopUpHandler needs static 
                positions of Panels */}
                <CharacterMov nodes={nodes} controls={controls} />
              </Physics>
            </>
          )}
        </Suspense>
      </Canvas>
      <LoadingScreen started={start} onStarted={() => setStart(true)} />
    </>
  );
}
