import { CuboidCollider, RigidBody } from "@react-three/rapier";

function Plane() {
  return (
    <mesh position={[10, 0, 10]} scale={4}>
      <boxGeometry args={[4, 0.2, 4]} />
      <meshStandardMaterial color={"limegreen"} />
    </mesh>
  );
}

function RedCube() {
  return (
    <RigidBody type="fixed">
      <mesh position={[7, 1.4, 7]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

function BlueCube() {
  return (
    <RigidBody type="fixed">
      <mesh position={[10, 0.9, 7]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </RigidBody>
  );
}

function StairBlock() {
  return (
    <RigidBody type="kinematicPosition">
      <mesh position={[14, 0.55, 7]}>
        <boxGeometry args={[4, 0.2, 1]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    </RigidBody>
  );
}
function StairBlock1() {
  return (
    <RigidBody type="kinematicPosition">
      <mesh position={[14, 0.75, 6]}>
        <boxGeometry args={[4, 0.2, 1]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    </RigidBody>
  );
}

function Bounds() {
  return (
    <>
      <RigidBody colliders={false} type="fixed" restitution={0.2} friction={0}>
        <CuboidCollider args={[2, 0.1, 2]} position={[10, 0, 10]} scale={4} />
      </RigidBody>
    </>
  );
}

export default function StairsTest() {
  return (
    <>
      <Plane />
      <RedCube />
      <BlueCube />
      <StairBlock />
      <StairBlock1 />
      <Bounds />
    </>
  );
}

/**
 * THIS WOULD BE THE CODE TO HANDLE STAIRS AUTOMATICALLY BUT DECIDED TO ADD JUMP INSTEAD. TOO MANY ISSUES WITH THE COLLIDERS WILL NEED TO REWORK STRUCTURE OF COLLIDERS IN COMPLETE SCENE
 */
// const { rapier, world } = useRapier();
//   const rapierWorld = world.raw();

//   /**
//    * subscribeKeys (gets key changes) getKeys (gets key states)
//    */
//   const [subscribeKeys, getKeys] = useKeyboardControls();

//   /**
//    * Raycaster Setup
//    */

//   const checkStair = () => {
//     // Direction for both ray casters
//     const direction = { x: -1, y: 0, z: -1 };

//     // Create ray for lower part of the legs (Feet)
//     const originLow = body.current.translation();
//     originLow.y += 0.2;
//     const rayLow = new rapier.Ray(originLow, direction);
//     const hitLow = rapierWorld.castRay(rayLow);

//     // Create ray for mid part of the legs (Knees)
//     const originMid = body.current.translation();
//     originMid.y += 0.4;
//     const rayMid = new rapier.Ray(originLow, direction);
//     const hitMid = rapierWorld.castRay(rayMid);

//     // Check if ray hit objects else do nothing
//     if (hitLow && hitLow.toi < 0.5) {
//       console.log(hitLow);

//       /**
//        * If second ray hits an object higher then low ray with the same distance, then we know its a wall or other.
//        * Otherwise if it hits an object that is not the same distance as previous stair, then we know we have to go up (aka we know its a stair case).
//        */
//       if (hitMid && hitLow.toi < 0.2) {
//         console.log("Not stairs");
//       } else {
//         console.log("Jumping");
//         body.current.applyImpulse({ x: 0, y: 1.5, z: 0 });
//       }
//     } else if (!hitLow) {
//       console.log("No hits");
//     } else {
//       console.log("Not close enough");
//     }

//     // body.current.applyImpulse({ x: 0, y: 0.7, z: 0 });
//   };

//   useEffect(() => {
//     subscribeKeys(
//       // Selector (excludes shift)
//       (state) => {
//         // Filter out the Shift key press
//         const { shift, ...rest } = state;
//         return rest;
//       },
//       (value) => {
//         if (value) {
//           checkStair();
//         }
//       }
//     );
//   }, []);
