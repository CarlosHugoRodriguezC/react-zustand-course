import { StateCreator } from "zustand";

export interface DateSlice {
  eventDate: Date;

  eventYYYYMMDD: () => string;
  eventHHMM: () => string;

  setEventDate: (partialDate: string) => void;
  setEventTime: (partialTime: string) => void;
}

export const createDateSlice: StateCreator<DateSlice> = (set, get) => ({
  eventDate: new Date(),
  eventYYYYMMDD: () => {
    return get().eventDate.toISOString().split("T")[0];
  },
  eventHHMM: () => {
    const hours = get().eventDate.getHours().toString().padStart(2, "0");
    const minutes = get().eventDate.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  },
  setEventDate: (partialDate) =>
    set((state) => {
      console.log(partialDate);
      const dateIntroduced = new Date(partialDate.replace(/-/g, "/"));

      const newDate = new Date(state.eventDate);

      newDate.setFullYear(dateIntroduced.getFullYear());
      newDate.setMonth(dateIntroduced.getMonth());
      newDate.setDate(dateIntroduced.getDate());

      return { eventDate: newDate };
    }),
  setEventTime: (partialTime) =>
    set((state) => {
      console.log(partialTime);
      const [hours, minutes] = partialTime.split(":");

      const newDate = new Date(state.eventDate);

      newDate.setHours(+hours);
      newDate.setMinutes(+minutes);

      return { eventDate: newDate };
    }),
});
