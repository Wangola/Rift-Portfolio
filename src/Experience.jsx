import { useTexture, useGLTF, OrbitControls, Center } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";

export default function Experience() {
  // ----- LOADING INFO -----
  // Destructure model load
  const { nodes } = useGLTF("./model/testing.glb");

  // // Loads texture
  const bakedTexture = useTexture("./model/testingBaked.jpg");
  bakedTexture.flipY = false;
  const bakedFloor = useTexture("./model/testing.jpg");
  bakedFloor.flipY = false;

  // ----- LOADING INFO -----

  // ----- LEVA/PERF INFO (debug) -----

  // Perf Visibility
  const { perfVisible } = useControls({
    perfVisible: true,
  });

  // Simple test for crystal movement
  const { position, color, visible } = useControls("Nexus Crystal", {
    position: {
      value: {
        x: nodes.nexusCrystal.position.x,
        y: nodes.nexusCrystal.position.y,
      },
      step: 0.05,
      joystick: "invertY",
    },
    color: "#ff0000",
    visible: true,
  });
  console.log(color);

  // ----- LEVA/PERF INFO (debug) -----

  return (
    <>
      <color args={["#030202"]} attach={"background"} />

      {/* Inject perf */}
      {perfVisible ? <Perf position="top-left" /> : null}

      <OrbitControls makeDefault />

      <Center>
        {/* Load Scene */}
        <mesh geometry={nodes.baked.geometry} position={nodes.baked.position}>
          <meshBasicMaterial map={bakedTexture} />
        </mesh>

        {/* Load Floor */}
        <mesh
          geometry={nodes.floorBaked.geometry}
          position={nodes.floorBaked.position}
        >
          <meshBasicMaterial map={bakedFloor} />
        </mesh>

        <mesh
          geometry={nodes.nexusCrystal.geometry}
          position={[position.x, position.y, nodes.nexusCrystal.position.z]}
          visible={visible}
        >
          <meshBasicMaterial color={color} />
        </mesh>
      </Center>
    </>
  );
}

// // Dynamically add emissions objects into scene. (added before return)
// const nodeNames = [];

// // Looping through the nodes property
// for (const nodeName in nodes) {
//   // If nodes has a property match set true.
//   if (nodes.hasOwnProperty(nodeName)) {
//     // Set current node with nodes[name]
//     const node = nodes[nodeName];

//     // If node is a mesh and is not baked (add to map)
//     if (node.isMesh && nodeName !== "baked" && nodeName !== "floorBaked") {
//       // Store the node name in the array
//       nodeNames.push(nodeName);
//     }
//   }
// }

// {/* Load all emissions */}  (add in return)
// {nodeNames.map((nodeName, index) => {
//   // Dynamically access the geometry using the nodeName
//   const geometry = nodes[nodeName].geometry;
//   const position = nodes[nodeName].position;

//   return <mesh key={index} geometry={geometry} position={position} />;
// })}
