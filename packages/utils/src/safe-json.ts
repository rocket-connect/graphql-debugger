import safeJsonStringify from "safe-json-stringify";

export const excludedKeys = [
  "req",
  "_req",
  "request",
  "_request",
  "res",
  "_res",
  "params",
  "_params",
];

export function safeJson(object: any = {}) {
  return safeJsonStringify(object, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }

    if (typeof value === "function") {
      return "Function";
    }

    if (excludedKeys.includes(key)) {
      return undefined;
    }

    return value;
  });
}
