import {
  AttributeNames,
  ExtractedSpan,
  ResourceSpans,
} from "@graphql-debugger/types";

import { print } from "graphql";

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
        let errorMessage: string | undefined;
        let errorStack: string | undefined;

        if (attributes[AttributeNames.OPERATION_ROOT] === true) {
          const document = attributes[AttributeNames.DOCUMENT];
          if (document) {
            try {
              const astString = document;
              const ast = JSON.parse(astString);
              const printed = print(ast);
              graphqlDocument = printed;
            } catch (error) {
              debug("Error parsing document", error);
            }
          }
        }

        const remainingAttributes = Object.entries(attributes).reduce(
          (acc, [key, value]) => {
            if (
              key !== AttributeNames.SCHEMA_HASH &&
              key !== AttributeNames.DOCUMENT &&
              key !== AttributeNames.OPERATION_ROOT_NAME
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
          errorMessage,
          errorStack,
        };
      });
    });
  });

  return spans;
}
