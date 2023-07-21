import React, { useState } from "react";
import { Html } from "@react-three/drei";

export default function LoadingTest({ onStarted }) {
  const [showButton, setShowButton] = useState(true);

  const handleStartClick = () => {
    setShowButton(false);
    onStarted(); // Call the onStarted prop to transition to the rest of the experience
  };

  return (
    <Html>
      {showButton && <button onClick={handleStartClick}>Spawn</button>}
    </Html>
  );
}
