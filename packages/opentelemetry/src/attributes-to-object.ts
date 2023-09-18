import { Attributes } from "@graphql-debugger/types";

export function attributesToObject(attributes: Attributes) {
  return attributes.reduce((acc, val) => {
    const value = val.value;
    let realValue: any;

    if (value.boolValue !== undefined) {
      realValue = value.boolValue;
    } else if (value.stringValue !== undefined) {
      realValue = value.stringValue;
    } else if (value.intValue !== undefined) {
      realValue = value.intValue;
    } else if (value.doubleValue !== undefined) {
      realValue = value.doubleValue;
    } else if (value.arrayValue !== undefined) {
      realValue = value.arrayValue;
    }

    return { ...acc, [val.key]: realValue };
  }, {}) as Record<string, any>;
}
