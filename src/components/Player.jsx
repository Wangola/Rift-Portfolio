import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useState, useRef } from "react";
import * as THREE from "three";

// Custom Imports
import DebugControls from "./DebugControls";

export default function Player() {
  // Import orbitControls check to remove lock on camera
  const controls = new DebugControls();

  const body = useRef();
  // subscribeKeys (gets key changes) getKeys (gets key states)
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(50, 50, 50)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    // Delta will keep same movement no matter framerate
    const impulseStrength = 40 * delta;
    const torqueStrength = 20 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      // torque.x -= torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      // torque.z -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      // torque.z += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      // torque.z += torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    /**
     * Camera
     */
    if (!controls.orbitActive) {
      const bodyPosition = body.current.translation();

      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(bodyPosition);
      cameraPosition.z += 3.5;
      cameraPosition.x += 5;
      cameraPosition.y += 4;

      const cameraTarget = new THREE.Vector3();
      cameraTarget.copy(bodyPosition);
      cameraTarget.y -= 0.25;

      smoothedCameraPosition.lerp(cameraPosition, 10 * delta);
      smoothedCameraTarget.lerp(cameraTarget, 10 * delta);

      state.camera.position.copy(smoothedCameraPosition);
      state.camera.lookAt(smoothedCameraTarget);
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders="cuboid"
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
        position={[16, 3.5, 16]}
      >
        <mesh castShadow>
          <boxGeometry args={[1, 2]} />
          <meshStandardMaterial flatShading color={"orange"} />
        </mesh>
      </RigidBody>
    </>
  );
}
