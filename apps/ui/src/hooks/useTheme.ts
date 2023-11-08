import { useEffect } from "react";

import { type Theme, useThemeStore } from "../store/useThemeStore";
import { THEME_TYPE } from "../utils/constants";

export const useTheme = () => {
  const theme: Theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme === THEME_TYPE.dark) {
      return document.documentElement.setAttribute(
        "data-theme",
        THEME_TYPE.light,
      );
    }
    document.documentElement.setAttribute("data-theme", THEME_TYPE.dark);
  }, [theme]);
};
