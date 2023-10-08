import { AttributeNames, ResourceSpans } from "@graphql-debugger/types";

import { parse, print } from "graphql";

import { attributesToObject } from "./attributes-to-object";
import { debug } from "./debug";
import { TRACER_NAME } from "./tracer";

export function extractSpans({
  resourceSpans,
}: {
  resourceSpans: ResourceSpans[];
}) {
  const spans = resourceSpans.flatMap((resourceSpan) => {
    return resourceSpan.scopeSpans.flatMap((scopeSpan) => {
      let isForeignSpan = true;
      if (scopeSpan.scope?.name === TRACER_NAME) {
        isForeignSpan = false;
      }

      return (scopeSpan.spans || []).map((span) => {
        if (!isForeignSpan) {
          // console.log(JSON.stringify(span, null, 2));
        }
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
            try {
              const parsed = parse(document);
              const printed = print(parsed);
              graphqlDocument = printed;
            } catch (error) {
              debug("Error parsing document", error);
            }
          }

          const variables = attributes[AttributeNames.OPERATION_ARGS];
          if (variables) {
            try {
              graphqlVariables = JSON.stringify(JSON.parse(variables));
            } catch (error) {
              debug("Error parsing variables", error);
            }
          }

          const result = attributes[AttributeNames.OPERATION_RESULT];
          if (result) {
            try {
              graphqlResult = JSON.stringify(JSON.parse(result));
            } catch (error) {
              debug("Error parsing result", error);
            }
          }

          const context = attributes[AttributeNames.OPERATION_CONTEXT];
          if (context) {
            try {
              graphqlContext = JSON.stringify(JSON.parse(context));
            } catch (error) {
              debug("Error parsing context", error);
            }
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
          isForeign: isForeignSpan,
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
