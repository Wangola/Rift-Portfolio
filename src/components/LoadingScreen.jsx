import React, { useEffect, useState } from "react";
import "../style.css";
import { useProgress } from "@react-three/drei";

export default function LoadingScreen({ started, onStarted }) {
  const { progress } = useProgress();

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

  /**
   * Handle screens smaller then 768px or tablet sizes
   */
  // State to track if the screen size is smaller than 768px
  const [isTabletSize, setIsTabletSize] = useState(false);

  // Function to check the screen size and update the state accordingly
  const handleResize = () => {
    setIsTabletSize(window.innerWidth <= 768);
  };

  // Add an event listener to handle screen resize
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Call the function initially to set the initial state

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        className={`loadingScreen ${started ? "loadingScreen-started" : ""}`}
      >
        {/* Conditionally render the disclaimer div for tablet-sized screens */}
        {isTabletSize && (
          <div className="mobile-disclaimer">
            Website is under development and currently only supports PC's or
            laptops keyboard movements.
          </div>
        )}

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

        {/* Loading progress bar */}
        <div className="loadingScreen_progress">
          <div
            className="loadingScreen_progress_value"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </>
  );
}
