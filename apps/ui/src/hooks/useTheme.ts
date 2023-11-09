import { useEffect } from "react";

import { type Theme, useThemeStore } from "../store/useThemeStore";

export const useTheme = () => {
  const theme: Theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
};
