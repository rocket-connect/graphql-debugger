import { create } from "zustand";
import { persist } from "zustand/middleware";

import { THEME_TYPE } from "../utils/constants";

export type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: (value: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: window.matchMedia("(prefers-color-scheme: dark").matches
        ? THEME_TYPE.dark
        : THEME_TYPE.light,
      toggleTheme: (value) => set({ theme: value }),
    }),
    { name: "theme" },
  ),
);
