import {
  Float,
  Html,
  useKeyboardControls,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

/**
 * Generates and returns the HTML for the skill panel headers
 *
 * @param {Vector3} frontEndPosition - Header position wanted for Front End text
 * @param {Vector3} backEndPosition - Header position wanted for Back End text
 * @param {Vector3} langPosition - Header position wanted for Languages text
 * @param {Boolean} isSkillPress - Boolean flag indicating if "E" was pressed
 * @returns {JSX.Element} HTML of skill panel headers
 */
const skillPanelsText = (
  frontEndPosition,
  backEndPosition,
  langPosition,
  isSkillPress
) => {
  return (
    <>
      {/* Front end text */}
      <Html position={frontEndPosition}>
        <div className={`panel-header front-end ${isSkillPress ? "show" : ""}`}>
          Front End
        </div>
      </Html>

      {/* Back end text */}
      <Html position={backEndPosition}>
        <div className={`panel-header back-end ${isSkillPress ? "show" : ""}`}>
          Back End
        </div>
      </Html>

      {/* Languages text */}
      <Html position={langPosition}>
        <div className={`panel-header languages ${isSkillPress ? "show" : ""}`}>
          Languages
        </div>
      </Html>
    </>
  );
};

/**
 * Renders the contact panel with social media planes and handles interactions.
 *
 * @param {Vector3} contactTextPosition - Position of the contact header text
 * @param {boolean} isContactPress - Boolean flag indicating if "E" was pressed
 * @param {*} nodes - The nodes object containing the loaded model items
 * @returns {JSX.Element} Contact panel
 */
const contactPanel = (contactTextPosition, isContactPress, nodes) => {
  // Load texture
  const bakedExtra = useTexture("./model/bakedExtra.jpg");
  bakedExtra.flipY = false;

  /**
   * Contact info offsets
   */
  const contactPosition = nodes.contactBaked.position;

  // Plane z/y offset
  const yOffset = -0.68;
  const zOffset = 0.2;

  // Twitter offset
  const xTwOffset = -1.85;

  const twitterPlanePos = new Vector3(
    contactPosition.x + xTwOffset,
    contactPosition.y + yOffset,
    contactPosition.z + zOffset
  );

  // Github offset
  const xGitOffset = -0.6;

  const gitPlanePos = new Vector3(
    contactPosition.x + xGitOffset,
    contactPosition.y + yOffset,
    contactPosition.z + zOffset
  );

  // LinkedIn offset
  const xLinkedOffset = 0.66;

  const linkedPlanePos = new Vector3(
    contactPosition.x + xLinkedOffset,
    contactPosition.y + yOffset,
    contactPosition.z + zOffset
  );

  // Mail offset
  const xMailOffset = 1.88;

  const mailPlanePos = new Vector3(
    contactPosition.x + xMailOffset,
    contactPosition.y + yOffset,
    contactPosition.z + zOffset
  );

  /**
   * Onpress links && external
   */
  const handleTwClick = () => {
    window.open("https://twitter.com/william_angola", "_blank");
  };
  const handlGitClick = () => {
    window.open("https://github.com/Wangola", "_blank");
  };
  const handleLinkedClick = () => {
    window.open("https://www.linkedin.com/in/wangola/", "_blank");
  };
  const handleMailClick = () => {
    const email = "wangola98@gmail.com";
    const subject = "Message from Portfolio";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    // Open the user's default email client with the pre-filled email
    window.open(mailtoLink);
  };

  /**
   * Hover effects
   */
  const [isTwitterHovered, setIsTwitterHovered] = useState(false);
  const [isGithubHovered, setIsGithubHovered] = useState(false);
  const [isLinkedInHovered, setIsLinkedInHovered] = useState(false);
  const [isMailHovered, setIsMailHovered] = useState(false);

  return (
    <>
      <Float speed={3.2} rotationIntensity={0.15}>
        {/* Contact panel load */}
        <mesh geometry={nodes.contactBaked.geometry} position={contactPosition}>
          <meshBasicMaterial map={bakedExtra} />
        </mesh>

        {/* Name load */}
        <mesh
          geometry={nodes.name.geometry}
          position={nodes.name.position}
        ></mesh>

        {/* Only allow clicks on social medias is user is interacting */}
        {isContactPress && (
          <>
            {/* Twitter plane */}
            <mesh
              position={twitterPlanePos}
              onPointerDown={handleTwClick}
              onPointerOver={() => setIsTwitterHovered(true)}
              onPointerOut={() => setIsTwitterHovered(false)}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                color={"#FFA500"}
                transparent
                opacity={isTwitterHovered ? 0.6 : 0}
              />
            </mesh>

            {/* Github plane */}
            <mesh
              position={gitPlanePos}
              onPointerDown={handlGitClick}
              onPointerOver={() => setIsGithubHovered(true)}
              onPointerOut={() => setIsGithubHovered(false)}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                color={"#FFA500"}
                transparent
                opacity={isGithubHovered ? 0.6 : 0}
              />
            </mesh>

            {/* LinkedIn plane */}
            <mesh
              position={linkedPlanePos}
              onPointerDown={handleLinkedClick}
              onPointerOver={() => setIsLinkedInHovered(true)}
              onPointerOut={() => setIsLinkedInHovered(false)}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                color={"#FFA500"}
                transparent
                opacity={isLinkedInHovered ? 0.6 : 0}
              />
            </mesh>

            {/* Mail plane */}
            <mesh
              position={mailPlanePos}
              onPointerDown={handleMailClick}
              onPointerOver={() => setIsMailHovered(true)}
              onPointerOut={() => setIsMailHovered(false)}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                color={"#FFA500"}
                transparent
                opacity={isMailHovered ? 0.6 : 0}
              />
            </mesh>
          </>
        )}
      </Float>

      {/* Contact Header text */}
      <Html position={contactTextPosition}>
        <div className={`panel-header ${isContactPress ? "show" : ""}`}>
          Contact info
        </div>
      </Html>
    </>
  );
};

export default function InteractionHandler({
  nodes,
  bodyPosition,
  cameraPosition,
  cameraTarget,
  setInteractionActive,
}) {
  // Define positions
  const skillPosition = nodes.backEndBaked.position;
  const contactPosition = nodes.contactBaked.position;

  /**
   * ----- Skill Handler -----
   */
  const skillSphereRef = useRef();
  const [showSkillPopUp, setShowSkillPopUp] = useState(false);
  const [isSkillPress, setIsSkillPress] = useState(false);
  const [isSkillInteractable, setIsSkillInteractable] = useState(false);

  /**
   * Handle Camera Positions
   */
  // Handle E press on skills to update the camera position
  const handleSkillPress = () => {
    // Define the new camera position
    const newCameraPosition = new THREE.Vector3(
      skillPosition.x + 7.5,
      skillPosition.y + 1.8,
      skillPosition.z
    );

    // Update the camera position and lookAt
    cameraPosition.copy(newCameraPosition);
    // Target is copied and not lookedAt as the camera is using LookAt in the Character.jsx useFrame
    cameraTarget.copy(skillPosition);

    // Set interaction as pressed to stop camera movement until character moves again
    setInteractionActive(true);

    setIsSkillPress(true);
  };

  /**
   * Object position handler
   */

  // Offset for skill sphere
  const xSkillOffset = 0.5;
  const ySkillOffset = -2.8;

  const adjustedSkillPosition = new Vector3(
    skillPosition.x + xSkillOffset,
    skillPosition.y + ySkillOffset,
    skillPosition.z
  );

  // Offset for skills PopUp
  const xSkillUpOffset = 0.5;
  const zSkillUpOffset = -0.14;

  const adjustedSkillPopUpOffset = new Vector3(
    skillPosition.x + xSkillUpOffset,
    skillPosition.y + ySkillOffset,
    skillPosition.z + zSkillUpOffset
  );

  /**
   * Skill Panel Header positions
   */
  const yPanelPos = 2.9;

  // Front end
  const zFrontPos = 5.4;

  const frontEndPosition = new Vector3(
    skillPosition.x,
    skillPosition.y + yPanelPos,
    skillPosition.z + zFrontPos
  );

  // Back End
  const zBackPos = 0.8;

  const backEndPosition = new Vector3(
    skillPosition.x,
    skillPosition.y + yPanelPos,
    skillPosition.z + zBackPos
  );

  // Languages
  const zLangPos = -3.5;

  const langPosition = new Vector3(
    skillPosition.x,
    skillPosition.y + yPanelPos,
    skillPosition.z + zLangPos
  );

  /**
   * ----- Contact Handler -----
   */
  const contactSphereRef = useRef();
  const [showContactPopUp, setShowContactPopUp] = useState(false);
  const [isContactPress, setIsContactPress] = useState(false);
  const [isContactInteractable, setIsContactInteractable] = useState(false);

  // Handle E press on contact to update the camera position
  const handleContactPress = () => {
    // Define the new camera position
    const newCameraPosition = new THREE.Vector3(
      contactPosition.x - 0.3,
      contactPosition.y + 1.8,
      contactPosition.z + 6
    );

    // Update the camera position and lookAt
    cameraPosition.copy(newCameraPosition);

    // Target is copied and not lookedAt as the camera is using LookAt in the Character.jsx useFrame
    cameraTarget.copy(contactPosition);

    // Set interaction as pressed to stop camera movement until character moves again
    setInteractionActive(true);

    setIsContactPress(true);
  };

  /**
   * Object position handler
   */

  // Offset for skill sphere
  const yContactOffset = -2.1;
  const zContactOffset = 0.5;

  const adjustedContactPosition = new Vector3(
    contactPosition.x,
    contactPosition.y + yContactOffset,
    contactPosition.z + zContactOffset
  );

  // Offset for skills PopUp
  const xContactUpOffset = 0.14;
  const zContactUpOffset = 0.5;

  const adjustedContactPopUpOffset = new Vector3(
    contactPosition.x + xContactUpOffset,
    contactPosition.y + yContactOffset,
    contactPosition.z + zContactUpOffset
  );

  /**
   * Contact Panel Header position
   */
  const xContactPanelPos = -0.9;
  const yContactPanelPos = 2.6;

  const contactTextPosition = new Vector3(
    contactPosition.x + xContactPanelPos,
    contactPosition.y + yContactPanelPos,
    contactPosition.z
  );

  /**
   * subscribeKeys (gets key changes) getKeys (gets key states)
   */
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    // If loading bodyPosition return
    if (!bodyPosition) return;

    // Interact control only need "E" but brought others to check if the character has pressed a move key
    const { forward, backward, leftward, rightward, interact } = getKeys();

    /**
     *  ----- Distance validation -----
     */
    // Distance for skills
    const skillDistance = bodyPosition.distanceTo(
      skillSphereRef.current.position
    );

    setIsSkillInteractable(skillDistance < 7);
    setShowSkillPopUp(skillDistance < 4);

    // Distance for contact
    const contactDistance = bodyPosition.distanceTo(
      contactSphereRef.current.position
    );

    setIsContactInteractable(contactDistance < 7);
    setShowContactPopUp(contactDistance < 4);

    /**
     * ----- Transitions -----
     */
    const opacityChangeSpeed = 2;

    /**
     * Skills transition
     */
    const targetSkillOpacity = isSkillInteractable ? 0.8 : 0;
    const currentSkillOpacity = skillSphereRef.current.material.opacity;

    // Animate the skill sphere opacity when the player is close enough
    if (isSkillInteractable) {
      // Fade in
      const newOpacity = Math.min(
        currentSkillOpacity + opacityChangeSpeed * delta,
        targetSkillOpacity
      );

      skillSphereRef.current.material.opacity = newOpacity;
    } else {
      // Fade out
      const newOpacity = Math.max(
        currentSkillOpacity - opacityChangeSpeed * delta,
        targetSkillOpacity
      );

      skillSphereRef.current.material.opacity = newOpacity;
    }

    /**
     * ----- Contact transition -----
     */
    const targetContactOpacity = isContactInteractable ? 0.8 : 0;
    const currentContactOpacity = contactSphereRef.current.material.opacity;

    // Animate the contact sphere opacity when the player is close enough
    if (isContactInteractable) {
      // Fade in
      const newOpacity = Math.min(
        currentContactOpacity + opacityChangeSpeed * delta,
        targetContactOpacity
      );

      contactSphereRef.current.material.opacity = newOpacity;
    } else {
      // Fade out
      const newOpacity = Math.max(
        currentContactOpacity - opacityChangeSpeed * delta,
        targetContactOpacity
      );

      contactSphereRef.current.material.opacity = newOpacity;
    }

    /**
     * ----- Handle E press on skills && contact -----
     */
    // Skills
    if (showSkillPopUp && interact) {
      handleSkillPress(delta);
    }
    // If its any other movement key disable
    else if (forward || backward || leftward || rightward) {
      setIsSkillPress(false);
    }

    // Contact
    if (showContactPopUp && interact) {
      handleContactPress();
    }
    // If its any other movement key disable
    else if (forward || backward || leftward || rightward) {
      setIsContactPress(false);
    }
  });

  return (
    <>
      {/* Skills sphere */}
      <mesh position={adjustedSkillPosition} scale={0.15} ref={skillSphereRef}>
        <sphereGeometry />
        <meshLambertMaterial color={"white"} opacity={0.8} transparent />
      </mesh>

      {/* Skills interact bubble */}
      <Html position={adjustedSkillPopUpOffset}>
        <div
          className={`popUp-bubble ${
            showSkillPopUp && !isSkillPress ? "show" : ""
          }`}
        >
          <div className="popUp-text">'E' to interact</div>
        </div>
      </Html>

      {/* Skills Header loader */}
      {skillPanelsText(
        frontEndPosition,
        backEndPosition,
        langPosition,
        isSkillPress
      )}

      {/* Contact sphere */}
      <mesh
        position={adjustedContactPosition}
        scale={0.15}
        ref={contactSphereRef}
      >
        <sphereGeometry />
        <meshLambertMaterial color={"white"} opacity={0.8} transparent />
      </mesh>

      {/* Contact interact bubble */}
      <Html position={adjustedContactPopUpOffset}>
        <div
          className={`popUp-bubble ${
            showContactPopUp && !isContactPress ? "show" : ""
          }`}
        >
          <div className="popUp-text">"E" to interact</div>
        </div>
      </Html>

      {/* Contact Header loader */}
      {contactPanel(contactTextPosition, isContactPress, nodes)}
    </>
  );
}
