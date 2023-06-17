import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

// Import your shader code
import nexusVertexShader from "../shaders/nexus/vertex.glsl";
import nexusFragmentShader from "../shaders/nexus/fragment.glsl";
import portalVertexShader from "../shaders/portal/vertex.glsl";
import portalFragmentShader from "../shaders/portal/fragment.glsl";
import candleVertexShader from "../shaders/candleFire/vertex.glsl";
import candleFragmentShader from "../shaders/candleFire/fragment.glsl";

// Custom Shaders
const NexusMaterial = shaderMaterial(
  {
    uTime: 0,
    uRotationSpeed: 0.3,
    uColorStart: new THREE.Color("#2EFFFF"), // light blue
    uColorEnd: new THREE.Color("#00008B"), // dark blue
    uColorPerlin: new THREE.Color("#0000E7"),
  },
  nexusVertexShader,
  nexusFragmentShader
);

const ProjectPortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color(), // light green
    uColorEnd: new THREE.Color(), // dark green
    uColorPerlin: new THREE.Color(), // red to make yellow/orange
    uDisplacedInt: 0.0,
    uPerlinInt: 0.0,
  },
  portalVertexShader,
  portalFragmentShader
);

const GamePortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color(), // light red
    uColorEnd: new THREE.Color(), // dark red
    uColorPerlin: new THREE.Color(), // light violet to improve portal brightness
    uDisplacedInt: 0.0,
    uPerlinInt: 0.0,
  },
  portalVertexShader,
  portalFragmentShader
);

const ExpPortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color(), // light blue #0E86D4
    uColorEnd: new THREE.Color(), // dark blue #003060
    uColorPerlin: new THREE.Color(), // red to remove black outlines #A30000. Or brown for yellowish tint. #964B00 #A30000
    uDisplacedInt: 0.0,
    uPerlinInt: 0.0,
  },
  portalVertexShader,
  portalFragmentShader
);

const CandleMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color(),
    uColorEnd: new THREE.Color(),
  },
  candleVertexShader,
  candleFragmentShader
);

// Exporting shader materials
export {
  NexusMaterial,
  ProjectPortalMaterial,
  GamePortalMaterial,
  ExpPortalMaterial,
  CandleMaterial,
};
