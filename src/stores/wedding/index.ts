import { StateCreator, create } from "zustand";
import { PersonSlice, createPersonSlice } from "./person.slice";
import { devtools } from "zustand/middleware";
import { GuestsSlice, createGuestsSlice } from "./guests.slice";
import { DateSlice, createDateSlice } from "./date.slice";

type BoundState = PersonSlice & GuestsSlice & DateSlice;

const middlewareWrapper = (
  fn: StateCreator<BoundState, [["zustand/devtools", never]], []>
) => devtools(fn, { name: "Wedding" });

export const useWeddingBoundStore = create<BoundState>()(
  middlewareWrapper((...a) => ({
    ...createPersonSlice(...a),
    ...createGuestsSlice(...a),
    ...createDateSlice(...a),
  }))
);
