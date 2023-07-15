import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export default create(
  subscribeWithSelector((set) => {
    return {
      /**
       * Phases
       */
      phase: "ready",

      start: () => {
        set((state) => {
          // If its the same phase it should not return same phase
          if (state.phase === "ready") {
            return { phase: "playing" };
          }
          return {};
        });
      },

      restart: () => {
        set((state) => {
          // If its the same phase it should not return same phase
          if (state.phase === "playing") {
            return { phase: "ready" };
          }

          return {};
        });
      },
    };
  })
);
