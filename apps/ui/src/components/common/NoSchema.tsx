import { IDS } from "../../testing";
import { logo } from "../../utils/images";

export const NoSchema = () => {
  return (
    <div
      id={IDS.NO_SCHEMAS_FOUND}
      className="mx-auto border rounded-lg p-8 w-96 flex flex-col gap-6"
    >
      <div className="flex flex-row gap-2 py-1 align-center mx-auto justify-center">
        <img id={IDS.LOGO} className="w-10 my-auto" src={logo} />
        <p className="my-auto text-large font-bold">GraphQL Debugger</p>
      </div>
      <p className="text-center text-lg">No Schemas found</p>
      <p className="text-center mt-2">
        <a
          href="https://github.com/rocket-connect/graphql-debugger"
          className="font-bold hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </p>
    </div>
  );
};
