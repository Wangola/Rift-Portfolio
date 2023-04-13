import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useGLTF, Float, Text, Html, OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

export default function Experience() {
  // Reference for cube
  const cubeRef = useRef();

  // Load model
  const model = useGLTF("./hamburger.glb");

  // Leva control
  const { position } = useControls({
    position: { value: -2, min: -4, max: 4, step: 0.01 },
  });

  // Tick function for timer/delta (movement in scene)
  useFrame((state, delta) => {
    // Rotation of cube. Using delta to have same rotation speed no matter what framerate
    cubeRef.current.rotation.y += delta;
  });

  return (
    <>
      {/* From perf */}
      <Perf position={"top-left"} />

      {/* From drei default damping*/}
      <OrbitControls />

      {/* Lights */}
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <group>
        {/* Sphere */}
        <mesh position-x={position}>
          <sphereGeometry />
          <meshStandardMaterial color={"orange"} />
        </mesh>

        {/* Cube */}
        <mesh
          ref={cubeRef}
          rotation-y={Math.PI * 0.25}
          position-x={2}
          scale={1.5}
        >
          <boxGeometry scale={1.5} />
          <meshStandardMaterial color={"mediumpurple"} />
        </mesh>
      </group>

      {/* Plane */}
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color={"greenyellow"} />
      </mesh>

      {/* HTML text can be attached to meshes */}
      {/* <Html>test</Html> */}

      {/* Text bring in personal font if needed use woff font type*/}
      <Float speed={5} floatIntensity={2}>
        <Text
          font=""
          fontSize={1}
          color={"salmon"}
          position-y={2}
          maxWidth={2}
          textAlign="center"
        >
          Testing R3F
          <meshNormalMaterial />
        </Text>
      </Float>

      <primitive object={model.scene} scale={0.35} position={[0, 0, -3]} />
    </>
  );
}
