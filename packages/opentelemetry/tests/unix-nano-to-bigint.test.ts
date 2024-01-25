import { unixNanoToBigInt } from "../src/unix-nano-to-bigint";

describe("unixNanoToBigInt", () => {
  test("should correctly convert a string UnixNano timestamp to bigint", () => {
    const unixNanoString = "1622549651012345678";
    const expectedBigInt = BigInt(unixNanoString);

    const result = unixNanoToBigInt(unixNanoString);
    expect(result).toBe(expectedBigInt);
  });

  test("should correctly convert an object UnixNano timestamp to bigint", () => {
    const unixNanoObject = { high: 1622549651, low: 12345678 };
    const base = BigInt(2) ** BigInt(32);
    const expectedBigInt =
      BigInt(unixNanoObject.high) * base + BigInt(unixNanoObject.low);

    const result = unixNanoToBigInt(unixNanoObject);
    expect(result).toBe(expectedBigInt);
  });

  test("should handle edge case with zero values in object", () => {
    const unixNanoObject = { high: 0, low: 0 };
    const expectedBigInt = BigInt(0);

    const result = unixNanoToBigInt(unixNanoObject);
    expect(result).toBe(expectedBigInt);
  });

  test("should handle large values correctly", () => {
    const unixNanoObject = { high: 987654321, low: 123456789 };
    const base = BigInt(2) ** BigInt(32);
    const expectedBigInt =
      BigInt(unixNanoObject.high) * base + BigInt(unixNanoObject.low);

    const result = unixNanoToBigInt(unixNanoObject);
    expect(result).toBe(expectedBigInt);
  });
});
