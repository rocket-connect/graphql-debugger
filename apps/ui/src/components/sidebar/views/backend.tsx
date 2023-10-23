import { useQuery } from "@tanstack/react-query";
import { type ChangeEvent, useContext } from "react";

import { Spinner } from "../../../components/utils/spinner";
import { ClientContext } from "../../../context/client";
import { ConfigContext } from "../../../context/config";

export function Backend() {
  const configContext = useContext(ConfigContext);
  const { client } = useContext(ClientContext);

  const { data: isConnected } = useQuery({
    queryKey: ["pollingConnection", configContext?.backendURL],
    queryFn: async () => {
      try {
        const response = await client?.ping();
        return response;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
    refetchInterval: 2000,
    networkMode: "online",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    configContext?.setBackendURL(event.target.value);
  };

  return (
    <div>
      <div className="flex flex-col gap-1 mb-5">
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
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="username" className="block font-bold">
          Connection
        </label>
        <p className="text-sm">Polling connection.</p>

        <div className="mx-auto mt-5">
          {isConnected ? <Spinner /> : <Spinner isError={true} />}
        </div>

        <div className="text-center mt-5 font-bold">
          {isConnected ? (
            <p className="text-graphql-otel-green">Connected!</p>
          ) : (
            <p className="text-red-500">Disconnected!</p>
          )}
        </div>
      </div>
    </div>
  );
}
