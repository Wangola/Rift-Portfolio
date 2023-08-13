import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useState } from "react";
import * as THREE from "three";

function LoadPole({ nodes }) {
  const [activeMesh, setActiveMesh] = useState("banner");

  const handleMeshChange = (meshName) => {
    setActiveMesh(meshName);
  };

  return (
    <>
      <mesh
        geometry={nodes.bannerPole.geometry}
        position={nodes.bannerPole.position}
      >
        <Html>
          <button onClick={() => handleMeshChange("banner")}>
            Show Banner
          </button>
          <button onClick={() => handleMeshChange("bannerExpand")}>
            Show Expand
          </button>
        </Html>
      </mesh>

      <mesh
        geometry={nodes.banner.geometry}
        position={nodes.banner.position}
        visible={activeMesh === "banner"}
      ></mesh>

      <mesh
        geometry={nodes.bannerExpand.geometry}
        position={nodes.bannerExpand.position}
        visible={activeMesh === "bannerExpand"}
      ></mesh>
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
