import { useContext } from "react";
import toast from "react-hot-toast";

import { ConfigContext } from "../../../context/config";
import { useThemeStore } from "../../../store/useThemeStore";
import { IDS } from "../../../testing";
import { THEME_TYPE } from "../../../utils/constants";
import { Toggle } from "../../utils/toggle";
import { configs } from "../utils";
import { Backend } from "./backend";

export function Config() {
  const context = useContext(ConfigContext);
  const { toggleTheme } = useThemeStore();

  const handleToggle = (check: boolean, configName: string) => {
    if (check) {
      toast.success(`${configName} enabled`);
      context?.handleEnableRoute(configName.toLowerCase());
      toggleTheme(THEME_TYPE.light);
    }
    if (!check) {
      toast.error(`${configName} disabled`);
      context?.handleDisableRoute(configName.toLowerCase());
      toggleTheme(THEME_TYPE.dark);
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
          let initialState = context?.routes.includes(
            config.name.toLowerCase(),
          );

          let disabled = !config.enabled;

          if (config.alwaysEnabled) {
            initialState = true;
            disabled = true;
          }

          return (
            <Toggle
              initialState={initialState}
              label={config.name}
              key={config.name}
              onToggle={(check) => handleToggle(check, config.name)}
              description={config.description}
              disabled={disabled}
              alwaysEnabled={config.alwaysEnabled}
            />
          );
        })}
      </div>

      <Backend />
    </div>
  );
}
