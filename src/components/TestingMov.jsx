import React, { useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Custom import
import Character from "./Character";

export default function TestingMov() {
  /**
   * Ref
   */
  const body = useRef();

  /**
   * Handle Animations
   */
  const [animationName, setAnimationName] = useState("Idle");

  /**
   * subscribeKeys (gets key changes) getKeys (gets key states)
   */
  const [subscribeKeys, getKeys] = useKeyboardControls();

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
    /**
     * Controls
     */
    const { forward, backward, leftward, rightward, shift } = getKeys();

    /**
     * Speed
     */
    const speed = shift ? 0.06 : 0.03; // Adjust the speed based on whether shift is pressed or not
    let newVelocity = { x: 0, y: 0, z: 0 };

    // Movement Direction represents the direction in which the player should move forward or backward based on the camera's rotation
    const movementDirection = new THREE.Vector3(
      Math.sin(rotationAngle),
      0,
      Math.cos(rotationAngle)
    );

    /**
     * Movement
     */
    switch (true) {
      case forward && !leftward && !rightward:
        // Handle forward movement (F)
        newVelocity.x = movementDirection.x * -speed;
        newVelocity.z = movementDirection.z * -speed;
        body.current.rotation.y = 0;
        setAnimationName(shift ? "Run" : "Walk");
        break;

      case backward && !leftward && !rightward:
        // Handle backward movement (B)
        newVelocity.x = movementDirection.x * speed;
        newVelocity.z = movementDirection.z * speed;
        body.current.rotation.y = Math.PI;
        setAnimationName(shift ? "Run" : "Walk");
        break;

      case leftward && !forward && !backward:
        // Handle leftward movement (L)
        newVelocity.x = -movementDirection.z * speed;
        newVelocity.z = movementDirection.x * speed;
        body.current.rotation.y = Math.PI / 2;
        setAnimationName(shift ? "Run" : "Walk");
        break;

      case rightward && !forward && !backward:
        // Handle rightward movement (R)
        newVelocity.x = movementDirection.z * speed;
        newVelocity.z = -movementDirection.x * speed;
        body.current.rotation.y = (3 * Math.PI) / 2;
        setAnimationName(shift ? "Run" : "Walk");
        break;

      case forward && leftward:
        // Handle simultaneous press of "left" and "forward" buttons (FL)
        newVelocity.x = (-movementDirection.x - movementDirection.z) * speed;
        newVelocity.z = (-movementDirection.z + movementDirection.x) * speed;
        body.current.rotation.y = Math.PI / 4;
        setAnimationName(shift ? "Run" : "Walk");
        break;

      case forward && rightward:
        // Handle simultaneous press of "left" and "forward" buttons (FR)
        newVelocity.x = (movementDirection.x - movementDirection.z) * -speed;
        newVelocity.z = (movementDirection.z + movementDirection.x) * -speed;
        body.current.rotation.y = -Math.PI / 4;
        setAnimationName(shift ? "Run" : "Walk");
        break;

      case backward && leftward:
        // Handle simultaneous press of "right" and "backward" buttons (BL)
        newVelocity.x = (movementDirection.x - movementDirection.z) * speed;
        newVelocity.z = (movementDirection.z + movementDirection.x) * speed;
        body.current.rotation.y = (3 * Math.PI) / 4;
        setAnimationName(shift ? "Run" : "Walk");
        break;

      case backward && rightward:
        // Handle simultaneous press of "left" and "backward" buttons (BR)
        newVelocity.x = (-movementDirection.x - movementDirection.z) * -speed;
        newVelocity.z = (-movementDirection.z + movementDirection.x) * -speed;
        body.current.rotation.y = -(3 * Math.PI) / 4;
        setAnimationName(shift ? "Run" : "Walk");
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

    // Update the velocity state
    setVelocity(newVelocity);

    /**
     * Camera
     */
    const bodyPosition = body.current.position;
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
      <group ref={body} position={[16, 1.7, 16]}>
        <Character animationName={animationName} />
      </group>
    </>
  );
}
