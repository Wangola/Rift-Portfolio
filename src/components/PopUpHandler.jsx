import { Html, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

export default function PopUpHandler({
  positionLeft,
  bodyPosition,
  cameraPosition,
  cameraTarget,
  setInteractionActive,
}) {
  // console.log("Position Left:", positionLeft);
  // console.log("Body Position:", bodyPosition);

  /**
   * Sphere refs
   */
  const leftSphereRef = useRef();
  const [showPopUp, setShowPopUp] = useState(false);

  /**
   * subscribeKeys (gets key changes) getKeys (gets key states)
   */
  const [subscribeKeys, getKeys] = useKeyboardControls();

  /**
   * Animation Handler
   */
  const [isInteractable, setIsInteractable] = useState(false);

  /**
   * Handle Camera Positions
   */

  // Handle E press to update the camera position
  const handleSkillPress = (delta) => {
    // Define the new camera position
    const newCameraPosition = new THREE.Vector3(
      positionLeft.x + 7.5,
      positionLeft.y + 1, // Adjust this value to set the camera height
      positionLeft.z
    );

    // Update the camera position and lookAt
    cameraPosition.copy(newCameraPosition);
    // Target is copied and not lookedAt as the camera is using LookAt in the Character.jsx useFrame
    cameraTarget.copy(positionLeft);

    // Set interaction as pressed to stop camera movement until character moves again
    setInteractionActive(true);
  };

  // Testing
  /**
   * State to keep track of "E" press
   */
  const [ePressed, setEPressed] = useState(false);

  useFrame((state, delta) => {
    // If loading bodyPosition return
    if (!bodyPosition) return;

    /**
     * Interact control ("E")
     */
    const { interact } = getKeys();

    /**
     * Distance validation
     */
    const distance = bodyPosition.distanceTo(leftSphereRef.current.position);

    // Distance for sphere to appear
    setIsInteractable(distance < 7);

    // PopUp bubble distance
    setShowPopUp(distance < 4);

    /**
     * Transitions
     */
    const targetOpacity = isInteractable ? 0.8 : 0;
    const currentOpacity = leftSphereRef.current.material.opacity;
    const opacityChangeSpeed = 2;

    // Animate the sphere's opacity when the player is close enough
    if (isInteractable) {
      // Fade in
      const newOpacity = Math.min(
        currentOpacity + opacityChangeSpeed * delta,
        targetOpacity
      );

      leftSphereRef.current.material.opacity = newOpacity;
    } else {
      // Fade out
      const newOpacity = Math.max(
        currentOpacity - opacityChangeSpeed * delta,
        targetOpacity
      );

      leftSphereRef.current.material.opacity = newOpacity;
    }

    /**
     * Handle E press on skills
     */
    if (showPopUp && interact) {
      console.log("nice click");
      handleSkillPress(delta);
    }
  });

  /**
   * Left offset for sphere
   */
  const xSphereOffset = 0.5;
  const ySphereOffset = -2.8;

  const adjustedPositionLeft = new Vector3(
    positionLeft.x + xSphereOffset, // x-coordinate remains the same
    positionLeft.y + ySphereOffset, // Adjust the y-coordinate
    positionLeft.z // z-coordinate remains the same
  );

  const xPopUpOffset = 0.5;
  const yPopUpOffset = -2.8;
  const zPopUpOffset = -0.14;

  // Create a new vector with the adjusted y-coordinate
  const adjustedPopUpOffset = new Vector3(
    positionLeft.x + xPopUpOffset, // x-coordinate remains the same
    positionLeft.y + yPopUpOffset, // Adjust the y-coordinate
    positionLeft.z + zPopUpOffset // z-coordinate remains the same
  );

  return (
    <>
      <mesh position={adjustedPositionLeft} scale={0.15} ref={leftSphereRef}>
        <sphereGeometry />
        <meshLambertMaterial color={"white"} opacity={0.8} transparent />
      </mesh>

      <Html position={adjustedPopUpOffset}>
        <div className={`popUp-bubble ${showPopUp ? "show" : ""}`}>
          <div className="popUp-text">'E' to interact</div>
        </div>
      </Html>
    </>
  );
}
