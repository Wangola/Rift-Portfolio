import React from "react";
import { Canvas } from "@react-three/fiber";
import "./style.css";
import { createRoot } from "react-dom/client";
// Custom imports
import Experience from "./Experience";
import { Leva } from "leva";
import { StrictMode } from "react";

const root = createRoot(document.querySelector("#root"));

// R3F takes the canvas size of its parent (#root)
root.render(
  <StrictMode>
    <Leva collapsed />
    <Canvas camera={{ fov: 75, position: [15.5, 5.5, 15.5] }}>
      <Experience />
    </Canvas>
  </StrictMode>
);
