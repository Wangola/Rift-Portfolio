import React, { StrictMode } from "react";
import "./style.css";
import { createRoot } from "react-dom/client";
import { KeyboardControls } from "@react-three/drei";

// Custom imports
import Experience from "./Experience";

const root = createRoot(document.querySelector("#root"));

// R3F takes the canvas size of its parent (#root)
root.render(
  <StrictMode>
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "shift", keys: ["Shift"] },
        { name: "jump", keys: ["Space"] },
        { name: "interact", keys: ["KeyE"] },
      ]}
    >
      <Experience />
    </KeyboardControls>
  </StrictMode>
);
