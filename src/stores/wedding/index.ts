import { StateCreator, create } from "zustand";
import { PersonSlice, createPersonSlice } from "./person.slice";
import { devtools } from "zustand/middleware";
import { GuestsSlice, createGuestsSlice } from "./guests.slice";
import { DateSlice, createDateSlice } from "./date.slice";
import {
  ConfirmationSlice,
  createConfirmationSlice,
} from "./confirmation.slice";

type BoundState = PersonSlice & GuestsSlice & DateSlice & ConfirmationSlice;
type ZustandMiddlewares = [["zustand/devtools", never]];

const middlewareWrapper = (
  fn: StateCreator<BoundState, ZustandMiddlewares, []>
) => devtools(fn, { name: "Wedding" });

export const useWeddingBoundStore = create<BoundState>()(
  middlewareWrapper((...a) => ({
    ...createPersonSlice(...a),
    ...createGuestsSlice(...a),
    ...createDateSlice(...a),
    ...createConfirmationSlice(...a),
  }))
);
