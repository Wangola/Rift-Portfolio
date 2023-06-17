import React from "react";
import { CapsuleGeometry, MeshStandardMaterial } from "three";
import { RigidBody } from "react-three/rapier";

export default function Player() {
  const geometry = new CapsuleGeometry(1, 1, 16);
  const material = new MeshStandardMaterial({
    flatShading: true,
    color: "aqua",
  });

  return (
    <>
      {/* Add ambient light */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={0.8} />
      {/* Add directional light */}
      <mesh castShadow geometry={geometry} material={material} />
    </>
  );
}
