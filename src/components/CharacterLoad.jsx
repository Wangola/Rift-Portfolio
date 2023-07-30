import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect } from "react";

export default function Character({ animationName }) {
  const character = useGLTF("./model/character.glb");
  const animations = useAnimations(character.animations, character.scene);

  // If you need to see if animations are working
  //   const { animationName } = useControls({
  //     animationName: { options: animations.names },
  //   });

  useEffect(() => {
    const action = animations.actions[animationName];
    action.reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5);
    };
  }, [animationName]);

  return (
    <primitive
      object={character.scene}
      scale={0.45}
      // position={[16, 1.7, 16]}
      rotation-y={-2.4}
    />
  );
}
