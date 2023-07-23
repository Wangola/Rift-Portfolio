import React, { useEffect, useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";

// Custom imports
import { BackgroundMaterial } from "./Shaders";
import DebugControls from "./DebugControls";

/**
 * Extend is needed for material usage (Shaders.jsx utilizes shaderMaterial)
 */
extend({
  BackgroundMaterial,
});

export default function IntroScreen({ onStarted }) {
  // Initializing Control Function (Any leva value needed will begin with controls.)
  const controls = DebugControls();

  /**
   * Handle intro text
   */
  const [introCompleted, setIntroCompleted] = useState(false);

  // Function to handle the intro animation completion
  const handleIntroAnimationComplete = () => {
    setIntroCompleted(true);
  };

  // Function to start the intro animation with a delay of 2.5 second
  useEffect(() => {
    const timer = setTimeout(handleIntroAnimationComplete, 2500);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Handle Spawn info
   */
  const [showSpawn, setShowSpawn] = useState(true);

  const handleStartClick = () => {
    setShowSpawn(false);

    onStarted(); // Call the onStarted prop to transition to the rest of the experience
  };

  /**
   * Shader material information
   */
  const backgroundMaterialRef = useRef();

  // Viewport size
  const { viewport } = useThree();
  const width = viewport.width;
  const height = viewport.height;

  // Animate Material
  useFrame((state, delta) => {
    backgroundMaterialRef.current.uTime += delta;
  });

  /**
   * UseEffect updates for shader
   */
  // Update staffGem property's with Leva control changes
  useEffect(() => {
    backgroundMaterialRef.current.uColorStart.set(
      controls.backgroundColorStart
    );
    backgroundMaterialRef.current.uColorEnd.set(controls.backgroundColorEnd);
  }, [controls.backgroundColorStart, controls.backgroundColorEnd]);

  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <backgroundMaterial ref={backgroundMaterialRef} />
      </mesh>

      <Html center>
        {/* "Welcome to my Portfolio" text (if completed hide) else stay*/}
        <div className={`intro-text ${introCompleted ? "hidden" : ""}`}>
          Welcome to my Portfolio!
        </div>
      </Html>

      <Html center>
        {/* Intructions (if completed show) else hide*/}

        <>
          <div
            className={`controls-container-wrapper ${
              introCompleted ? "" : "hidden"
            }`}
          >
            <div className="movement-text">Movement Controls</div>
            {/* Movement controls box */}
            <div className={`movement-controls`}>
              <div className="controls-container">
                <div className="controls-row">
                  <div
                    className={`controls-cell ${
                      introCompleted ? "active" : ""
                    }`}
                  >
                    W - Forward
                  </div>
                </div>
                <div className="controls-row">
                  <div
                    className={`controls-cell ${
                      introCompleted ? "active" : ""
                    }`}
                  >
                    S - Backward
                  </div>
                </div>
                <div className="controls-row">
                  <div
                    className={`controls-cell ${
                      introCompleted ? "active" : ""
                    }`}
                  >
                    A - Left
                  </div>
                </div>
                <div className="controls-row">
                  <div
                    className={`controls-cell ${
                      introCompleted ? "active" : ""
                    }`}
                  >
                    D - Right
                  </div>
                </div>
                <div className="controls-row">
                  <div
                    className={`controls-cell ${
                      introCompleted ? "active" : ""
                    }`}
                  >
                    Shift - Run
                  </div>
                </div>
                <div className="controls-row">
                  <div
                    className={`controls-cell ${
                      introCompleted ? "active" : ""
                    }`}
                  >
                    Spacebar - Jump
                  </div>
                </div>
              </div>
            </div>

            {/* Spawn button */}
            <button
              className={`intro-button ${introCompleted ? "" : "hidden"}`}
              onClick={handleStartClick}
            >
              Spawn
            </button>
          </div>
        </>
      </Html>
    </group>
  );
}
