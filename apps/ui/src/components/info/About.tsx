import { LinkedText } from "../utils/LinkedText";

export function About() {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-bold">About</h3>
      <div className="flex flex-col gap-5 text-xs">
        <p className="text-xs">
          GraphQL Debugger is a{" "}
          <LinkedText href="https://opentelemetry.io" text="OpenTelemetry" />{" "}
          collector with a user interface tailored for debugging GraphQL
          servers.
        </p>

        <p className="text-xs">
          It is designed to be used during development to help you identify
          errors, slow queries, and inconsistencies without having to rely on
          outdated methods like logging.
        </p>

        <p>
          GraphQL Debugger is free to use, open source, and you can find the
          source code on{" "}
          <LinkedText
            text="GitHub"
            href="https://github.com/rocket-connect/graphql-debugger"
          />
          .
        </p>

        <p>
          You can get started by simply installing our schema plugin and then
          running our CLI to initiate this interface.
        </p>
      </div>
    </div>
  );
}
