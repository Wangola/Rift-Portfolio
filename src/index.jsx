import React from "react";
import "./style.css";
import { createRoot } from "react-dom/client";
import { KeyboardControls, Loader } from "@react-three/drei";

// Custom imports
import { Leva } from "leva";
import { StrictMode } from "react";
import App from "./App";

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
      <App />
    </KeyboardControls>
  </StrictMode>
);
