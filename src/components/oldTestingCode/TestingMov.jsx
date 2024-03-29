import React, { useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom import
import Character from "./CharacterLoad";

/**
 * Calculate the target rotation for the body based on the camera and character position.
 *
 * @param {Vector3} cameraPosition - Position of the camera
 * @param {Vector3} characterPosition - Position of the character
 * @param {number} additionalRotation - Additional rotation for selected direction
 * @returns {number} Target rotation
 */
function calculateTargetRotation(
  cameraPosition,
  characterPosition,
  additionalRotation
) {
  return (
    Math.atan2(
      cameraPosition.x - characterPosition.x,
      cameraPosition.z - characterPosition.z
    ) + additionalRotation
  );
}

/**
 * Smoothly interpolate the current body rotation towards the target rotation.
 *
 * @param {number} currentRotation - Current body rotation
 * @param {number} targetRotation - Target body rotation
 * @param {number} rotationSpeed - Speed of rotation interpolation
 * @param {number} delta - Time since last frame
 * @returns {number} Smoothed rotation value
 */
function smoothRotation(currentRotation, targetRotation, rotationSpeed, delta) {
  // Calculate the rotation difference
  let rotationDifference = targetRotation - currentRotation;

  // Adjust the rotation difference to choose the shorter path
  if (rotationDifference > Math.PI) {
    rotationDifference -= 2 * Math.PI;
  } else if (rotationDifference < -Math.PI) {
    rotationDifference += 2 * Math.PI;
  }

  return currentRotation + rotationDifference * rotationSpeed * delta;
}

export default function TestingMov() {
  // Ref
  const body = useRef();

  /**
   * Handle Animations
   */
  const [animationName, setAnimationName] = useState("Idle");

  /**
   * subscribeKeys (gets key changes) getKeys (gets key states)
   */
  const [subscribeKeys, getKeys] = useKeyboardControls();

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

  /**
   * Handle Character Rotations Speeds
   */
  // Body rotation speed
  const rotationSpeed = 6;

  // Camera rotation speed
  const cameraTurnSpeed = 0.015;

  useFrame((state, delta) => {
    /**
     * Controls
     */
    const { forward, backward, leftward, rightward, shift } = getKeys();

    /**
     * Speed
     */
    const speed = shift ? 7.5 : 4.5; // Adjust the speed based on whether shift is pressed or not
    let newVelocity = { x: 0, y: 0, z: 0 };

    // Movement Direction represents the direction in which the player should move forward or backward based on the camera's rotation
    const movementDirection = new THREE.Vector3(
      Math.sin(rotationAngle),
      0,
      Math.cos(rotationAngle)
    );

    /**
     * Movement direction
     */
    switch (true) {
      // Handle edge case (where both are pressed stops movement)
      case forward && backward:
        {
          // Handle simultaneous press of "left" and "right" buttons
          newVelocity.x = 0; // No movement in the x-axis
          newVelocity.z = 0; // No movement in the z-axis

          // Set animation name to "Idle"
          setAnimationName("Idle");
        }
        break;

      case (forward && !leftward && !rightward) ||
        (forward && leftward && rightward):
        {
          // Handle forward movement (F)
          newVelocity.x = movementDirection.x * -speed * delta;
          newVelocity.z = movementDirection.z * -speed * delta;

          // Calc target rotation for forward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.position,
            (7 * Math.PI) / 4
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            body.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          body.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");
        }
        break;

      case (backward && !leftward && !rightward) ||
        (backward && leftward && rightward):
        {
          // Handle backward movement (B)
          newVelocity.x = movementDirection.x * speed * delta;
          newVelocity.z = movementDirection.z * speed * delta;

          // Calc target rotation for backward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.position,
            (3 * Math.PI) / 4
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            body.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          body.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");
        }

        break;

      // Handle edge case (where both are pressed stops movement)
      case leftward && rightward:
        {
          // Handle simultaneous press of "left" and "right" buttons
          newVelocity.x = 0; // No movement in the x-axis
          newVelocity.z = 0; // No movement in the z-axis

          // Set animation name to "Idle"
          setAnimationName("Idle");
        }
        break;

      case leftward && !forward && !backward:
        {
          // Handle leftward movement (L)
          newVelocity.x = -movementDirection.z * speed * delta;
          newVelocity.z = movementDirection.x * speed * delta;

          // Calc target rotation for leftward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.position,
            Math.PI / 4
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            body.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          body.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");

          // Apply left camera rotation using cameraTurnSpeed [+ for left]
          setRotationAngle(rotationAngle + cameraTurnSpeed);
        }
        break;

      case rightward && !forward && !backward:
        {
          // Handle rightward movement (R)
          newVelocity.x = movementDirection.z * speed * delta;
          newVelocity.z = -movementDirection.x * speed * delta;

          // Calc target rotation for rightward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.position,
            (5 * Math.PI) / 4
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            body.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          body.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");

          // Apply right camera rotation using cameraTurnSpeed [- for right]
          setRotationAngle(rotationAngle - cameraTurnSpeed);
        }
        break;

      case forward && leftward:
        {
          // Handle simultaneous press of "left" and "forward" buttons (FL)
          newVelocity.x =
            (-movementDirection.x - movementDirection.z) * speed * delta;
          newVelocity.z =
            (-movementDirection.z + movementDirection.x) * speed * delta;

          // Calc target rotation for forward && leftward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.position,
            0
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            body.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          body.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");

          // Apply left camera rotation using cameraTurnSpeed [+ for left]
          setRotationAngle(rotationAngle + cameraTurnSpeed);
        }
        break;

      case forward && rightward:
        {
          // Handle simultaneous press of "left" and "forward" buttons (FR)
          newVelocity.x =
            (movementDirection.x - movementDirection.z) * -speed * delta;
          newVelocity.z =
            (movementDirection.z + movementDirection.x) * -speed * delta;

          // Calc target rotation for forward && rightward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.position,
            (3 * Math.PI) / 2
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            body.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          body.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");

          // Apply right camera rotation using cameraTurnSpeed [- for right]
          setRotationAngle(rotationAngle - cameraTurnSpeed);
        }
        break;

      case backward && leftward:
        {
          // Handle simultaneous press of "right" and "backward" buttons (BL)
          newVelocity.x =
            (movementDirection.x - movementDirection.z) * speed * delta;
          newVelocity.z =
            (movementDirection.z + movementDirection.x) * speed * delta;

          // Calc target rotation for backward && leftward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.position,
            Math.PI / 2
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            body.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          body.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");

          // Apply left camera rotation using cameraTurnSpeed [+ for left]
          setRotationAngle(rotationAngle + cameraTurnSpeed);
        }
        break;

      case backward && rightward:
        {
          // Handle simultaneous press of "left" and "backward" buttons (BR)
          newVelocity.x =
            (-movementDirection.x - movementDirection.z) * -speed * delta;
          newVelocity.z =
            (-movementDirection.z + movementDirection.x) * -speed * delta;

          // Calc target rotation for backward && rightward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.position,
            Math.PI
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            body.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          body.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");

          // Apply right camera rotation using cameraTurnSpeed [- for right]
          setRotationAngle(rotationAngle - cameraTurnSpeed);
        }
        break;

      default:
        // Handle other cases (no movement, etc.)
        newVelocity.x = 0;
        newVelocity.z = 0;
        setAnimationName("Idle");
        break;
    }

    // Apply velocity
    body.current.position.x += newVelocity.x;
    body.current.position.y += newVelocity.y;
    body.current.position.z += newVelocity.z;

    /**
     * Camera
     */
    const bodyPosition = body.current.position;

    // Update camera
    const cameraRotation = THREE.MathUtils.lerp(
      rotationAngle,
      rotationAngle,
      10 * delta
    );

    // Calculate cameras position relative to the body
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.x += Math.sin(cameraRotation) * cameraDistance;
    cameraPosition.z += Math.cos(cameraRotation) * cameraDistance;
    cameraPosition.y += 4; // Adjust the camera's vertical position if needed

    // Position target slightly above character's body
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
      <group ref={body} position={[16, 1.7, 16]}>
        <Character animationName={animationName} />
      </group>
    </>
  );
}
