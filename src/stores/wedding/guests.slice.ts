import { StateCreator } from "zustand";

export interface GuestsSlice {
  guestCount: number;

  setGuestCount: (guestCount: number) => void;
}

export const createGuestsSlice: StateCreator<GuestsSlice> = (set, get) => ({
  guestCount: 0,

  setGuestCount: (guestCount: number) =>
    set({ guestCount: guestCount > 0 ? guestCount : 0 }),
});
