import dedent from "dedent";
import { Language } from "prism-react-renderer";

import { CodeBlock } from "../utils/CodeBlock";
import { Container } from "../utils/Container";
import { npxGraphQLDebugger } from "../utils/images";
import { Tabs, TabsContent } from "../utils/tabs";

const tabs = [
  {
    name: "yoga.ts",
    content: dedent`
      import {
        GraphQLDebuggerContext,
        traceSchema,
      } from "@graphql-debugger/trace-schema";
      
      import { makeExecutableSchema } from "@graphql-tools/schema";
      import { createYoga } from "graphql-yoga";
      
      // Common GraphQL schema
      const schema = makeExecutableSchema({
        typeDefs,
        resolvers,
      });
      
      // Wrap all resolvers and fields with tracing
      const tracedSchema = traceSchema({
        schema,
      });
      
      const yoga = createYoga({
        schema: tracedSchema,
        context: (req) => {
          return {
            // Include variables, result and context in traces
            GraphQLDebuggerContext: new GraphQLDebuggerContext(),
          };
        },
      });
    `,
    language: "javascript",
  },
];

type TrafficLightsIconProps = React.SVGProps<SVGSVGElement>;

function TrafficLightsIcon(props: TrafficLightsIconProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 42 10" fill="none" {...props}>
      <title>traffic lights menu</title>
      <circle cx="5" cy="5" r="4.5" fill="#ef4444" />
      <circle cx="21" cy="5" r="4.5" fill="#fbbf24" />
      <circle cx="37" cy="5" r="4.5" fill="#22c55e" />
    </svg>
  );
}

export function GettingStarted() {
  return (
    <div className="bg-graphiql-medium text-graphiql-light">
      <Container>
        <div className="py-20 lg:w-5/6 lg:mx-auto gap-10">
          <div className="flex flex-col xl:flex-row gap-10">
            <div className="flex flex-col gap-10 my-auto">
              <h2 className="text-4xl font-bold">Getting Started</h2>
              <p>
                To begin using GraphQL Debugger, you'll need to follow two
                steps: first, apply tracing to your GraphQL schema, and then
                initiate the debugger.
              </p>
              <p>
                To apply tracing to your GraphQL Schema, you should use the{" "}
                <span className="text-string">'traceSchema'</span> method
                exported from the{" "}
                <span className="text-string">
                  '@graphql-debuggger/trace-schema'
                </span>{" "}
                <a
                  className="text-link"
                  href="https://www.npmjs.com/package/@graphql-debugger/trace-schema"
                >
                  npm package
                </a>
                . You can use this method to wrap each resolver and field in
                your GraphQL Schema in an OpenTelemetry span. Each span is
                propagated to the GraphQL Debugger Collector, where it is
                ingested and then later presented to you in the UI.
              </p>
              <p>
                Running the GraphQL Debugger Collector and user interface is as
                simple as running one command{" "}
                <span className="text-string">'npx graphql-debugger'</span> in
                your terminal, and then from here you can navigate to{" "}
                <a className="text-link" href="http://localhost:16686/">
                  http://localhost:16686/
                </a>{" "}
                to start exploring your traces.
              </p>
              <div className="w-60 my-10 mx-auto">
                <img src={npxGraphQLDebugger} alt="npx graphql-debugger" />
              </div>
            </div>
            <div className="my-auto">
              <div className="mx-auto w-full md:w-5/6 my-auto">
                <Tabs defaultValue="yoga.ts">
                  <div className="relative rounded-2xl bg-graphiql-dark">
                    <div className="px-4 pt-4">
                      <TrafficLightsIcon className="h-2.5 w-auto" />
                      {tabs.map((tab) => (
                        <TabsContent
                          key={tab.name}
                          value={tab.name}
                          className="m-0"
                        >
                          <div className="mt-3">
                            <CodeBlock
                              code={tab.content}
                              language={tab.language as Language}
                            />
                          </div>
                        </TabsContent>
                      ))}
                    </div>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
