import { IDS } from "../../../../testing";
import { logo } from "../../../../utils/images";

const { version } = require("../../../../../package.json");

export function InfoLogo() {
  return (
    <div className="flex flex-col gap-5 text-center">
      <img className="w-12 mx-auto" src={logo} id={IDS.LOGO}></img>
      <p className="text-xl font-bold">GraphQL Debugger</p>
      <a
        className="italic underline hover:cursor-pointer font-bold text-xs"
        href="https://www.graphql-debugger.com"
      >
        graphql-debugger.com
      </a>
      <p className="text-xs">{version}</p>
    </div>
  );
}
