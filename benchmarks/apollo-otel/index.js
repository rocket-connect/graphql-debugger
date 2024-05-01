import opentelemetry from "@opentelemetry/api";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import {
  BasicTracerProvider,
  SimpleSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { ApolloServer } from "apollo-server";
import cluster from "cluster";
import { cpus } from "os";

process.env.PORT = "8000";

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "basic-service",
  }),
});

const exporter = new OTLPTraceExporter({});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

provider.register();

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }
} else {
  const server = new ApolloServer({
    typeDefs: `
        type Query {
          hello: String!
        }
      `,
    resolvers: {
      Query: {
        hello: (root, args, context, info) => {
          const tracer = opentelemetry.trace.getTracer("example-tracer");
          const span = tracer.startSpan("say-hello");
          span.setAttribute("hello-to", "world");
          span.setAttribute("query", JSON.stringify(info.operation));
          span.addEvent("invoking resolvers");
          span.end();
          return "world";
        },
      },
    },
  });

  server.listen(8000);
}
