import { create } from "zustand";
import { persist } from "zustand/middleware";

type BearType = "blackBears" | "polarBears" | "pandaBears";

interface Bear {
  id: number;
  name: string;
  type: BearType;
}

interface BearState {
  blackBears: number;
  polarBears: number;
  pandaBears: number;

  bears: Bear[];

  totalBears: () => number;

  increaseByType: (by: number, type: BearType) => void;

  doNothing: () => void;
  addBear: (bear: Bear) => void;
  clearBears: () => void;
}

export const useBearsStore = create<BearState>()(
  persist(
    (set, get) => ({
      blackBears: 10,
      polarBears: 5,
      pandaBears: 1,
      bears: [
        {
          id: 1,
          name: "Black Bear",
          type: "blackBears",
        },
      ],
      totalBears: () => get().blackBears + get().polarBears + get().pandaBears,
      increaseByType: (by, type) =>
        set((state) => ({ [type]: state[type] + by })),
      doNothing: () => set((state) => ({ bears: [...state.bears] })),
      addBear: (bear) => set((state) => ({ bears: [...state.bears, bear] })),
      clearBears: () => set(() => ({ bears: [] })),
    }),
    { name: "bears-store" }
  )
);
