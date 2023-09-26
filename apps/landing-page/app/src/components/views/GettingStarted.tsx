import dedent from "dedent";
import { Language } from "prism-react-renderer";

import { CodeBlock } from "../utils/CodeBlock";
import { Container } from "../utils/Container";
import { Tabs, TabsContent } from "../utils/tabs";

const tabs = [
  {
    name: "yoga.ts",
    content: dedent`
      import {
        GraphQLOTELContext,
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
            GraphQLOTELContext: new GraphQLOTELContext(),
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
        <div className="py-20">
          <div className="flex gap-10">
            <div className="flex flex-col gap-10 my-auto">
              <h2 className="text-4xl font-bold">Getting Started</h2>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima
                beatae repellat, in et perferendis nesciunt explicabo deleniti
                debitis illum quae inventore nobis, dicta, nostrum quod atque
                dignissimos dolores doloribus modi.
              </p>

              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellat harum incidunt reiciendis culpa consequatur in
                repellendus ducimus iusto cum, commodi perspiciatis sunt facilis
                illo laborum cumque earum non, suscipit laboriosam.
              </p>

              <ul className="list-disc">
                <li>
                  <a
                    className="text-link underline font-bold"
                    href="https://github.com/rocket-connect/graphql-debugger"
                  >
                    https://github.com/rocket-connect/graphql-debugger
                  </a>
                </li>
                <li>
                  <a
                    className="text-link underline font-bold"
                    href="https://github.com/rocket-connect/graphql-debugger"
                  >
                    https://github.com/rocket-connect/graphql-debugger
                  </a>
                </li>
                <li>
                  <a
                    className="text-link underline font-bold"
                    href="https://github.com/rocket-connect/graphql-debugger"
                  >
                    https://github.com/rocket-connect/graphql-debugger
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div style={{ width: 550 }}>
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
