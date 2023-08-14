import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";

function LoadPole({ nodes }) {
  const [activeMesh, setActiveMesh] = useState(false);

  const handleMeshChange = (meshState) => {
    setActiveMesh(meshState);
  };

  const bannerRef = useRef();
  const opacityChangeSpeed = 6;

  useFrame((state, delta) => {
    /**
     * ----- Banner transition -----
     */
    const targetContactOpacity = activeMesh ? 1 : 0;
    const currentContactOpacity = bannerRef.current.material.opacity;

    // Animate the banner fade in and out
    const newOpacity = THREE.MathUtils.lerp(
      currentContactOpacity,
      targetContactOpacity,
      opacityChangeSpeed * delta
    );

    bannerRef.current.material.opacity = newOpacity;
  });

  return (
    <>
      <mesh
        geometry={nodes.bannerPole.geometry}
        position={nodes.bannerPole.position}
      >
        <meshBasicMaterial color={"#CD7F32"} />
        <Html>
          <button onClick={() => handleMeshChange(false)}>Show Banner</button>
          <button onClick={() => handleMeshChange(true)}>Show Expand</button>
        </Html>
      </mesh>

      <mesh geometry={nodes.banner.geometry} position={nodes.banner.position}>
        <meshBasicMaterial color={"#FF5733"} />
      </mesh>

      <mesh
        ref={bannerRef}
        geometry={nodes.bannerExpand.geometry}
        position={nodes.bannerExpand.position}
      >
        <meshBasicMaterial color={"#FF5733"} transparent opacity={0} />
      </mesh>
    </>
  );
}

export default function temp() {
  const { nodes } = useGLTF("./model/testing.glb");

  return (
    <>
      <LoadPole nodes={nodes} />
    </>
  );
}
