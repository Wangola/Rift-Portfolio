import React from "react";
import { Canvas } from "@react-three/fiber";
import "./style.css";
import { createRoot } from "react-dom/client";
import { KeyboardControls } from "@react-three/drei";

// Custom imports
import Experience from "./Experience";
import { Leva } from "leva";
import { StrictMode } from "react";

const root = createRoot(document.querySelector("#root"));

// R3F takes the canvas size of its parent (#root)
root.render(
  <StrictMode>
    <Leva collapsed />
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "shift", keys: ["Shift"] },
        { name: "jump", keys: ["Space"] },
      ]}
    >
      <Canvas camera={{ fov: 75, position: [20.5, 5.5, 20.5] }}>
        <Experience />
      </Canvas>
    </KeyboardControls>
  </StrictMode>
);
