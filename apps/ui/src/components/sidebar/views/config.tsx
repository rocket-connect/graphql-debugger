import { useContext } from "react";
import toast from "react-hot-toast";
import { useShallow } from "zustand/react/shallow";

import { ConfigContext } from "../../../context/config";
import { useThemeStore } from "../../../store/useThemeStore";
import { IDS } from "../../../testing";
import { THEME_TYPE } from "../../../utils/constants";
import { Toggle } from "../../utils/toggle";
import { configs } from "../utils";
import { Backend } from "./backend";

export function Config() {
  const { theme, toggleTheme } = useThemeStore();

  const handleToggle = (check: boolean, configName: string) => {
    if (check) {
      toggleTheme(THEME_TYPE.dark);
      toast.success(`${configName} enabled`, {
        icon: "🌙",
      });
    }
    if (!check) {
      toggleTheme(THEME_TYPE.light);
      toast.success(`Light mode enabled`, {
        icon: "🌞",
      });
    }
  };

  return (
    <div id={IDS.sidebar.views.config} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold">General</h3>
        <p className="text-sm">Customize your experience.</p>
      </div>

      <div className="flex flex-col gap-10 text-netural-100 text-xs pl-3">
        {configs.map((config) => {
          return (
            <Toggle
              initialState={theme === THEME_TYPE.dark}
              label={config.name}
              key={config.name}
              onToggle={(check) => handleToggle(check, config.name)}
              description={config.description}
              disabled={!config.enabled}
              alwaysEnabled={config.alwaysEnabled}
            />
          );
        })}
      </div>

      <Backend />
    </div>
  );
}
