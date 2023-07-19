import { useProgress } from "@react-three/drei";
import React from "react";
import "../style.css";

export default function LoadingScreen({ started, onStarted }) {
  const { progress } = useProgress();

  return (
    <div className={`loadingScreen ${started ? "loadingScreen-started" : ""}`}>
      <div className="loadingScreen_content">
        <div className="loadingScreen_block">
          <h1 className="loadingScreen_title"> Movement Controls</h1>
        </div>
      </div>
      <div className="loadingScreen_gridBlock">
        <div className="loadingScreen_grid">
          <div className="loadingScreen_grid_row">
            <div className="loadingScreen_grid_cell">W - Forward</div>
          </div>
          <div className="loadingScreen_grid_row">
            <div className="loadingScreen_grid_cell">S - Backward</div>
          </div>
          <div className="loadingScreen_grid_row">
            <div className="loadingScreen_grid_cell">A - Left</div>
          </div>
          <div className="loadingScreen_grid_row">
            <div className="loadingScreen_grid_cell">D - Right</div>
          </div>
          <div className="loadingScreen_grid_row">
            <div className="loadingScreen_grid_cell">Shift - Run</div>
          </div>
          <div className="loadingScreen_grid_row">
            <div className="loadingScreen_grid_cell">Spacebar - Jump</div>
          </div>
        </div>
      </div>
      <button
        className="loadingScreen_button"
        disabled={progress === 100}
        onClick={onStarted}
      >
        Spawn
      </button>
      <div className="loadingScreen_progress">
        <div
          className="loadingScreen_progress_value"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
