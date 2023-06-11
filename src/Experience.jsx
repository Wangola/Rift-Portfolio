import { useTexture, useGLTF, OrbitControls, Center } from "@react-three/drei";

export default function Experience() {
  // Used to get info on node names
  // const model = useGLTF("./model/testing.glb");
  // console.log(model);

  // Destructure model load
  const { nodes } = useGLTF("./model/testing.glb");

  // // Loads texture
  const bakedTexture = useTexture("./model/testing.jpg");
  bakedTexture.flipY = false;

  const nodeNames = [];

  // Looping through the nodes property
  for (const nodeName in nodes) {
    // If nodes has a property match set true.
    if (nodes.hasOwnProperty(nodeName)) {
      // Set current node with nodes[name]
      const node = nodes[nodeName];

      // If node is a mesh and is not baked (add to map)
      if (node.isMesh && nodeName !== "baked") {
        // Store the node name in the array
        nodeNames.push(nodeName);
      }
    }
  }

  // console.log(nodeNames);

  return (
    <>
      <color args={["#030202"]} attach={"background"} />

      <OrbitControls makeDefault />

      <Center>
        {/* Load Scene */}
        <mesh geometry={nodes.baked.geometry}>
          <meshBasicMaterial map={bakedTexture} />
        </mesh>

        {/* Load all emissions */}
        {nodeNames.map((nodeName, index) => {
          // Dynamically access the geometry using the nodeName
          const geometry = nodes[nodeName].geometry;
          const position = nodes[nodeName].position;

          return <mesh key={index} geometry={geometry} position={position} />;
        })}
      </Center>
    </>
  );
}
