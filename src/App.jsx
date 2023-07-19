import React, { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

// Custom imports
import LoadingScreen from "./components/LoadingScreen";
import Experience from "./Experience";

export default function App() {
  const [start, setStart] = useState(false);

  return (
    <>
      <Canvas camera={{ fov: 75 }}>
        <Suspense fallback={null}>{start && <Experience />}</Suspense>
      </Canvas>
      <LoadingScreen started={start} onStarted={setStart} />
    </>
  );
}
