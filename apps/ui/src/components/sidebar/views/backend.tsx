import { type ChangeEvent, useContext } from "react";

import { ConfigContext } from "../../../context/config";

export function Backend() {
  const configContext = useContext(ConfigContext);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    configContext?.setapiURL(event.target.value);
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
          className="border bg-primary-background  border-accent rounded-md w-full p-2 mt-3 font-bold tracking-widest text-xs outline-none"
          placeholder="http://localhost:16686"
          value={configContext?.apiURL}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
