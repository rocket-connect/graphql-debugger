// Matching spec https://opentelemetry.io/docs/specs/otel/trace/semantic_conventions/instrumentation/graphql/
export enum AttributeNames {
  OPERATION_NAME = "graphql.operation.name",
  OPERATION_TYPE = "graphql.operation.type",

  DOCUMENT = "graphql.document",
  SCHEMA_HASH = "graphql.schema.hash", // Non-Spec attribute
  OPERATION_ARGS = "graphql.operation.args", // Non-Spec attribute
  OPERATION_CONTEXT = "graphql.operation.context", // Non-Spec attribute
  OPERATION_RESULT = "graphql.operation.result", // Non-Spec attribute
  OPERATION_RETURN_TYPE = "graphql.operation.returnType", // Non-Spec attribute
  OPERATION_ROOT = "graphql.operation.root", // Non-Spec attribute
}
