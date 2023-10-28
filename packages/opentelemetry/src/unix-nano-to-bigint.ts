import { UnixNano } from "@graphql-debugger/types";

export function unixNanoToBigInt(time: UnixNano): bigint {
  const base = BigInt(2) ** BigInt(32);
  const high = BigInt(time.high);
  const low = BigInt(time.low);

  return high * base + low;
}
