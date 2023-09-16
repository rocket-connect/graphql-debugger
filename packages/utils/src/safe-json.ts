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
  "result",
  "_result",
];

export function safeJson(object: any = {}) {
  const obj = { ...object };
  excludedKeys.forEach((key) => {
    delete obj[key];
  });

  return safeJsonStringify(obj, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }

    if (typeof value === "function") {
      return "Function";
    }

    return value;
  });
}
