import { useEffect } from "react";

import { useThemeStore } from "../store/useThemeStore";
import { THEME_TYPE } from "../utils/constants";

export const useTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const htmlTag = document.documentElement;
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark");

    htmlTag.setAttribute("data-theme", theme);

    systemPreference.addEventListener("change", (event) => {
      toggleTheme(event.matches ? THEME_TYPE.dark : THEME_TYPE.light);
    });

    return () => removeEventListener("change", () => {});
  }, [theme]);
};
