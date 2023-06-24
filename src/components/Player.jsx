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

  // Used for lerping position and target
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(50, 50, 50)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  // Handle camera rotation and offset (initially have a 45 degree angle)
  const [cameraRotation, setCameraRotation] = useState(Math.PI / 4);
  const [targetCameraRotation, setTargetCameraRotation] = useState(Math.PI / 4);
  const cameraDistance = 6; // Adjust this value to control the camera's distance from the object

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    // Delta will keep same movement no matter framerate
    const impulseStrength = 30 * delta;
    const torqueStrength = 20 * delta;

    // Movement Direction represents the direction in which the player should move foward or backwards based on cam position
    const movementDirection = new THREE.Vector3(
      Math.sin(cameraRotation),
      0,
      Math.cos(cameraRotation)
    );

    // Given direction it is multiplied to the strength to then sub to impulse applied on object.
    if (forward) {
      const forwardImpulse = movementDirection
        .clone()
        .multiplyScalar(impulseStrength);
      impulse.x -= forwardImpulse.x;
      impulse.z -= forwardImpulse.z;
    }

    // Given direction it is multiplied to the strength to then add to impulse applied on object.
    if (backward) {
      const backwardImpulse = movementDirection
        .clone()
        .multiplyScalar(impulseStrength);
      impulse.x += backwardImpulse.x;
      impulse.z += backwardImpulse.z;
    }

    // Given direction mult a perpendicular angle vector and add its impulse
    if (rightward) {
      const rightwardImpulse = new THREE.Vector3(
        -Math.sin(cameraRotation - Math.PI / 2),
        0,
        -Math.cos(cameraRotation - Math.PI / 2)
      ).multiplyScalar(impulseStrength);
      impulse.x += rightwardImpulse.x;
      impulse.z += rightwardImpulse.z;
    }

    // Given direction mult a perpendicular angle vector and sub its impulse
    if (leftward) {
      const leftwardImpulse = new THREE.Vector3(
        -Math.sin(cameraRotation + Math.PI / 2),
        0,
        -Math.cos(cameraRotation + Math.PI / 2)
      ).multiplyScalar(impulseStrength);
      impulse.x += leftwardImpulse.x;
      impulse.z += leftwardImpulse.z;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    /**
     * Camera
     */
    if (!controls.orbitActive) {
      const bodyPosition = body.current.translation();

      // Set amount of rotation on target needed on L or R movement
      if (leftward) {
        setTargetCameraRotation(targetCameraRotation + 0.03); // Increase target rotation angle
      }

      if (rightward) {
        setTargetCameraRotation(targetCameraRotation - 0.03); // Decrease target rotation angle
      }

      // Interpolate camera and its target over time at a fixed refresh rate
      const newCameraRotation = THREE.MathUtils.lerp(
        cameraRotation,
        targetCameraRotation,
        10 * delta
      );

      // Update cameraRotation with the newest rotation
      setCameraRotation(newCameraRotation);

      // Identify camera position based on distance from body and rotation
      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(bodyPosition);
      cameraPosition.x += Math.sin(newCameraRotation) * cameraDistance;
      cameraPosition.z += Math.cos(newCameraRotation) * cameraDistance;
      cameraPosition.y += 4; // Adjust the camera's vertical position if needed

      // Set cameraTarget above body for lookAt
      const cameraTarget = bodyPosition;
      cameraTarget.y += 1;

      // Interpolate current position with new position over time at a fixed refresh rate ( > 10 is faster movement)
      smoothedCameraPosition.lerp(cameraPosition, 10 * delta);
      smoothedCameraTarget.lerp(cameraTarget, 10 * delta);

      // Update camera
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
        <mesh>
          <boxGeometry args={[1, 2]} />
          <meshStandardMaterial flatShading color={"orange"} />
        </mesh>
      </RigidBody>
    </>
  );
}
