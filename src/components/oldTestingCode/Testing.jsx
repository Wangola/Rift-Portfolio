import React, { useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * THIS IS IN A GOOD STATE BUT I WANT TO HANDLE MOVEMENT DIFFERENTLY.
 * CREATING ANOTHER FILE TO HANDLE CHARACTER F,B,R,L AND HAVE CAMERA ROTATE BASED ON CHARACTER
 */

// Custom imports
import Character from "../CharacterLoad";

export default function Testing() {
  const body = useRef();
  const bodyRotation = useRef(0);
  /**
   * subscribeKeys (gets key changes) getKeys (gets key states)
   */
  const [subscribeKeys, getKeys] = useKeyboardControls();
  /**
   * Controls
   */
  const { forward, backward, leftward, rightward, shift } = getKeys();

  /**
   * Handle Animations
   */
  const [animationName, setAnimationName] = useState("Idle");

  // Velocity handler
  const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 });

  /**
   * Used for lerping position and target
   */
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(50, 50, 50)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  // Handle camera and body rotation (initially have a 45 degree angle)
  const [rotationAngle, setRotationAngle] = useState(Math.PI / 4);
  const cameraDistance = 5.5; // Adjust this value to control the camera's distance from the object

  useFrame((state, delta) => {
    const speed = shift ? 0.1 : 0.05; // Adjust the speed based on whether shift is pressed or not
    let newVelocity = { x: 0, y: 0, z: 0 };

    // Movement Direction represents the direction in which the player should move forward or backward based on the camera's rotation
    const movementDirection = new THREE.Vector3(
      Math.sin(rotationAngle),
      0,
      Math.cos(rotationAngle)
    );

    /**
     * Handle Forward or left movement
     */

    if (forward || backward) {
      // Apply the desired velocity (forward or backward)
      const speedMultiplier = forward ? -speed : speed;
      newVelocity = movementDirection.multiplyScalar(speedMultiplier);
      setAnimationName(shift ? "Run" : "Walk"); // Set animation to "Run" when shift is pressed, otherwise "Walk"
    }

    /**
     * Handle Leftward and Rightward movement but do not move if both are clicked
     */
    if ((leftward && !rightward) || (!leftward && rightward)) {
      // Validate torque Direction
      const torqueDirection = leftward ? 1 : -1;
      const torqueStrength = 0.01; // Adjust the torque strength as needed

      // Calculate the rotation angle and movement direction
      const newRotationAngle =
        rotationAngle + (leftward ? -Math.PI / 2 : Math.PI / 2);
      const sideDirection = new THREE.Vector3(
        Math.cos(newRotationAngle),
        0,
        -Math.sin(newRotationAngle)
      );

      // Apply the desired velocity
      const speedMultiplier = leftward ? -speed : speed;
      newVelocity = sideDirection.multiplyScalar(speedMultiplier);

      // Apply torque to the body
      bodyRotation.current += torqueDirection * torqueStrength;

      setAnimationName(shift ? "Run" : "Walk"); // Set animation to "Run" when shift is pressed, otherwise "Walk"
    }

    /**
     * Handle Idle animation if nothing is clicked
     */
    if (!forward && !backward && !leftward && !rightward) {
      setAnimationName("Idle");
    }

    // Apply velocity
    body.current.position.x += newVelocity.x;
    body.current.position.y += newVelocity.y;
    body.current.position.z += newVelocity.z;

    setVelocity(newVelocity); // Update velocity state

    /**
     * Camera
     */
    const bodyPosition = body.current.position;

    // Set amount of rotation on target needed on L or R movement
    if (leftward) {
      setRotationAngle(rotationAngle + 0.01); // Increase rotation angle
    }

    if (rightward) {
      setRotationAngle(rotationAngle - 0.01); // Decrease rotation angle
    }

    // Interpolate camera and its target over time at a fixed refresh rate
    const cameraRotation = THREE.MathUtils.lerp(
      rotationAngle,
      rotationAngle,
      10 * delta
    );

    // Update camera
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.x += Math.sin(cameraRotation) * cameraDistance;
    cameraPosition.z += Math.cos(cameraRotation) * cameraDistance;
    cameraPosition.y += 4; // Adjust the camera's vertical position if needed

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    // Interpolate current position with new position over time at a fixed refresh rate ( > 10 is faster movement)
    smoothedCameraPosition.lerp(cameraPosition, 10 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 10 * delta);

    // Update camera
    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);
  });

  return (
    <>
      <group
        ref={body}
        position={[16, 1.7, 16]}
        rotation={[0, bodyRotation.current, 0]}
      >
        <Character animationName={animationName} />
      </group>
    </>
  );
}
