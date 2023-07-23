import React, { Suspense, useState } from "react";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Physics, Debug } from "@react-three/rapier";

// Custom imports
import Level from "./components/Level";
import Lights from "./components/Lights";
import DebugControls from "./components/DebugControls";
import CharacterMov from "./components/CharacterMov";
import LoadingScreen from "./components/LoadingScreen";
import { Canvas } from "@react-three/fiber";

export default function Experience() {
  const controls = DebugControls();

  const [start, setStart] = useState(false);

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
                <Level />
                <CharacterMov />
              </Physics>
            </>
          )}
        </Suspense>
      </Canvas>
      <LoadingScreen started={start} onStarted={() => setStart(true)} />
    </>
  );
}
