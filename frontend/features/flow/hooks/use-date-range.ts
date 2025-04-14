import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface DateRangeStore {
  dateRange: string;
  setDateRange: (_dateRange: string) => void;
}

export const useDateRange = create(
  persist<DateRangeStore>(
    (set) => ({
      dateRange: "",
      setDateRange: (dateRange: string) => {
        set({ dateRange });
      },
    }),
    {
      name: "dateRangeStore",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
