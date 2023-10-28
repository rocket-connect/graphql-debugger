import { Trace } from "@graphql-debugger/types";

export function printTraceErrors(trace: Trace): string {
  const errorsJson = JSON.stringify(
    [
      ...(trace?.spans || []),
      ...(trace?.rootSpan ? [trace?.rootSpan] : []),
    ].reduce(
      (result, span) => {
        if (span.errorMessage || span.errorStack) {
          result[span.name] = {
            errorMessage: span.errorMessage,
            errorStack: span.errorStack,
          };
        }

        return result;
      },
      {} as Record<string, { errorMessage: any; errorStack: any }>,
    ),
  );

  return errorsJson;
}
