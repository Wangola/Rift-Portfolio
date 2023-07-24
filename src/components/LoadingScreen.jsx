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
  const handleStartClick = () => {
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
      </div>
    </>
  );
}
