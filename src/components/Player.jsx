import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef } from "react";

export default function Player() {
  const body = useRef();
  // subscribeKeys (gets key changes) getKeys (gets key states)
  const [subscribeKeys, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    // Delta will keep same movement no matter framerate
    const impulseStrength = 50 * delta;
    const torqueStrength = 25 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.z += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);
  });

  return (
    <>
      <RigidBody
        ref={body}
        colliders="cuboid"
        restitution={0.2}
        friction={1}
        linearDamping={0.5}
        angularDamping={0.5}
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
