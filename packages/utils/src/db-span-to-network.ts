import { Span as DBSpan } from "@graphql-debugger/data-access";
import { TimeStamp, UnixNanoTimeStamp } from "@graphql-debugger/time";
import { Span as NetworkSpan } from "@graphql-debugger/types";

export function dbSpanToNetwork(dbSpan: DBSpan): NetworkSpan {
  return {
    id: dbSpan.id,
    spanId: dbSpan.spanId,
    parentSpanId: dbSpan.parentSpanId as string,
    traceId: dbSpan.traceId,
    name: dbSpan.name as string,
    kind: dbSpan.kind,
    startTimeUnixNano: new UnixNanoTimeStamp(
      dbSpan.startTimeUnixNano,
    ).toString(),
    endTimeUnixNano: new UnixNanoTimeStamp(dbSpan.endTimeUnixNano).toString(),
    durationNano: new UnixNanoTimeStamp(dbSpan.durationNano).toString(),
    graphqlDocument: dbSpan.graphqlDocument,
    graphqlVariables: dbSpan.graphqlVariables,
    graphqlResult: dbSpan.graphqlResult,
    graphqlContext: dbSpan.graphqlContext,
    graphqlOperationName: dbSpan.graphqlOperationName,
    graphqlOperationType: dbSpan.graphqlOperationType,
    createdAt: new TimeStamp(dbSpan.createdAt).toString(),
    updatedAt: new TimeStamp(dbSpan.updatedAt).toString(),
    errorMessage: dbSpan.errorMessage,
    errorStack: dbSpan.errorStack,
    isForeign: dbSpan.isForeign,
    attributes: dbSpan.attributes as string,
  };
}
