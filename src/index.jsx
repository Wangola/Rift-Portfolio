import { Canvas } from "@react-three/fiber";
import "./style.css";
import { createRoot } from "react-dom/client";
// Custom imports
import Experience from "./Experience";

const root = createRoot(document.querySelector("#root"));

// R3F takes the canvas size of its parent (#root)
root.render(
  <Canvas camera={{ fov: 75, position: [4.5, 1.5, 8] }}>
    <Experience />
  </Canvas>
);
