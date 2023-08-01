import { useRef } from "react";

// For helpers
import { useHelper, Sky } from "@react-three/drei";
import * as THREE from "three";

export default function Lights({ controls }) {
  // Helpers (Uncomment useHelpers if you want to see directionalLights)
  const directionalLightBehind = useRef();
  // useHelper(directionalLightBehind, THREE.DirectionalLightHelper, 5);

  const directionalLightFront = useRef();
  // useHelper(directionalLightFront, THREE.DirectionalLightHelper, 5);

  return (
    <>
      <directionalLight
        ref={directionalLightBehind}
        position={[20, 12, 20]}
        intensity={1.2}
      />

      <directionalLight
        ref={directionalLightFront}
        position={[-10, 12, -10]}
        intensity={0.5}
      />
      <ambientLight intensity={0.5} />

      {controls.sunVisible ? <Sky sunPosition={controls.sunPosition} /> : null}
    </>
  );
}
