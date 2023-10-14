import { LinkedText } from "../utils/linked-text";

export function HowItWorks() {
  return (
    <div className="flex flex-col gap-5 ">
      <h3 className="font-bold">How it works</h3>
      <div className="flex flex-col gap-5 text-xs">
        <p>
          GraphQL Debugger sits on your GraphQL server and collects traces from
          each query and mutation. It then aggregates these traces and displays
          them in this interface.
        </p>
        <p>
          The backend consists of a{" "}
          <LinkedText
            href="https://opentelemetry.io/docs/collector/"
            text="collector"
          />
          , that receives traces from your GraphQL server, and a aggregation
          layer that feeds this interface.
        </p>
        <p>
          To send traces to the collector you should trace your schema using the{" "}
          <LinkedText
            href="https://www.npmjs.com/package/@graphql-debugger/trace-schema"
            text="trace schema sdk"
          />
          . This will wrap each resolver in a span, that is then sent to the
          collector.
        </p>
      </div>
    </div>
  );
}
