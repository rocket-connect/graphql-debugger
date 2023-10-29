import {
  AttributeNames,
  ExtractedSpan,
  ResourceSpans,
} from "@graphql-debugger/types";

import { parse, print } from "graphql";

import { attributesToObject } from "./attributes-to-object";
import { debug } from "./debug";
import { TRACER_NAME } from "./tracer";
import { unixNanoToBigInt } from "./unix-nano-to-bigint";

export function extractSpans({
  resourceSpans,
}: {
  resourceSpans: ResourceSpans[];
}): ExtractedSpan[] {
  const spans = resourceSpans.flatMap((resourceSpan) => {
    return resourceSpan.scopeSpans.flatMap((scopeSpan) => {
      let isForeignSpan = true;
      if (scopeSpan.scope?.name === TRACER_NAME) {
        isForeignSpan = false;
      }

      return (scopeSpan.spans || []).map((span) => {
        const attributes = attributesToObject(span.attributes || []);

        const graphqlSchemaHash = attributes[AttributeNames.SCHEMA_HASH] as
          | string
          | undefined;

        const graphqlOperationName = attributes[
          AttributeNames.OPERATION_ROOT_NAME
        ] as string | undefined;

        const graphqlOperationType = attributes[
          AttributeNames.OPERATION_TYPE
        ] as string | undefined;

        let graphqlDocument: string | undefined;
        let graphqlVariables: string | undefined;
        let graphqlResult: string | undefined;
        let graphqlContext: string | undefined;
        let errorMessage: string | undefined;
        let errorStack: string | undefined;

        if (attributes[AttributeNames.OPERATION_ROOT] === true) {
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

        const remainingAttributes = Object.entries(attributes).reduce(
          (acc, [key, value]) => {
            if (
              key !== AttributeNames.SCHEMA_HASH &&
              key !== AttributeNames.DOCUMENT &&
              key !== AttributeNames.OPERATION_ARGS &&
              key !== AttributeNames.OPERATION_RESULT &&
              key !== AttributeNames.OPERATION_CONTEXT &&
              key !== AttributeNames.OPERATION_ROOT_NAME &&
              key !== AttributeNames.OPERATION_TYPE
            ) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string>,
        );

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
          startTimeUnixNano: unixNanoToBigInt(
            span.startTimeUnixNano,
          ).toString(),
          endTimeUnixNano: unixNanoToBigInt(span.endTimeUnixNano).toString(),
          isForeign: isForeignSpan,
          attributes: remainingAttributes,
          graphqlSchemaHash,
          graphqlDocument,
          graphqlOperationName,
          graphqlOperationType,
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
