import { useContext } from "react";
import toast from "react-hot-toast";

import { ConfigContext } from "../../../context/config";
import { Toggle } from "../../utils/toggle";
import { Backend } from "./backend";

const configs = [
  {
    name: "Dark Mode",
    description: "Toggle between light and dark mode",
    callout: "(Comming Soon)",
    defaultDisabled: true,
    enabled: false,
  },
  {
    name: "History",
    description: "Enable the store of trace history in local storage",
    enabled: true,
    initialState: localStorage.getItem("history") === "history",
  },
  {
    name: "Cookies",
    description: "We collect data to improve your experience",
    enabled: true,
    initialState: localStorage.getItem("cookies") === "cookies",
  },
  {
    name: "Favourites",
    description: "We collect data to improve your experience",
    enabled: true,
    initialState: localStorage.getItem("favourites") === "favourites",
  },
];

export function Config() {
  const context = useContext(ConfigContext);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h3 className="font-bold">General</h3>
        <p className="text-sm">Customize your experience.</p>
      </div>

      <div className="flex flex-col gap-10 text-netural-100 text-xs pl-3">
        {configs.map((config) => {
          return (
            <Toggle
              initialState={config.initialState}
              label={config.name}
              onToggle={(check) => {
                if (check) {
                  toast.success(`${config.name} enabled`);
                  context?.handleEnableRoute(config.name.toLowerCase());
                }
                if (!check) {
                  toast.error(`${config.name} disabled`);
                  context?.handleDisableRoute(config.name.toLowerCase());
                }
              }}
              callout={config.callout}
              description={config.description}
              disabled={!config.enabled}
            />
          );
        })}
      </div>
      <Backend />
    </div>
  );
}
