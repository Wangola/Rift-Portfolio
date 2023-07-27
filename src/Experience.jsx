import React, { Suspense, useState } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

// Custom imports
import Level from "./components/Level";
import Lights from "./components/Lights";
import DebugControls from "./components/DebugControls";
import CharacterMov from "./components/CharacterMov";
import LoadingScreen from "./components/LoadingScreen";
import { Canvas } from "@react-three/fiber";

export default function Experience() {
  const [start, setStart] = useState(false);

  /**
   * Loading Process (for some reason attempting to bring over the useTexture cause R3F hook errors)
   */
  // Destructure model load
  const { nodes } = useGLTF("./model/baked.glb");

  // Initializing Control Function (Any leva value needed will begin with controls.)
  const controls = DebugControls();

  return (
    <>
      <Canvas camera={{ fov: 75 }}>
        <Suspense fallback={null}>
          {start && (
            <>
              {controls.orbitActive ? <OrbitControls makeDefault /> : null}

              {/* Old ver needed debug={controls.physicsVisible} */}
              <Physics>
                {/* With latets version of rapier */}
                {controls.physicsVisible ? <Debug /> : null}

                <Lights />
                <Level nodes={nodes} controls={controls} />

                {/* Pasing nodes to CharacterMov which calls PopUpHandler needs static 
                positions of Panels */}
                <CharacterMov nodes={nodes} />
              </Physics>
            </>
          )}
        </Suspense>
      </Canvas>
      <LoadingScreen started={start} onStarted={() => setStart(true)} />
    </>
  );
}
