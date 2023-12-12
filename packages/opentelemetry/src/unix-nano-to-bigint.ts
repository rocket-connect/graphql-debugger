import { UnixNano } from "@graphql-debugger/types";

export function unixNanoToBigInt(time: UnixNano | string): bigint {
  const base = BigInt(2) ** BigInt(32);

  if (typeof time === "string") {
    const nanoTime = BigInt(time);

    const high = nanoTime / base;
    const low = nanoTime % base;

    return high * base + low;
  } else {
    const high = BigInt(time.high);
    const low = BigInt(time.low);

    return high * base + low;
  }
}
