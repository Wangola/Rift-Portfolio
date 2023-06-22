import { useRef } from "react";
import { useHelper } from "@react-three/drei";
import * as THREE from "three";

export default function Lights() {
  // const directionalLight = useRef();
  // useHelper(directionalLight, THREE.DirectionalLightHelper, 10);

  return (
    <>
      <directionalLight
        // ref={directionalLight}
        position={[4, 4, 1]}
        intensity={1.5}
      />
      <ambientLight intensity={0.5} />
    </>
  );
}
