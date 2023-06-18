import { RigidBody } from "@react-three/rapier";

export default function Player() {
  return (
    <>
      <RigidBody
        colliders="cuboid"
        restitution={0.2}
        friction={1}
        position={[16, 3.5, 16]}
      >
        <mesh castShadow>
          <capsuleGeometry args={[0.8, 1]} />
          <meshStandardMaterial flatShading color={"mediumpurple"} />
        </mesh>
      </RigidBody>
    </>
  );
}
