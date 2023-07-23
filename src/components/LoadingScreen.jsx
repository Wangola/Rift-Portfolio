import React, { useEffect, useState } from "react";
import "../style.css";

export default function LoadingScreen({ started, onStarted }) {
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

  return (
    <>
      <div
        className={`loadingScreen ${started ? "loadingScreen-started" : ""}`}
      >
        {/* "Welcome to my Portfolio" text (if completed hide) else stay*/}
        <div className={`intro-text ${introCompleted ? "hidden" : ""}`}>
          Welcome to my Portfolio!
        </div>

        <>
          <div
            className={`controls-container-wrapper ${
              introCompleted ? "" : "hidden"
            }`}
          >
            {/* Spawn button */}
            <button onClick={handleStartClick}>Spawn</button>
          </div>
        </>
      </div>
    </>
  );
}
