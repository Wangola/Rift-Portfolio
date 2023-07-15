import React, { useEffect, useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RigidBody, useRapier } from "@react-three/rapier";

// Custom import
import DebugControls from "./DebugControls";
import Character from "./CharacterLoad";
import useScene from "../stores/useScene";

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

export default function TestingPhysics() {
  // Ref
  const controls = new DebugControls();
  const body = useRef();
  const character = useRef();

  /**
   * subscribeKeys (gets key changes) getKeys (gets key states)
   */
  const [subscribeKeys, getKeys] = useKeyboardControls();
  // Phases
  const start = useScene((state) => state.start);
  const restart = useScene((state) => state.restart);

  /**
   * Raycaster/Phases Setup
   */
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  // Jump
  const jump = () => {
    // Simple jump every 0.55 seconds
    body.current.applyImpulse({ x: 0, y: 2.5, z: 0 });

    /**
     * Would of used this raycaster if origin of character was not unknown and loaded mesh
     * objects were not hollow due to missing faces of face orientation from import.
     */
    // const origin = body.current.translation();
    // origin.y += 0.005;
    // const direction = { x: 0, y: -1, z: 0 };

    // const ray = new rapier.Ray(origin, direction);
    // const hit = rapierWorld.castRay(ray, 10, true);
    // console.log(hit.toi);

    // if (hit.toi < 0.1) {
    //   body.current.applyImpulse({ x: 0, y: 2.5, z: 0 });
    // }
  };

  const reset = () => {
    body.current.setTranslation({ x: 16, y: 1.7, z: 16 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
    setRotationAngle(Math.PI / 4);
  };

  /**
   * Selector for subscribeKeys used for Jump press and Phases
   */
  useEffect(() => {
    let timer = null;

    // Defining phase
    const unsubscribeReset = useScene.subscribe(
      (state) => state.phase,
      (phase) => {
        if (phase == "ready") {
          reset();
        }
      }
    );

    // Jumping
    const unsubscribeJump = subscribeKeys(
      (state) => {
        return state.jump;
      },
      (value) => {
        if (value && !timer) {
          jump();
          timer = setTimeout(() => {
            timer = null;
          }, 500); // Set cooldown to 0.50 second (500 milliseconds)
        }
      }
    );

    // Phase Handler
    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    return () => {
      clearTimeout(timer);
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAny();
    };
  }, []);

  /**
   * Handle Animations
   */
  const [animationName, setAnimationName] = useState("Idle");

  /**
   * Used for lerping position and target
   */
  const [smoothedCameraPosition] = useState(
    () => new THREE.Vector3(50, 50, 50)
  );
  const [smoothedCameraTarget] = useState(() => new THREE.Vector3());

  // Handle camera and body rotation (initially have a 45 degree angle)
  const [rotationAngle, setRotationAngle] = useState(Math.PI / 4);
  const cameraDistance = 5; // Adjust this value to control the camera's distance from the object

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
    const speed = shift ? 8.5 : 6; // Adjust the speed based on whether shift is pressed or not
    const impulse = { x: 0, y: 0, z: 0 };

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
          impulse.x = 0; // No movement in the x-axis
          impulse.z = 0; // No movement in the z-axis
          // Set animation name to "Idle"
          setAnimationName("Idle");
        }
        break;

      case (forward && !leftward && !rightward) ||
        (forward && leftward && rightward):
        {
          // Handle forward movement (F)
          impulse.x = movementDirection.x * -speed * delta;
          impulse.z = movementDirection.z * -speed * delta;

          // Calc target rotation for forward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.translation(),
            (7 * Math.PI) / 4
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            character.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          character.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");
        }
        break;

      case (backward && !leftward && !rightward) ||
        (backward && leftward && rightward):
        {
          // Handle backward movement (B)
          impulse.x = movementDirection.x * speed * delta;
          impulse.z = movementDirection.z * speed * delta;

          // Calc target rotation for backward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.translation(),
            (3 * Math.PI) / 4
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            character.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          character.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");
        }
        break;

      // Handle edge case (where both are pressed stops movement)
      case leftward && rightward:
        {
          // Handle simultaneous press of "left" and "right" buttons
          impulse.x = 0; // No movement in the x-axis
          impulse.z = 0; // No movement in the z-axis

          // Set animation name to "Idle"
          setAnimationName("Idle");
        }
        break;

      case leftward && !forward && !backward:
        {
          // Handle leftward movement (L)
          impulse.x = -movementDirection.z * speed * delta;
          impulse.z = movementDirection.x * speed * delta;

          // Calc target rotation for leftward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.translation(),
            Math.PI / 4
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            character.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          character.current.rotation.y =
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
          impulse.x = movementDirection.z * speed * delta;
          impulse.z = -movementDirection.x * speed * delta;

          // Calc target rotation for rightward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.translation(),
            (5 * Math.PI) / 4
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            character.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          character.current.rotation.y =
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
          impulse.x =
            (-movementDirection.x - movementDirection.z) * speed * delta;
          impulse.z =
            (-movementDirection.z + movementDirection.x) * speed * delta;

          // Calc target rotation for forward && leftward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.translation(),
            0
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            character.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          character.current.rotation.y =
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
          impulse.x =
            (movementDirection.x - movementDirection.z) * -speed * delta;
          impulse.z =
            (movementDirection.z + movementDirection.x) * -speed * delta;

          // Calc target rotation for forward && rightward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.translation(),
            (3 * Math.PI) / 2
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            character.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          character.current.rotation.y =
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
          impulse.x =
            (movementDirection.x - movementDirection.z) * speed * delta;
          impulse.z =
            (movementDirection.z + movementDirection.x) * speed * delta;

          // Calc target rotation for backward && leftward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.translation(),
            Math.PI / 2
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            character.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          character.current.rotation.y =
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
          impulse.x =
            (-movementDirection.x - movementDirection.z) * -speed * delta;
          impulse.z =
            (-movementDirection.z + movementDirection.x) * -speed * delta;

          // Calc target rotation for backward && rightward
          const targetRotation = calculateTargetRotation(
            state.camera.position,
            body.current.translation(),
            Math.PI
          );

          // Interpolate current with target
          const smoothedRotation = smoothRotation(
            character.current.rotation.y,
            targetRotation,
            rotationSpeed,
            delta
          );

          // Keep the rotation within the range of 0 and 2π
          character.current.rotation.y =
            (2 * Math.PI + smoothedRotation) % (2 * Math.PI);

          // Set animation name based on movement speed
          setAnimationName(shift ? "Run" : "Walk");

          // Apply right camera rotation using cameraTurnSpeed [- for right]
          setRotationAngle(rotationAngle - cameraTurnSpeed);
        }
        break;

      default:
        // Handle other cases (no movement, etc.)
        impulse.x = 0;
        impulse.z = 0;
        setAnimationName("Idle");
        break;
    }

    // Apply impulse on character
    body.current.applyImpulse(impulse);

    // Body position for both Camera and phases
    const bodyPosition = body.current.translation();

    /**
     * Camera
     */
    if (!controls.orbitActive) {
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
      cameraTarget.y += 1;

      // Interpolate current position with new position over time at a fixed refresh rate ( > 10 is faster movement)
      smoothedCameraPosition.lerp(cameraPosition, 10 * delta);
      smoothedCameraTarget.lerp(cameraTarget, 10 * delta);

      // Update camera
      state.camera.position.copy(smoothedCameraPosition);
      state.camera.lookAt(smoothedCameraTarget);
    }

    /**
     * Phases
     */
    if (bodyPosition.y < -2) {
      restart();
    }
  });
  return (
    <>
      <group position={[16, 1.7, 16]}>
        <RigidBody
          ref={body}
          colliders="hull"
          friction={1.25}
          linearDamping={1.25}
          angularDamping={1.25}
          enabledRotations={[false, false, false]}
        >
          <group ref={character}>
            <Character animationName={animationName} />
          </group>
        </RigidBody>
      </group>
    </>
  );
}
