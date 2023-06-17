import { useControls } from "leva";

export default function DebugControls() {
  // ----- LEVA/PERF INFO (debug) -----

  // Perf Visibility
  const { perfVisible } = useControls({
    perfVisible: false,
  });

  // Simple test for crystal movement
  const { position, visible } = useControls(
    "Nexus Crystal",
    {
      position: {
        value: {
          x: 3.574598550796509,
          y: 0.6736159324645996,
        },
        step: 0.05,
        joystick: "invertY",
      },
      visible: true,
    },
    { collapsed: true }
  );

  // --- Portal color management ---
  // - Project Portal
  const {
    projectColorStart,
    projectColorEnd,
    projectColorPerlin,
    projectDisplacedInt,
    projectPerlinInt,
  } = useControls(
    "Project Portal",
    {
      projectColorStart: "#2EFF2E",
      projectColorEnd: "#00A300",
      projectColorPerlin: "#d00017",
      projectDisplacedInt: { value: 5.0, min: 0, max: 25, step: 0.1 },
      projectPerlinInt: { value: 5.0, min: 0, max: 25, step: 0.1 },
    },
    { collapsed: true }
  );

  // Game Portal
  const {
    gameColorStart,
    gameColorEnd,
    gameColorPerlin,
    gameDisplacedInt,
    gamePerlinInt,
  } = useControls(
    "Game Portal",
    {
      gameColorStart: "#FF2E2E",
      gameColorEnd: "#A30000",
      gameColorPerlin: "#9D52FF",
      gameDisplacedInt: { value: 15.0, min: 0, max: 25, step: 0.1 },
      gamePerlinInt: { value: 8.0, min: 0, max: 25, step: 0.1 },
    },
    { collapsed: true }
  );

  // Experience Portal
  const {
    expColorStart,
    expColorEnd,
    expColorPerlin,
    expDisplacedInt,
    expPerlinInt,
  } = useControls(
    "Experience Portal",
    {
      expColorStart: "#6bb8eb",
      expColorEnd: "#376796",
      expColorPerlin: "#A30000",
      expDisplacedInt: { value: 8.0, min: 0, max: 25, step: 0.1 },
      expPerlinInt: { value: 3.0, min: 0, max: 25, step: 0.1 },
    },
    { collapsed: true }
  );
  // --- Portal color management ---

  // Candle Fire
  const { candleColorStart, candleColorEnd } = useControls(
    "Candle Fire",
    {
      candleColorStart: "#FFBF00",
      candleColorEnd: "#FFCC00",
    },
    { collapsed: true }
  );

  // Crystal ball
  const { crystalColorStart, crystalColorEnd } = useControls(
    "Crystal Ball",
    {
      crystalColorStart: "#e8e8e8",
      crystalColorEnd: "#ffde41",
    },
    { collapsed: true }
  );

  // Staff Gem
  const { staffColorStart, staffColorEnd } = useControls(
    "Staff Gem",
    {
      staffColorStart: "#63abf8",
      staffColorEnd: "#e7faff",
    },
    { collapsed: true }
  );

  // ----- LEVA/PERF INFO (debug) -----

  // Return all the values
  return {
    perfVisible,
    position,
    visible,
    projectColorStart,
    projectColorEnd,
    projectColorPerlin,
    projectDisplacedInt,
    projectPerlinInt,
    gameColorStart,
    gameColorEnd,
    gameColorPerlin,
    gameDisplacedInt,
    gamePerlinInt,
    expColorStart,
    expColorEnd,
    expColorPerlin,
    expDisplacedInt,
    expPerlinInt,
    candleColorStart,
    candleColorEnd,
    crystalColorStart,
    crystalColorEnd,
    staffColorStart,
    staffColorEnd,
  };
}
