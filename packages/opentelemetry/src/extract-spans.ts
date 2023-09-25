import { AttributeNames, ResourceSpans } from "@graphql-debugger/types";

import { parse, print } from "graphql";

import { attributesToObject } from "./attributes-to-object";

export function extractSpans({
  resourceSpans,
}: {
  resourceSpans: ResourceSpans[];
}) {
  const spans = resourceSpans.flatMap((resourceSpan) => {
    return resourceSpan.scopeSpans.flatMap((scopeSpan) => {
      return (scopeSpan.spans || []).map((span) => {
        const attributes = attributesToObject(span.attributes || []);

        const graphqlSchemaHash = attributes[AttributeNames.SCHEMA_HASH] as
          | string
          | undefined;
        let graphqlDocument: string | undefined;
        let graphqlVariables: string | undefined;
        let graphqlResult: string | undefined;
        let graphqlContext: string | undefined;
        let errorMessage: string | undefined;
        let errorStack: string | undefined;

        if (!span.parentSpanId) {
          const document = attributes[AttributeNames.DOCUMENT];
          if (document) {
            const parsed = parse(document);
            const printed = print(parsed);
            graphqlDocument = printed;
          }

          const variables = attributes[AttributeNames.OPERATION_ARGS];
          if (variables) {
            graphqlVariables = JSON.stringify(JSON.parse(variables));
          }

          const result = attributes[AttributeNames.OPERATION_RESULT];
          if (result) {
            graphqlResult = JSON.stringify({
              result: JSON.parse(result),
            });
          }

          const context = attributes[AttributeNames.OPERATION_CONTEXT];
          if (context) {
            graphqlContext = JSON.stringify({
              context: JSON.parse(context),
            });
          }
        }

        const firstError = (span.events || []).find(
          (e) => e.name === "exception",
        );
        if (firstError) {
          const message = firstError.attributes.find(
            (a) => a.key === "exception.message",
          );
          const stack = firstError.attributes.find(
            (a) => a.key === "exception.stacktrace",
          );
          errorMessage = message?.value.stringValue || "Unknown Error";
          errorStack = stack?.value.stringValue;
        }

        return {
          spanId: span.spanId,
          traceId: span.traceId,
          parentSpanId: span.parentSpanId,
          name: span.name,
          kind: span.kind,
          startTimeUnixNano: span.startTimeUnixNano,
          endTimeUnixNano: span.endTimeUnixNano,
          graphqlSchemaHash,
          graphqlDocument,
          graphqlVariables,
          graphqlResult,
          graphqlContext,
          errorMessage,
          errorStack,
        };
      });
    });
  });

  return spans;
}
