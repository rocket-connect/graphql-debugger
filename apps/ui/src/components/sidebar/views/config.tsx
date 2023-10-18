import toast from "react-hot-toast";

import { Toggle } from "../../../components/toggle";
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
  },
  {
    name: "Cookies",
    description: "We collect data to improve your experience",
    enabled: true,
  },
];

export function Config() {
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
              initialState={config.enabled}
              label={config.name}
              onToggle={(check) => {
                if (check) {
                  toast.success(`${config.name} enabled`);
                }
                if (!check) {
                  toast.error(`${config.name} disabled`);
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
