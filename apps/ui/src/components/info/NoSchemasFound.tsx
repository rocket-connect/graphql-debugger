import { HighlightedText } from "../utils/HighlightedText";
import { Spinner } from "../utils/Spinner";
import { GettingStarted } from "./GettingStarted";

export function NoSchemasFound() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5 text-center">
        <p className="font-bold">No schemas found</p>
        <p className="text-xs italic">
          Waiting for a{" "}
          <HighlightedText text="POST" spacing="'" color="graphql-otel-green" />{" "}
          schema event
        </p>
      </div>

      <div className="flex flex-col align-center justify-center">
        <div className="mx-auto">
          <Spinner />
        </div>
      </div>

      <GettingStarted />
    </div>
  );
}
