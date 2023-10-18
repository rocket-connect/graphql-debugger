import { useContext } from "react";

import { Spinner } from "../../../components/utils/spinner";
import { Toggle } from "../../../components/utils/toggle";
import { ClientContext } from "../../../context/client";
import { ConfigContext } from "../../../context/config";

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
    callout: "(Comming Soon)",
    defaultDisabled: true,
    enabled: false,
  },
  {
    name: "Cookies",
    description: "We collect data to improve your experience",
    callout: "(Enabled)",
    defaultDisabled: true,
    enabled: true,
  },
];

export function Config() {
  const configContext = useContext(ConfigContext);
  const clientContext = useContext(ClientContext);

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
              key={config.name}
              name={config.name}
              description={config.description}
              callout={config.callout}
              enabled={config.enabled}
              defaultDisabled={config.defaultDisabled}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="block font-bold">
          Backend
        </label>
        <p className="text-sm">Connect to your own backend.</p>
        <input
          type="text"
          id="username"
          className="border rounded w-full p-2 mt-3 font-bold tracking-widest text-xs outline-none"
          placeholder="http://localhost:16686"
          value={configContext?.backendURL}
          onChange={(e) => {
            configContext?.setBackendURL(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="block font-bold">
          Connection
        </label>
        <p className="text-sm">Polling connection.</p>

        <div className="mx-auto mt-5">
          {clientContext.isConnected ? <Spinner /> : <Spinner isError={true} />}
        </div>

        <div className="text-center mt-5 font-bold">
          {clientContext.isConnected ? (
            <p className="text-graphql-otel-green">Connected!</p>
          ) : (
            <p className="text-red-500">Disconnected!</p>
          )}
        </div>
      </div>
    </div>
  );
}
